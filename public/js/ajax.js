/**
 * @description ajax请求封装
 * @date 2020-10-28
 * @author wansongtao
 */

 /**
  * @description ajax请求方法
  * @param {string} type 默认post
  * @param {string} url 只需要传入域名后面的接口部分
  * @param {object} data 默认{}
  * @param {function} successMethod 成功回调函数
  */
function ajax(type = 'post', url, data = {}, successMethod) {
    if(typeof type !== 'string' || typeof url !== 'string' 
    || !(data instanceof Object) || !(successMethod instanceof Function)) {
        console.error('ajax(): arguments type error.');
    }

    $.ajax({
        type: type,
        url: url,
        data: data,
        dataType: "json",
        success: successMethod,
        error: function(xhr) {
            console.error(`ajax() => $.ajax(): ${xhr.status}  ${xhr.statusText}`);
        }
    });
}