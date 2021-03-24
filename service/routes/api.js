const router = require('koa-router')()
const account = require('../api/account')
const block = require('../api/block')
const transaction = require('../api/transaction')

router.get('/getAccountDetail', account.getAccountDetail)
router.get('/getNodeList', account.getNodeList)
router.get('/getBlock', block.getBlock)
router.get('/getBlockInfo', block.getBlockInfo)
router.get('/getBlockList', block.getBlockList)
router.get('/getTransaction', transaction.getTransaction)
router.get('/getTransByBlock', transaction.getTransactionsByBlock)
router.get('/getTransactionList', transaction.getTransactionList)


module.exports = router
