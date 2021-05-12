const request = require('request')
const { rpcurl } = require('../config')


async function getAccountDetail (accountname) {
    
    return new Promise(function(resolve) { 
      const account = {
          account_name: accountname
      }
      request.post({
        //   headers: {'content-type' : 'application/x-www-form-urlencoded'},
          url: rpcurl + '/get_account', 
          body: JSON.stringify(account)
        }, function (err, response, body) {
        if (err) {
          return console.error('error:', err); // Print the error if one occurred
        } 
        if (response && response.statusCode === 200) {
          const obj = JSON.parse(body)
          resolve(obj)
        } else {
          resolve(null)
        }
      })
    }).then(function(val) {
      return val
    }).catch(function(err) {
        console.err(err)
    })
  }


  async function getAccountTokenBalance (accountname) {
    
    return new Promise(function(resolve) { 
      const account = {
          account_name: accountname
      }
      request.post({
          url: rpcurl + '/get_account', 
          body: JSON.stringify(account)
        }, function (err, response, body) {
        if (err) {
          return console.error('error:', err); // Print the error if one occurred
        } 
        if (response && response.statusCode === 200) {
          const obj = JSON.parse(body)
          console.log(obj)
          resolve(obj)
        } else {
          resolve(null)
        }
      })
    }).then(function(val) {
      return val
    }).catch(function(err) {
        console.err(err)
    })
  }
  
  async function getTableLow (scope, code, table) {
    console.log(code, table, scope)
    return new Promise(function(resolve) { 
      const data = {
        scope: scope,
        code: code,
        table: table,
        json: 'true'
      }
      request.post({
          headers: {'content-type' : 'application/json'},
          url: rpcurl + '/get_table_rows', 
          body: JSON.stringify(data)
        }, function (err, response, body) {
        if (err) {
          return console.error('error:', err); // Print the error if one occurred
        } 
        if (response && response.statusCode === 200) {
          const obj = JSON.parse(body)
          resolve(obj)
        }
      })
    }).then(function(val) {
      return val
    }).catch(function(err) {
        console.err(err)
    })
  }

  async function getBlockByID (id) {
    
    return new Promise(function(resolve) { 
      const blockid = {
        block_num_or_id: id
      }
      request.post({
          url: rpcurl + '/get_block', 
          body: JSON.stringify(blockid)
        }, function (err, response, body) {
        if (err) {
          return console.error('error:', err); // Print the error if one occurred
        } 
        if (response && response.statusCode === 200) {
          const obj = JSON.parse(body)
          resolve(obj)
        }
      })
    }).then(function(val) {
      return val
    }).catch(function(err) {
        console.err(err)
    })
  }

  async function getBlockInfo (scope, code, table) {
    return new Promise(function(resolve) { 
      request.post({
          headers: {'content-type' : 'application/json'},
          url: rpcurl + '/get_info', 
        }, function (err, response, body) {
        if (err) {
          return console.error('error:', err); // Print the error if one occurred
        } 
        if (response && response.statusCode === 200) {
          const obj = JSON.parse(body)
          resolve(obj)
        } else {
          console.log(response)
          resolve(null)
        }
      })
    }).then(function(val) {
      return val
    }).catch(function(err) {
        console.err(err)
    })
  }

// https://www.coingecko.com/en/coins/roxe

  module.exports = {
    getAccountDetail: getAccountDetail,
    getAccountTokenBalance: getAccountTokenBalance,
    getBlockByID: getBlockByID,
    getTableLow: getTableLow,
    getBlockInfo: getBlockInfo,
  }