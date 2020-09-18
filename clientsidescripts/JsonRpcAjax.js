const jsonrpc = require('jsonrpc-lite')



function ajax(method, url, data, contentType) {
    contentType = contentType || "application/json";

    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.onload = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(null);
            }
        };
        xhr.onerror = function () {
            reject(null);
        };

        xhr.setRequestHeader("Content-type", contentType);
        xhr.send(data);
    });
}

let id = 1;
function rpc_send(url, method, params)
{
    const rpc_request = jsonrpc.request(id, method, params)
    id++;
    return ajax("POST", url, rpc_request.serialize());

}

module.exports.rpc_send = rpc_send;


