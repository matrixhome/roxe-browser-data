define({ "api": [  {    "type": "get",    "url": "/getAccountDetail",    "title": "",    "group": "account",    "version": "1.0.0",    "description": "<p>获取账号详细信息</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "account",            "description": ""          }        ]      }    },    "filename": "api/account.js",    "groupTitle": "account",    "name": "GetGetaccountdetail"  },  {    "type": "get",    "url": "/getNodeList",    "title": "",    "group": "account",    "version": "1.0.0",    "description": "<p>获取超级节点</p>",    "filename": "api/account.js",    "groupTitle": "account",    "name": "GetGetnodelist"  },  {    "type": "get",    "url": "/getBlock",    "title": "",    "group": "block",    "version": "1.0.0",    "description": "<p>根据区块id获取区块信息</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": ""          }        ]      }    },    "filename": "api/block.js",    "groupTitle": "block",    "name": "GetGetblock"  },  {    "type": "get",    "url": "/getBlockInfo",    "title": "",    "group": "block",    "version": "1.0.0",    "description": "<p>根据最新区块信息</p>",    "filename": "api/block.js",    "groupTitle": "block",    "name": "GetGetblockinfo"  },  {    "type": "get",    "url": "/getBlockList",    "title": "",    "group": "block",    "version": "1.0.0",    "description": "<p>根据区块num坐标获取区块分页数据</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "startId",            "description": "<p>例：100，会取回小于100的区块 0 或者不传取最新区块</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "num",            "description": "<p>num 每页显示的笔数</p>"          }        ]      }    },    "filename": "api/block.js",    "groupTitle": "block",    "name": "GetGetblocklist"  },  {    "type": "get",    "url": "/getTransaction",    "title": "",    "group": "transaction",    "version": "1.0.0",    "description": "<p>根据hash查询transaction</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "string",            "optional": false,            "field": "hash",            "description": ""          }        ]      }    },    "filename": "api/transaction.js",    "groupTitle": "transaction",    "name": "GetGettransaction"  },  {    "type": "get",    "url": "/getTransactionList",    "title": "",    "group": "transaction",    "version": "1.0.0",    "description": "<p>查询最新的transaction</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "string",            "optional": false,            "field": "num",            "description": "<p>显示笔数</p>"          }        ]      }    },    "filename": "api/transaction.js",    "groupTitle": "transaction",    "name": "GetGettransactionlist"  },  {    "type": "get",    "url": "/getTransByBlock",    "title": "",    "group": "transaction",    "version": "1.0.0",    "description": "<p>查询最新的transaction</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "string",            "optional": false,            "field": "num",            "description": "<p>显示笔数</p>"          }        ]      }    },    "filename": "api/transaction.js",    "groupTitle": "transaction",    "name": "GetGettransbyblock"  }] });
