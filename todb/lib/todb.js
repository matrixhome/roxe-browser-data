const rpc = require('../tools/rpc')
const pool = require('../tools/mysql').MysqlPool
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('block.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
// db.defaults({ id: 1 }).write()

// get synthonided block last id 从库中读取同步到的块编号
let block_num = db.get('id').value()
let block_num_rpc = 0


// 从rpc 获取最新的块
async function getBlockNumByRpc() {
  let blockInfo = await rpc.getBlockInfo()
  block_num_rpc = blockInfo.head_block_num
}

// 库中的块编号小于rpc的块，则开始同步
async function synthonizeBlock() {
  await getBlockNumByRpc()
  console.log('block_num_rpc', block_num_rpc)

  if(block_num < block_num_rpc) {
    for(var i=block_num + 1; i<block_num_rpc; i++) {
      let block = await rpc.getBlockByID(i)
      if(block.transactions.size > 0) {
        for(var p=0; p<block.transactions.size; p++) {
          let hash_ = block.transactions[p].trx.id
          let expiration = block.transactions[p].expiration
          let ref_block_num = block.transactions[p].ref_block_num
          let ref_block_prefix = block.transactions[p].ref_block_prefix
          let cpu = block.transactions[p].cpu_usage_us
          let net = block.transactions[p].net_usage_words

          for(var p=0; p<block.transactions[p].actions.size; p++) {
            let contract = block.transactions[p].actions[p].account
            let action = block.transactions[p].actions[p].name
            let data = block.transactions[p].actions[p].data

            if(contract === 'roxe' && action === 'newaccount') {
              // create account 
              let name = block.transactions[p].actions[p].data.name
              let ownerkey = block.transactions[p].actions[p].data.owner.keys[0].key
              let activekey = block.transactions[p].actions[p].data.active.keys[0].key
              let creator = block.transactions[p].actions[p].data.creator

              pool.then(function(conn) {
                return conn.query('insert into accounts (username, ownerkey, activekey, creator) ' + 
                'VALUES (?, ?, ?, ?)', [name, ownerkey, activekey, creator]);
              })
            }

            pool.then(function(conn) {
              return conn.query('insert into transactions (hash_, expiration, ref_block_num, ref_block_prefix, ' + 
              ' contract_, action_, data_, cpu, net) VALUES (?, ?, ?, ?, ?, ?, ?)', [hash_, expiration, ref_block_num, 
                ref_block_prefix, contract, action, data, cpu, net]);
            })


            if(action === 'transfer') {
              // create asset
              let ufrom = block.transactions[p].actions[p].data.from
              let uto = block.transactions[p].actions[p].data.to
              let quantity = block.transactions[p].actions[p].data.quantity
              let asset = quantity.sprilt(' ')

              //资产大于0才处理
              if(asset.size >0 && asset[0] >= 0) {
                let account = await pool.then(function(conn) {
                  return conn.query('select * from assets where username = ? and contract_ = ?', [uto, contract]);
                })
                if(account[0]) {
                  // update to user asset
                  pool.then(function(conn) {
                    return conn.query('UPDATE assets set quantity = quantity + ? where contract_ = ? ' + 
                      ' and username = ? ', [asset[0], contract, uto]);
                  })
                } else {
                  // add to user asset
                  pool.then(function(conn) {
                    return conn.query('insert into assets (username, contract_, quantity, symbol) ' + 
                    'VALUES (?, ?, ?, ?)', [uto, contract, asset[0], asset[1]])
                  })
                }
                // update from user asset
                pool.then(function(conn) {
                  return conn.query('UPDATE assets set quantity = quantity - ? where contract_ = ? ' + 
                    ' and username = ? ', [asset[0], contract, ufrom]);
                })
              }
            }
          }
        }

      } else {
        //空块
        console.log(i)
        db.update('id', n => n + 1).write()
      }
    }
  } else {
    synthonizeBlock()
  }
}

module.exports = {
    synthonizeBlock: synthonizeBlock,
}