const router = require('koa-router')()
const account = require('../api/account')
const block = require('../api/block')
const transaction = require('../api/transaction')
const query = require('../api/query')

router.get('/getAccountDetail', account.getAccountDetail)
router.get('/getNodeList', account.getNodeList)
router.get('/getAccountCount', account.getAccountCount)
router.get('/getTokens', account.getTokens)
router.get('/getToken', account.getToken)
router.get('/setTokenPrice', account.setTokenPrice)
router.get('/getAccounts', account.getAccounts)


router.get('/getBlock', block.getBlock)
router.get('/getBlockInfo', block.getBlockInfo)

router.get('/getTransaction', transaction.getTransaction)
router.get('/getTransByBlock', transaction.getTransactionsByBlock)
router.get('/getTransactionCount', transaction.getTransactionCount)
router.get('/getTransactionList', transaction.getTransactionList)
router.get('/getTransByAccount', transaction.getTransByAccount)
router.get('/getTransByContract', transaction.getTransByContract)


router.get('/bigQuery', query.bigQuery)


module.exports = router
