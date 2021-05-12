const rpc = require('../tools/rpc')
const pool = require('../tools/mysql').MysqlPool
const exec = require("child_process").exec;
const path = 'cd /data/RoxeChain_bak'
const path = 'cd /data/roxe_bak'

/**
 * @api {get} /getAccountDetail
 * @apiGroup account
 * @apiVersion 1.0.0
 * @apiDescription 获取账号详细信息
 * @apiParam {String} account
 * 
 */
async function getAccountDetail(ctx) {
    let accountname = ctx.request.query.account
    let account = {
        detail: '',
        tokens: '',
        by: ''
    }
    account.detail = await rpc.getAccountDetail(accountname)
    account.tokens = await pool.then(function(conn) {
        return conn.query('select a.*, t.price, t.logo from assets a inner join tokens t on a.contract_=t.contract_ and a.symbol=t.symbol where a.username = ?', [accountname]);
      })
    account.by = await pool.then(function(conn) {
      return conn.query('select creator from accounts where username = ?', [accountname]);
    })
    // only prod env
    rebalance(account.tokens)

    ctx.body = account
}

/**
 * @api {get} /setTokenPrice
 * @apiGroup account
 * @apiVersion 1.0.0
 * @apiDescription 送价格
 * @apiParam {String} symbol
 * @apiParam {String} contract
 * @apiParam {String} price
 */
async function setTokenPrice(ctx) {
  let symbol = ctx.request.query.symbol
  let contract = ctx.request.query.contract
  let price = ctx.request.query.price
  let result = await pool.then(function(conn) {
      return conn.query('update tokens set price = ? where symbol = ? and contract_ = ? ', 
        [price, symbol, contract]);
  })
  ctx.body = result
}

/**
 * @api {get} /getNodeList
 * @apiGroup account
 * @apiVersion 1.0.0
 * @apiDescription 获取超级节点
 */
async function getNodeList(ctx) {
    let nodes = await rpc.getTableLow('roxe', 'roxe', 'producers')
    ctx.body = nodes
}

/**
 * @api {get} /getAccountCount
 * @apiGroup account
 * @apiVersion 1.0.0
 * @apiDescription 获取account 总数
 */
 async function getAccountCount(ctx) {
    let num = await pool.then(function(conn) {
      return conn.query('select id from accounts order by id desc limit 1');
    })
    ctx.body = num
  }

/**
 * @api {get} /getTokens
 * @apiGroup account
 * @apiVersion 1.0.0
 * @apiDescription 获取token 列表
 */
 async function getTokens(ctx) {
    let num = await pool.then(function(conn) {
      return conn.query('select * from tokens');
    })
    // only prod env
    reCurrency(num)
    ctx.body = num
  }


  /**
 * @api {get} /getToken
 * @apiGroup account
 * @apiVersion 1.0.0
 * @apiDescription 获取token 详情及 holder列表
 * @apiParam {String} contract
 * @apiParam {String} symbol
 */
 async function getToken(ctx) {
  let contract = ctx.request.query.contract
  let symbol = ctx.request.query.symbol
  let detail = await pool.then(function(conn) {
    return conn.query('select * from tokens where contract_ = ? and symbol = ?', [contract, symbol]);
  })
  let holders = await pool.then(function(conn) {
    return conn.query('select * from assets where contract_ = ? and symbol = ?', [contract, symbol]);
  })
  let result = {
    detail: detail,
    holders: holders
  }
  ctx.body = result
}

async function rebalance(assets) {
  if(assets) {
    for(var i=0; i<assets.length; i++) {
      let asset = assets[i]
      //traces
      if(asset) {
        let result = await getCurrencyBalancer(asset.contract_, asset.username, asset.symbol)
        if(result[0]) {
          let balance = result.split(' ')
          pool.then(function(conn) {
            return conn.query('update assets set quantity = ? where username = ? and contract_ = ? and symbol = ? ', 
              [balance[0], asset.username, asset.contract_, asset.symbol]);
          })
        }
      }
    }
  }
}

async function getCurrencyBalancer(contact, account, symbol) {

  return new Promise(function(resolve, reject) {
    var cmd = path + ' && ./clroxe get currency balance ' + contact + ' ' + account + ' ' + symbol
      exec(cmd,{
          maxBuffer: 1024 * 2000
      }, function(err, stdout, stderr) {
          if (err) {
              console.log(err);
              reject(err);
          } else if (stderr.lenght > 0) {
              reject(new Error(stderr.toString()));
          } else {
              resolve(stdout);
          }
      })
  })
}


async function reCurrency(assets) {
  if(assets) {
    for(var i=0; i<assets.length; i++) {
      let asset = assets[i]
      //traces
      if(asset) {
        let result = await getCurrencyStats(asset.contract_, asset.symbol)

        for(var key in result) {
          if(result[key].supply) {
            let supply = result[key].supply.split(' ')
            let max = result[key].max_supply.split(' ')
            pool.then(function(conn) {
              return conn.query('update tokens set supply = ?, maxsupply = ? where contract_ = ? and symbol = ? ', 
                [supply[0] + '', max[0] + '', asset.contract_, asset.symbol]);
            })
          }
        }
      }
    }
  }
}

async function getCurrencyStats(contact, symbol) {

  return new Promise(function(resolve, reject) {
    var cmd = path + ' && ./clroxe get currency stats ' + contact + ' ' + symbol
      exec(cmd,{
          maxBuffer: 1024 * 2000
      }, function(err, stdout, stderr) {
          if (err) {
              console.log(err);
              reject(err);
          } else if (stderr.lenght > 0) {
              reject(new Error(stderr.toString()));
          } else {
            let result = JSON.parse(stdout)
            resolve(result)
          }
      })
  })
}


/**
 * @api {get} /getAccounts
 * @apiGroup account
 * @apiVersion 1.0.0
 * @apiDescription 获取account list
 * @apiParam {string} startid 起点
 * @apiParam {string} num 显示笔数
 */
 async function getAccounts(ctx) {
  let startid = ctx.request.query.startid
  let num = ctx.request.query.num
  let result = await pool.then(function(conn) {
    return conn.query("select a.username, s.quantity as qty, s.quantity/t.maxsupply as per from accounts a " +
      "left join assets s on a.username=s.username and s.symbol='ROC' and s.contract_='roxe.token' " + 
      "left join tokens t on s.symbol= t.symbol and s.contract_=t.contract_ order by qty desc limit ?, ? ", 
      [parseInt(startid), parseInt(num)]);
  })
  ctx.body = result
}

module.exports = {
    getAccountDetail: getAccountDetail,
    getNodeList: getNodeList,
    getAccountCount: getAccountCount,
    getTokens: getTokens,
    getToken: getToken,
    setTokenPrice: setTokenPrice,
    getAccounts: getAccounts
}
