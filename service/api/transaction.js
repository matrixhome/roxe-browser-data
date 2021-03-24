const rpc = require('../tools/rpc')
const { pgsqlPool } = require('../tools/postgresql')


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
    let transaction = await pgsqlPool.connect().then(client => {
        return client
          .query('SELECT * FROM "chain".transaction_trace where id = $1 ', [hash])
          .then(res => {
            client.release()
            console.log(res.rows)
            return res.rows
          })
          .catch(err => {
            client.release()
            console.log(err.stack)
          })
      })
    console.log('transaction', transaction)
    ctx.body = transaction
}


/**
 * @api {get} /getTransactionList
 * @apiGroup transaction
 * @apiVersion 1.0.0
 * @apiDescription 查询最新的transaction
 *
 * @apiParam {string} num 显示笔数
 */
async function getTransactionList(ctx) {
    let num = ctx.request.query.num
  
    let tran = await pgsqlPool.connect().then(client => {
        return client
          .query('SELECT * FROM "chain".transaction_trace LIMIT ' + num)
          .then(res => {
            client.release()
            console.log(res.rows)
            return res.rows
          })
          .catch(err => {
            client.release()
            console.log(err.stack)
          })
      })
    ctx.body = tran
}

/**
 * @api {get} /getTransByBlock
 * @apiGroup transaction
 * @apiVersion 1.0.0
 * @apiDescription 查询最新的transaction
 *
 * @apiParam {string} num 显示笔数
 */
async function getTransactionsByBlock(ctx) {
    let block = ctx.request.query.block
    let num = ctx.request.query.num
  
    let trans = await pgsqlPool.connect().then(client => {
        return client
          .query('SELECT * FROM "chain".transaction_trace where block_num=' + block
            + 'order by partial_expiration desc LIMIT ' + num)
          .then(res => {
            client.release()
            console.log(res.rows)
            return res.rows
          })
          .catch(err => {
            client.release()
            console.log(err.stack)
          })
      })
    ctx.body = trans
}


module.exports = {
    getTransaction: getTransaction,
    getTransactionList: getTransactionList,
    getTransactionsByBlock: getTransactionsByBlock
}