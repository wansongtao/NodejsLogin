/**
 * @description ajax请求封装
 * @date 2020-10-28
 * @author wansongtao
 */

/**
 * @description ajax请求方法
 * @param {string} url 只需要传入域名后面的接口部分(必选)
 * @param {object} data 发送给服务的的数据，可以传入{}（必选）
 * @param {function} successMethod 成功回调函数（必选）
 * @param {string} type 请求类型，默认post
 * @param {object} header 请求头，默认{}
 */
function ajax(url, data, successMethod, type = 'post', header = {}) {

    if (typeof url !== 'string' || !(data instanceof Object) || !(successMethod instanceof Function) ||
        typeof type !== 'string' || !(header instanceof Object)) {

        //重置表单状态
        loginJs.isSubmit = false;

        layer.msg('登录失败，请稍后再试。', {
            icon: 5
        });
        throw {
            message: 'ajax(): arguments type error.'
        };
    }

    $.ajax({
        type: type,
        url: url,
        header: header,
        data: data,
        dataType: "json",
        success: successMethod,
        error: function (xhr) {
            //重置表单状态
            loginJs.isSubmit = false;

            console.error(`ajax() => $.ajax(): ${xhr.status}=>${xhr.statusText}`);
            layer.msg('登录失败，请稍后再试。', {
                icon: 5
            });
        }
    });
}