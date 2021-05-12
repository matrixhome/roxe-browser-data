const rpc = require('../tools/rpc')


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

module.exports = {
    getBlock: getBlock,
    getBlockInfo: getBlockInfo,
}