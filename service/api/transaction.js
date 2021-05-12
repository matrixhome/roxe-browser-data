const rpc = require('../tools/rpc')
const pool = require('../tools/mysql').MysqlPool


/**
 * @api {get} /getTransaction
 * @apiGroup transaction
 * @apiVersion 1.0.0
 * @apiDescription 根据hash查询transaction
 *
 * @apiParam {string} hash
 */
async function getTransaction(ctx) {
    let hash = ctx.request.query.hash
    let transaction = await pool.then(function(conn) {
      return conn.query('select * from transactions where hash_ = ?', [hash]);
    })
    ctx.body = transaction
}


/**
 * @api {get} /getTransactionCount
 * @apiGroup transaction
 * @apiVersion 1.0.0
 * @apiDescription 获取transaction 总数
 *
 * @apiParam {string} hash
 */
 async function getTransactionCount(ctx) {
  let num = await pool.then(function(conn) {
    return conn.query('select id from transactions order by id desc limit 1');
  })
  ctx.body = num
}

/**
 * @api {get} /getTransByBlock
 * @apiGroup transaction
 * @apiVersion 1.0.0
 * @apiDescription 查询最新的transaction
 * @apiParam {string} block 区块数
 * @apiParam {string} startid 起点
 * @apiParam {string} num 显示笔数
 */
async function getTransactionsByBlock(ctx) {
    let block = ctx.request.query.block
    let startid = ctx.request.query.startid
    let num = ctx.request.query.num
  
    let trans = await pool.then(function(conn) {
      return conn.query('select * from transactions where block_num = ? order by id desc limit ?,?', [block, parseInt(startid), parseInt(num)]);
    })
    ctx.body = trans
}

/**
 * @api {get} /getTransactionList
 * @apiGroup transaction
 * @apiVersion 1.0.0
 * @apiDescription 查询最新的transaction列表
 *
 * @apiParam {string} num 显示笔数
 */
 async function getTransactionList(ctx) {
  let num = ctx.request.query.num
  let trans = await pool.then(function(conn) {
    return conn.query('select * from transactions order by id desc limit ? ', [parseInt(num)]);
  })
  ctx.body = trans
}


/**
 * @api {get} /getTransByAccount
 * @apiGroup transaction
 * @apiVersion 1.0.0
 * @apiDescription 查询最新的transaction
 * @apiParam {string} account 帐号名
 * @apiParam {string} startid 起点
 * @apiParam {string} num 显示笔数
 */
 async function getTransByAccount(ctx) {
  let account = ctx.request.query.account
  let startid = ctx.request.query.startid
  let num = ctx.request.query.num

  let trans = await pool.then(function(conn) {
    return conn.query("select * from transactions where actor = ? or data_->'$.to' = ? order by id desc limit ?,?", [account, account, parseInt(startid), parseInt(num)]);
  })
  ctx.body = trans
}

/**
 * @api {get} /getTransByContract
 * @apiGroup transaction
 * @apiVersion 1.0.0
 * @apiDescription 查询合约下的transaction
 * @apiParam {string} contract 合约
 * @apiParam {string} symbol 币种
 * @apiParam {string} startid 起点
 * @apiParam {string} num 显示笔数
 */
 async function getTransByContract(ctx) {
  let contract = ctx.request.query.contract
  let symbol = ctx.request.query.symbol
  let startid = ctx.request.query.startid
  let num = ctx.request.query.num

  console.log('contract', contract)
  console.log('symbol', symbol)
  console.log('startid', startid)
  console.log('num', num)

  let trans = await pool.then(function(conn) {
    return conn.query("select * from transactions where contract_ = ? and data_->'$.quantity' like '%" + symbol + "%' order by id desc limit ?,? ", [contract, parseInt(startid), parseInt(num)]);
  })
  ctx.body = trans
}

module.exports = {
    getTransaction: getTransaction,
    getTransactionsByBlock: getTransactionsByBlock,
    getTransactionCount: getTransactionCount,
    getTransactionList: getTransactionList,
    getTransByAccount: getTransByAccount,
    getTransByContract: getTransByContract,
}
