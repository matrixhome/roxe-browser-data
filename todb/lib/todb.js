const rpc = require('../tools/rpc')
const pool = require('../tools/mysql').MysqlPool
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('block.json')
const db = low(adapter)

var exec = require("child_process").exec;

// get synthonided block last id 从库中读取同步到的块编号
let block_num = 0
let block_num_rpc = 0


// 从rpc 获取最新的块
async function getBlockNumByRpc() {
  let blockInfo = await rpc.getBlockInfo()
  block_num_rpc = blockInfo.head_block_num
}

// 库中的块编号小于rpc的块，则开始同步
async function synthonizeBlock() {
  if(db.get('id').value()) {
    block_num = db.get('id').value()
  } else {
    // Set some defaults (required if your JSON file is empty)
    db.defaults({ id: 0 }).write()
  }
  await getBlockNumByRpc()
  console.log('get block_num_rpc', block_num_rpc)

  if(block_num < block_num_rpc) {
    for(var i=block_num + 1; i<=block_num_rpc; i++) {
      let block = await rpc.getBlockByID(i)
      block_num = i
      if(block.transactions.length > 0) {
        for(var p=0; p<block.transactions.length; p++) {

          let hash_ = block.transactions[p].trx.id
          let cpu = block.transactions[p].cpu_usage_us
          let net = block.transactions[p].net_usage_words
          
          if(block.transactions[p].hasOwnProperty('trx') && 
              block.transactions[p].trx.hasOwnProperty('transaction') && 
              block.transactions[p].trx.transaction.actions.length > 0) {
            let expiration = block.transactions[p].trx.transaction.expiration

            //traces
            let trace = await getTransaction(hash_, block_num)
            if(trace && trace.traces) {
              for(var p=0; p<trace.traces.length; p++) {
                if(trace.traces[p].act.name === 'transfer') {
                  // create asset
                  let contract = trace.traces[p].act.account
                  let ufrom = trace.traces[p].act.data.from
                  let uto = trace.traces[p].act.data.to
                  let quantity = trace.traces[p].act.data.quantity
                  let asset = quantity.split(' ')
    
                  //资产大于0才处理
                  if(asset.length >0 && asset[0] >= 0) {
                    let account = await pool.then(function(conn) {
                      return conn.query('select * from assets where username = ? and contract_ = ? and symbol = ?', [uto, contract, asset[1]]);
                    })
                    if(!account[0]) {
                      // add to user asset
                      pool.then(function(conn) {
                        return conn.query('insert into assets (username, contract_, quantity, symbol) ' + 
                        'VALUES (?, ?, ?, ?)', [uto, contract, asset[0], asset[1]])
                      })
                    } 

                    // update from user asset
                    if(ufrom) {
                      let fbalancer = await rpc.getCurrencyBalance(contract, ufrom, asset[1])
                      if(fbalancer[0]) {
                        let fasset = fbalancer[0].split(' ')
                        pool.then(function(conn) {
                          return conn.query('UPDATE assets set quantity = ? where contract_ = ? ' + 
                            'and username = ? and symbol = ?', [fasset[0], contract, ufrom, asset[1]]);
                        })
                      }
                    }

                    // update to user asset
                    if(uto) {
                      let tbalancer = await rpc.getCurrencyBalance(contract, uto, asset[1])
                      if(tbalancer[0]) {
                        let tasset = tbalancer[0].split(' ')
                        pool.then(function(conn) {
                          return conn.query('UPDATE assets set quantity = ? where contract_ = ? ' + 
                            'and username = ? and symbol = ?', [tasset[0], contract, uto, asset[1]]);
                        })
                      }
                    }
                  }
                }
              }
            } 

            for(var x=0; x<block.transactions[p].trx.transaction.actions.length; x++) {
              let contract = block.transactions[p].trx.transaction.actions[x].account
              let action = block.transactions[p].trx.transaction.actions[x].name
              let actor = block.transactions[p].trx.transaction.actions[x].authorization[0].actor
              let data = block.transactions[p].trx.transaction.actions[x].data
  
              // add token
              if(contract === 'roxe.ro' && action === 'create') {
                
                let maximum_supply = block.transactions[p].trx.transaction.actions[x].data.maximum_supply
                let maxsupply = maximum_supply.split(' ')
  
                pool.then(function(conn) {
                  return conn.query('insert into tokens (contract_, symbol, maxsupply) ' + 
                  'VALUES (?, ?, ?)', [contract, maxsupply[1], maxsupply[0]]);
                })
              }


              if(contract === 'roxe' && action === 'newaccount') {
                // create account 
                let name = block.transactions[p].trx.transaction.actions[x].data.name
                let ownerkey = block.transactions[p].trx.transaction.actions[x].data.owner.keys[0].key
                let activekey = block.transactions[p].trx.transaction.actions[x].data.active.keys[0].key
                let creator = block.transactions[p].trx.transaction.actions[x].data.creator
  
                pool.then(function(conn) {
                  return conn.query('insert into accounts (username, ownerkey, activekey, creator) ' + 
                  'VALUES (?, ?, ?, ?)', [name, ownerkey, activekey, creator]);
                })
              }
  
              pool.then(function(conn) {
                return conn.query('insert into transactions (hash_, expiration, block_num, ' + 
                ' contract_, action_, data_, cpu, net, actor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [hash_, expiration, block_num, 
                  contract, action, JSON.stringify(data), cpu, net, actor]);
              })
  
              // add new asset   
              if(action === 'issue') {
                // create asset
                let ufrom = block.transactions[p].trx.transaction.actions[x].data.from
                let uto = block.transactions[p].trx.transaction.actions[x].data.to
                let quantity = block.transactions[p].trx.transaction.actions[x].data.quantity
                let asset = quantity.split(' ')
  
                //资产大于0才处理
                if(asset.length >0 && asset[0] >= 0) {
                  let account = await pool.then(function(conn) {
                    return conn.query('select * from assets where username = ? and contract_ = ? and symbol = ?', [uto, contract, asset[1]]);
                  })
                  if(!account[0]) {
                    // add to user asset
                    pool.then(function(conn) {
                      return conn.query('insert into assets (username, contract_, quantity, symbol) ' + 
                      'VALUES (?, ?, ?, ?)', [uto, contract, asset[0], asset[1]])
                    })
                  } 

                  // update from user asset
                  if(ufrom) {
                    let fbalancer = await rpc.getCurrencyBalance(contract, ufrom, asset[1])

                    if(fbalancer[0]) {
                      let fasset = fbalancer[0].split(' ')
                      pool.then(function(conn) {
                        return conn.query('UPDATE assets set quantity = ? where contract_ = ? ' + 
                          'and username = ? and symbol = ?', [fasset[0], contract, ufrom, asset[1]]);
                      })
                    }
                  }
                  

                  // update to user asset
                  if(uto) {
                    let tbalancer = await rpc.getCurrencyBalance(contract, uto, asset[1])
                    if(tbalancer[0]) {
                      let tasset = tbalancer[0].split(' ')
                      pool.then(function(conn) {
                        return conn.query('UPDATE assets set quantity = ? where contract_ = ? ' + 
                          'and username = ? and symbol = ?', [tasset[0], contract, uto, asset[1]]);
                      })
                    }
                  }
                }
              }

  
              // update asset
              if(action === 'transfer') {
                // create asset
                let ufrom = block.transactions[p].trx.transaction.actions[x].data.from
                let uto = block.transactions[p].trx.transaction.actions[x].data.to
                let quantity = block.transactions[p].trx.transaction.actions[x].data.quantity
                let asset = quantity.split(' ')
  
                //资产大于0才处理
                if(asset.length >0 && asset[0] >= 0) {
                  let account = await pool.then(function(conn) {
                    return conn.query('select * from assets where username = ? and contract_ = ? and symbol = ?', [uto, contract, asset[1]]);
                  })
                  if(!account[0]) {
                    // add to user asset
                    pool.then(function(conn) {
                      return conn.query('insert into assets (username, contract_, quantity, symbol) ' + 
                      'VALUES (?, ?, ?, ?)', [uto, contract, asset[0], asset[1]])
                    })
                  } 

                  // update from user asset
                  if(ufrom) {
                    let fbalancer = await rpc.getCurrencyBalance(contract, ufrom, asset[1])
                    if(fbalancer[0]) {
                      let fasset = fbalancer[0].split(' ')
                      pool.then(function(conn) {
                        return conn.query('UPDATE assets set quantity = ? where contract_ = ? ' + 
                          'and username = ? and symbol = ?', [fasset[0], contract, ufrom, asset[1]]);
                      })
                    }
                  }


                  // update to user asset
                  if(uto) {
                    let tbalancer = await rpc.getCurrencyBalance(contract, uto, asset[1])
                    if(tbalancer[0]) {
                      let tasset = tbalancer[0].split(' ')
                      pool.then(function(conn) {
                        return conn.query('UPDATE assets set quantity = ? where contract_ = ? ' + 
                          'and username = ? and symbol = ?', [tasset[0], contract, uto, asset[1]]);
                      })
                    }
                  }
                }
              }

              // update asset
              // if(action === 'retire') {
              //   // create asset
              //   let ufrom = block.transactions[p].trx.transaction.actions[x].data.from
              //   let quantity = block.transactions[p].trx.transaction.actions[x].data.quantity
              //   let asset = quantity.split(' ')
  
              //   //资产大于0才处理
              //   if(asset.length >0 && asset[0] >= 0) {
              //     // update from user asset
              //     pool.then(function(conn) {
              //       return conn.query('UPDATE assets set quantity = quantity - ? where contract_ = ? ' + 
              //         'and username = ? and symbol = ?', [asset[0], contract, ufrom, asset[1]]);
              //     })
              //   }
              // }
            }
          }
          
        }

      } else {
        //空块 
        
      }
      // 下一块
      db.update('id', n => n + 1).write()
    }
  } 
  await wait(1000)
  synthonizeBlock()
}


async function getTransaction(hash, block_num) {

  return new Promise(function(resolve, reject) {
    // 
    // var cmd = 'cd /data/roxe_bak && ./clroxe get transaction ' + hash + ' -b ' + block_num
    var cmd = 'cd /data/RoxeChain_bak && ./clroxe get transaction ' + hash + ' -b ' + block_num
      exec(cmd,{
          maxBuffer: 1024 * 2000
      }, function(err, stdout, stderr) {
          if (err) {
              console.log(err);
              reject(err);
          } else if (stderr.lenght > 0) {
              reject(new Error(stderr.toString()));
          } else {
              let trace = JSON.parse(stdout)
              resolve(trace.traces);
          }
      })
  })
}

// 函数实现，参数单位 毫秒 ；
function wait(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
};



module.exports = {
    synthonizeBlock: synthonizeBlock,
    getBlockNumByRpc: getBlockNumByRpc
}