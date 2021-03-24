const rpc = require('../tools/rpc')


/**
 * @api {get} /getAccountDetail
 * @apiGroup account
 * @apiVersion 1.0.0
 * @apiDescription 获取账号详细信息
 *
 * @apiParam {String} account
 * 
 */
async function getAccountDetail(ctx) {
    let accountname = ctx.request.query.account
    let detail = await rpc.getAccountDetail(accountname)
    ctx.body = detail
}

/**
 * @api {get} /getNodeList
 * @apiGroup account
 * @apiVersion 1.0.0
 * @apiDescription 获取超级节点
 */
async function getNodeList(ctx) {
    console.log('getNodeList')
    let nodes = await rpc.getTableLow('roxe', 'roxe', 'producers')
    for(var i=0; i<nodes.rows.length; i++) {
        console.log('i', i)
    }
    ctx.body = nodes
}



module.exports = {
    getAccountDetail: getAccountDetail,
    getNodeList: getNodeList,
}
