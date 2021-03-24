const rpc = require('../tools/rpc')
const { pgsqlPool } = require('../tools/postgresql')


/**
 * @api {get} /getBlock
 * @apiGroup block
 * @apiVersion 1.0.0
 * @apiDescription 根据区块id获取区块信息
 *
 * @apiParam {String} id
 */
async function getBlock(ctx) {
    let id = ctx.request.query.id
    let detail = await rpc.getBlockByID(id)
    ctx.body = detail
}

/**
 * @api {get} /getBlockInfo
 * @apiGroup block
 * @apiVersion 1.0.0
 * @apiDescription 根据最新区块信息
 */
async function getBlockInfo(ctx) {
  let detail = await rpc.getBlockInfo()
  ctx.body = detail
}

/**
 * @api {get} /getBlockList
 * @apiGroup block
 * @apiVersion 1.0.0
 * @apiDescription 根据区块num坐标获取区块分页数据
 *
 * @apiParam {String} startId 例：100，会取回小于100的区块 0 或者不传取最新区块
 * @apiParam {String} num num 每页显示的笔数
 */
async function getBlockList(ctx) {
    let startId = ctx.request.query.startId
    let num = ctx.request.query.num
    let sql = 'SELECT * FROM "chain".block_info order by block_num desc LIMIT ' + num
    if(startId > 0) {
      sql = 'SELECT * FROM "chain".block_info where block_num<' + startId +
         ' order by block_num desc LIMIT ' + num
    }
    let block = await pgsqlPool.connect().then(client => {
        return client
          .query(sql)
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
    console.log('block', block)
    ctx.body = block
}


module.exports = {
    getBlock: getBlock,
    getBlockList: getBlockList,
    getBlockInfo: getBlockInfo,
}