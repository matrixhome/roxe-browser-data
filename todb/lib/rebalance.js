const pool = require('../tools/mysql').MysqlPool
const exec = require("child_process").exec;


// 库中的块编号小于rpc的块，则开始同步
async function rebalance() {

  let assets = await pool.then(function(conn) {
    return conn.query('select contract_, username, quantity, symbol from assets');
  })

  if(assets) {
      console.log('assets.length', assets.length)
    for(var i=0; i<assets.length; i++) {
      let asset = assets[i]
      //traces
      if(asset) {
        let result = await getCurrencyBalancer(asset.contract_, asset.username, asset.symbol)
        console.log('asset', asset)
        console.log('result', result)
        if(result[0]) {
          let balance = result.split(' ')
          console.log('balance[0]', balance[0])
          pool.then(function(conn) {
            return conn.query('update assets set quantity = ? where username = ? and contract_ = ? and symbol = ? ', [balance[0], asset.username, asset.contract_, asset.symbol]);
          })
        }
      }
    }
  } 
//   await wait(27000)
//   rebalance()
}


async function getCurrencyBalancer(contact, account, symbol) {

  return new Promise(function(resolve, reject) {
    // 
    var cmd = 'cd /data/roxe_bak && ./clroxe get currency balance ' + contact + ' ' + account + ' ' + symbol
    // var cmd = 'cd /data/RoxeChain_bak && ./clroxe get currency balance ' + contact + ' ' + account + ' ' + symbol
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

// 函数实现，参数单位 毫秒 ；
function wait(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
};

module.exports = {
    rebalance: rebalance
}