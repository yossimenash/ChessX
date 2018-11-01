exports.consts = function () {
    var consts = {
      defaultClientDirectory: 'public',
      version: '1.0',
      errorsFileName: 'ServerErrors.log',
      limitSizeForPost: 50,
      dbUrl: 'mongodb://localhost:27017',
      SERVER_PORT: 8081
    }
  
    var res = {};
    var res = Object.assign(res, consts);
  
    return res;
  }();
  