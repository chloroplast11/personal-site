import mysql from 'mysql';

// 创建一个数据库连接池
const pool = mysql.createPool({
  connectionLimit: 50,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'personal_site'
});

// 一种是只传入SQL语句和回调函数
// 一种是传入SQL语句、参数数据、回调函数
const query = function (sql, P, C) {
  let params = [];
  let callback;
  
  if (arguments.length == 2 && typeof arguments[1] == 'function') {
    // 如果用户传入了两个参数，就是SQL和callback
    callback = P;
  } else if (arguments.length == 3 && Array.isArray(arguments[1]) && typeof arguments[2] == 'function') {
    // 如果用户传入了三个参数，那么就是SQL和参数数组、回调函数
    params = P;
    callback = C;
  } else {
    throw new Error('对不起，参数个数不匹配或者参数类型错误');
  }

  // 从池子里面拿一个可以使用的连接
  pool.getConnection((err, connection) => {
    // Use the connection
    if(err){
      throw new Error(err);
    }

    connection.query(sql, params, function () {
      // 使用完毕之后，将该连接释放回连接池
      connection.release();
      callback.apply(null, arguments);
    });
  });
};

module.exports.query = query;