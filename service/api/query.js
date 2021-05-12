const rpc = require('../tools/rpc')
const pool = require('../tools/mysql').MysqlPool

/**
 * @api {get} /bigQuery
 * @apiGroup query
 * @apiVersion 1.0.0
 * @apiDescription 根据account block_num has 查询
 * @apiParam {String} id: account/block_num/hash
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "detail": {
 *              type: 1,        1: block 2: account 3: transaction
 *              result: obj
 *          }
 *     }
 */
async function bigQuery(ctx) {
    let id = ctx.request.query.id
    let details = []

    if (id.length === 64) {
        // transaction
        let detail = {
            type: 3,
            result: id
        }
        detail.result = await pool.then(function(conn) {
          return conn.query('select hash_ from transactions where hash_ = ?', [id]);
        })
        details.push(detail)
    } else {
        if (!isNaN(id)) {
            // block_num
            let block = await rpc.getBlockByID(id)
            if (block) {
                let detail = {
                    type: 1,
                    result: id
                }
                details.push(detail)
            } 
          }  
          
        if(1 < id.length <= 12) {
            // account
            let account = await rpc.getAccountDetail(id)
            if (account) {
                let detail = {
                    type: 2,
                    result: id
                }
                details.push(detail)
            }
          }
    }
    
    ctx.body = details
}

module.exports = {
    bigQuery: bigQuery,
}
