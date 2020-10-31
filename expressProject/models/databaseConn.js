/**
 * @description 数据库模块（数据库相关操作）
 * @date 2020-10-28
 * @author wansongtao
 * @database mysql数据库 库名：ExpressKing 表：heros、users
 */

//引入mysql数据库模块
const mysql = require('mysql');

/**
 * @description 一个数据库对象，包含操作数据库的各种方法
 */
const databaseObj = {};

/**
 * @description 创建连接池
 */
databaseObj.pool = mysql.createPool({
    connectionLimit: 15,
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'ExpressKing'
});

/**
 * @description 查询数据
 * @param {string} queryStr 查询字符串(必选)
 * @param {Array} data 要放入查询字符串中的值（可选）
 * @returns 返回一个期约对象
 */
databaseObj.query = (queryStr, data = []) => {
    return new Promise((resolve, reject) => {
        //获取连接
        databaseObj.pool.getConnection(function (err, connection) {
            //获取连接失败
            if (err) {
                console.error('databaseConn => databaseObj.query(getConnection): ' + err.stack);

                //将期约转换为解决状态，并返回一个false值
                resolve(false);
            }

            //查询数据
            connection.query(queryStr, data, (err, result, field) => {
                //查询完毕释放连接
                connection.release();

                //查询出错
                if (err) {
                    console.error('databaseConn => databaseObj.query(connection.query): ' + err.stack);

                    result = false;
                }

                //将期约转换为解决状态，并返回查询结果
                resolve(result);
            });
        });
    });
};

/**
 * @description 导出数据库方法模块
 */
module.exports = databaseObj;


/*
//连接数据库
databaseObj.conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'ExpressKing'
});

databaseObj.open = () => {
    databaseObj.conn.connect((err) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
        }
    });
};

databaseObj.close = () => {
    databaseObj.conn.end((err) => {
        if (err) {
            console.error('error unconnecting: ' + err.stack);
        }
    });
};

// @description 查询数据
// @param {string} queryStr 查询字符串
// @param {Array} data 要放入查询字符串中的值
// @returns 返回一个期约对象 
databaseObj.query = (queryStr, data = []) => {
    return new Promise((resolve, reject) => {
        // databaseObj.open();

        databaseObj.conn.query(queryStr, data, (err, result, field) => {
            if (err) {
                console.error('error query: ' + err.stack);

                // 当出错的时候，将期约转换为解决状态，并返回一个false值
                resolve(false);
            }

            console.log(result);
            // databaseObj.close();
            //将期约转换为解决状态，并返回查询结果
            resolve(result);
        });
 
    });
}; */