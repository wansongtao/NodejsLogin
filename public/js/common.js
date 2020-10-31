/**
 * @description 公共方法
 * @date 2020-10-30
 * @author wansongtao
 */

const commonObj = {};

/**
 * @description 延时跳转页面
 * @param {object} obj 格式：{pageUrl, time}   pageUrl 页面地址
 * time 延迟的时间，推荐这个时间和提示框消失的时间一样
 */
commonObj.redirectPage = ({
    pageUrl,
    time
}) => {
    if (typeof pageUrl !== 'string' || typeof time !== 'number') {
        throw {message: 'serverMessage.js => redirectPage(): arguments type error.'};
    }

    setTimeout(() => {
        location.assign(pageUrl);
    }, time);
};

/**
 * @description 弹出询问框
 * @param {*} msg 询问文本
 * @param {*} callback 点击确定后，执行的函数
 * @param {*} dataObj 传给函数的参数对象
 */
commonObj.confirmMsg = (msg, callback, dataObj) => {
    if (typeof msg !== 'string' || !(callback instanceof Function) ||
        !(dataObj instanceof Object)) {
        throw {message: 'serverMessage.js => confirmMsg(): arguments type error.'};
    }

    layer.confirm(msg, {
        btn: ['确定', '取消'] //按钮
    }, function () {
        callback(dataObj);
    });
};

/**
 * @description 处理大于等于300状态码
 * @param {object} data 服务端返回的数据
 */
commonObj.ProcessingGt300 = (data) => {
    if (data.code === 301) {
        //未注册，询问是否要跳转到注册页面
        commonObj.confirmMsg('该账户未注册，是否要去注册？',
            commonObj.redirectPage, {
                pageUrl: './views/register.html',
                time: 200
            });
    } else if (data.code === 302) {
        //密码错误
        layer.msg(data.msg, {time: 800, icon: 5});

        //选中错误文本
        $('#userPwd').select();
    } else if (data.code === 303) {
        //登录状态失效
        layer.msg(data.msg, {time: 800, icon: 5});

        commonObj.redirectPage('../login.html', 800);
    }
    else {
        //客户端错误
        layer.msg(data.msg, {time: 800, icon: 5});
    }
};

/**
 * @description 处理大于等于200状态码
 * @param {object} data 服务端返回的数据
 */
commonObj.ProcessingGt200 = (data) => {
    if (data.code === 200) {
        //操作成功
        layer.msg(data.msg, {time: 800, icon: 6});
    }else if (data.code === 201) {
        //登录成功
        layer.msg(data.msg, {time: 800, icon: 6});

        //将token保存到本地中
        localStorage.token = data.token;

        commonObj.setCookies(data.token);

        commonObj.redirectPage({
            pageUrl: '../../dynamicPage/index.html',
            time: 200
        });
    } else{
        //操作失败 code 203
        layer.msg(data.msg, {time: 800, icon: 5});
    }
};

/**
 * @description 根据服务端返回的数据，显示消息框/跳转页面
 * @param {object} data 服务端返回的数据
 */
commonObj.showMsg = (data) => {
    if(data.code < 300) {
        commonObj.ProcessingGt200(data);
    }
    else if(data.code < 400) {
        commonObj.ProcessingGt300(data);
    }
    else {
        //服务端错误
        layer.msg(`${data.msg}(${data.code})`, {time: 800, icon: 5});
    }
};

/**
 * @description 设置cookies
 * @param {string} value 要保存在cookies中的值(必选)
 * @param {number} expiress 过期时间，默认一小时
 */
commonObj.setCookies = (value, expiress = 1) => {
    //Name=wansongtao;expiress=UTCTIME
    if(typeof value !== 'string' || typeof expiress !== 'number') {
        throw {message: 'cookie设置失败'};
    }

    let nowDate = new Date();
    nowDate.setHours(nowDate.getHours() + expiress);
    nowDate = nowDate.toUTCString();

    document.cookie = `authorization=${escape(value)};expiress=${expiress}`;

    if(!document.cookie) {
        throw {message: '本网站需要设置cookie的权限。'};
    }
}

/**
 * @description 验证数据格式
 * @param {string} val 值
 * @param {object} regExp 正则表达式 
 * @returns true 通过验证
 */
// commonObj.verifyValue = (val, regExp) => {
//     if(typeof val !== 'string' || !(regExp instanceof Object)) {
//         return false;
//     }

//     if (!regExp.test(val)) {
//         return false;
//     }

//     return true;
// };