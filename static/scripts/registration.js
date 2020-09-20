(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// function isLogined() {
//     if(!getCookie('userId'))
//         window.location.href = '/Login.html'
// }
function isLogined() {
    return Boolean(getCookie('userId'))
}
function moveToSignin() {
    window.location.href = '/Login.html'
}
function signinIfNotLogined() {
    if(!isLogined())
        window.location.href = '/Login.html'
}
function logout() {
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    window.location.href = '/Login.html'
}

module.exports.isLogined = isLogined;
module.exports.moveToSignin = moveToSignin;
module.exports.logout = logout;
module.exports.signinIfNotLogined = signinIfNotLogined;
},{}],2:[function(require,module,exports){
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



},{"jsonrpc-lite":4}],3:[function(require,module,exports){
const { isLogined } = require('./IsLogined')
const { rpc_send } = require('./JsonRpcAjax')
const jsonrpc = require('jsonrpc-lite')

const _login = document.getElementById('_login')
const _password = document.getElementById('_password')
const _confirm_password = document.getElementById('_confirm_password')
const _error = document.getElementById('_error')
const _cancel = document.getElementById('_cancel')
const _signup = document.getElementById('_signup')

_cancel.onclick = function () {
    window.history.back();
}

_signup.onclick = function () {
    if(_password.value !== _confirm_password.value) {
        _error.innerText = 'Passwords not equals';
        return ;
    }

    rpc_send('/api/v1.0', 'person.singup', {
        login: _login.value,
        password: _password.value
    }).then((response) => {
        if(!response) {
            console.warn("response is not recognized");
            return;
        }

        try {
            const parsedResponse = jsonrpc.parse(response + '');
            const result = parsedResponse.payload.result

            if(result.isSigned) {
                window.location.href = '/Phonebook.html'
            } else {
                _error.innerText = 'Cannot sign in. Login is already exists'
            }
        } catch (e) {
            console.warn(e);
        }
    })
}

window.onload = function () {
    if(isLogined())
        window.location.href = '/Phonebook.html'
}
},{"./IsLogined":1,"./JsonRpcAjax":2,"jsonrpc-lite":4}],4:[function(require,module,exports){
// **Github:** https://github.com/teambition/jsonrpc-lite
//
// http://www.jsonrpc.org/specification
// **License:** MIT
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonrpc = exports.parseObject = exports.parseJsonRpcString = exports.parseJsonRpcObject = exports.parse = exports.error = exports.success = exports.notification = exports.request = exports.JsonRpcError = exports.JsonRpcParsed = exports.ErrorObject = exports.SuccessObject = exports.NotificationObject = exports.RequestObject = exports.JsonRpc = void 0;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const isInteger = typeof Number.isSafeInteger === 'function'
    ? Number.isSafeInteger // ECMAScript 2015
    : function (num) {
        return typeof num === 'number' && isFinite(num) && num === Math.floor(num) && Math.abs(num) <= 9007199254740991;
    };
class JsonRpc {
    constructor() {
        this.jsonrpc = '2.0';
    }
    serialize() {
        return JSON.stringify(this);
    }
}
exports.JsonRpc = JsonRpc;
JsonRpc.VERSION = '2.0';
class RequestObject extends JsonRpc {
    constructor(id, method, params) {
        super();
        this.id = id;
        this.method = method;
        if (params !== undefined) {
            this.params = params;
        }
    }
}
exports.RequestObject = RequestObject;
class NotificationObject extends JsonRpc {
    constructor(method, params) {
        super();
        this.method = method;
        if (params !== undefined) {
            this.params = params;
        }
    }
}
exports.NotificationObject = NotificationObject;
class SuccessObject extends JsonRpc {
    constructor(id, result) {
        super();
        this.id = id;
        this.result = result;
    }
}
exports.SuccessObject = SuccessObject;
class ErrorObject extends JsonRpc {
    // tslint:disable-next-line:no-shadowed-variable
    constructor(id, error) {
        super();
        this.id = id;
        this.error = error;
        this.id = id;
        this.error = error;
    }
}
exports.ErrorObject = ErrorObject;
class JsonRpcParsed {
    constructor(payload, type) {
        this.payload = payload;
        this.type = type;
        this.payload = payload;
        this.type = type;
    }
}
exports.JsonRpcParsed = JsonRpcParsed;
/**
 * JsonRpcError Class
 *
 * @param  {String} message
 * @param  {Integer} code
 * @return {String} name: optional
 * @api public
 */
class JsonRpcError {
    constructor(message, code, data) {
        this.message = message;
        this.code = isInteger(code) ? code : 0;
        if (data != null) {
            this.data = data;
        }
    }
}
exports.JsonRpcError = JsonRpcError;
JsonRpcError.invalidRequest = function (data) {
    return new JsonRpcError('Invalid request', -32600, data);
};
JsonRpcError.methodNotFound = function (data) {
    return new JsonRpcError('Method not found', -32601, data);
};
JsonRpcError.invalidParams = function (data) {
    return new JsonRpcError('Invalid params', -32602, data);
};
JsonRpcError.internalError = function (data) {
    return new JsonRpcError('Internal error', -32603, data);
};
JsonRpcError.parseError = function (data) {
    return new JsonRpcError('Parse error', -32700, data);
};
/**
 * Creates a JSON-RPC 2.0 request object
 *
 * @param  {String|Integer} id
 * @param  {String} method
 * @param  {Object|Array} [params]: optional
 * @return {Object} JsonRpc object
 * @api public
 */
function request(id, method, params) {
    const object = new RequestObject(id, method, params);
    validateMessage(object, true);
    return object;
}
exports.request = request;
/**
 * Creates a JSON-RPC 2.0 notification object
 *
 * @param  {String} method
 * @param  {Object|Array} [params]: optional
 * @return {Object} JsonRpc object
 * @api public
 */
function notification(method, params) {
    const object = new NotificationObject(method, params);
    validateMessage(object, true);
    return object;
}
exports.notification = notification;
/**
 * Creates a JSON-RPC 2.0 success response object
 *
 * @param  {String|Integer} id
 * @param  {Mixed} result
 * @return {Object} JsonRpc object
 * @api public
 */
function success(id, result) {
    const object = new SuccessObject(id, result);
    validateMessage(object, true);
    return object;
}
exports.success = success;
/**
 * Creates a JSON-RPC 2.0 error response object
 *
 * @param  {String|Integer} id
 * @param  {Object} JsonRpcError error
 * @return {Object} JsonRpc object
 * @api public
 */
function error(id, err) {
    const object = new ErrorObject(id, err);
    validateMessage(object, true);
    return object;
}
exports.error = error;
function parse(message) {
    if (!isString(message)) {
        return new JsonRpcParsed(JsonRpcError.invalidRequest(message), "invalid" /* invalid */);
    }
    let jsonrpcObj;
    try {
        jsonrpcObj = JSON.parse(message);
    }
    catch (err) {
        return new JsonRpcParsed(JsonRpcError.parseError(message), "invalid" /* invalid */);
    }
    return parseJsonRpcObject(jsonrpcObj);
}
exports.parse = parse;
/**
 * Takes a JSON-RPC 2.0 payload (Object) or batch (Object[]) and tries to parse it.
 * If successful, determine what objects are inside (response, notification,
 * success, error, or invalid), and return their types and properly formatted objects.
 *
 * @param  {Object|Array} jsonrpcObj
 * @return {Object|Array} a single object or an array of `JsonRpcParsed` objects with `type` and `payload`:
 *
 *  {
 *    type: <Enum, 'request'|'notification'|'success'|'error'|'invalid'>
 *    payload: <JsonRpc|JsonRpcError>
 *  }
 *
 * @api public
 */
function parseJsonRpcObject(jsonrpcObj) {
    if (!Array.isArray(jsonrpcObj)) {
        return parseObject(jsonrpcObj);
    }
    if (jsonrpcObj.length === 0) {
        return new JsonRpcParsed(JsonRpcError.invalidRequest(jsonrpcObj), "invalid" /* invalid */);
    }
    const parsedObjectArray = [];
    for (let i = 0, len = jsonrpcObj.length; i < len; i++) {
        parsedObjectArray[i] = parseObject(jsonrpcObj[i]);
    }
    return parsedObjectArray;
}
exports.parseJsonRpcObject = parseJsonRpcObject;
/**
 * Alias for `parse` method.
 * Takes a JSON-RPC 2.0 payload (String) and tries to parse it into a JSON.
 * @api public
 */
exports.parseJsonRpcString = parse;
/**
 * Takes a JSON-RPC 2.0 payload (Object) and tries to parse it into a JSON.
 * If successful, determine what object is it (response, notification,
 * success, error, or invalid), and return it's type and properly formatted object.
 *
 * @param  {Object} obj
 * @return {Object} an `JsonRpcParsed` object with `type` and `payload`:
 *
 *  {
 *    type: <Enum, 'request'|'notification'|'success'|'error'|'invalid'>
 *    payload: <JsonRpc|JsonRpcError>
 *  }
 *
 * @api public
 */
function parseObject(obj) {
    let err = null;
    let payload = null;
    let payloadType = "invalid" /* invalid */;
    if (obj == null || obj.jsonrpc !== JsonRpc.VERSION) {
        err = JsonRpcError.invalidRequest(obj);
        payloadType = "invalid" /* invalid */;
    }
    else if (!hasOwnProperty.call(obj, 'id')) {
        const tmp = obj;
        payload = new NotificationObject(tmp.method, tmp.params);
        err = validateMessage(payload);
        payloadType = "notification" /* notification */;
    }
    else if (hasOwnProperty.call(obj, 'method')) {
        const tmp = obj;
        payload = new RequestObject(tmp.id, tmp.method, tmp.params);
        err = validateMessage(payload);
        payloadType = "request" /* request */;
    }
    else if (hasOwnProperty.call(obj, 'result')) {
        const tmp = obj;
        payload = new SuccessObject(tmp.id, tmp.result);
        err = validateMessage(payload);
        payloadType = "success" /* success */;
    }
    else if (hasOwnProperty.call(obj, 'error')) {
        const tmp = obj;
        payloadType = "error" /* error */;
        if (tmp.error == null) {
            err = JsonRpcError.internalError(tmp);
        }
        else {
            const errorObj = new JsonRpcError(tmp.error.message, tmp.error.code, tmp.error.data);
            if (errorObj.message !== tmp.error.message || errorObj.code !== tmp.error.code) {
                err = JsonRpcError.internalError(tmp);
            }
            else {
                payload = new ErrorObject(tmp.id, errorObj);
                err = validateMessage(payload);
            }
        }
    }
    if (err == null && payload != null) {
        return new JsonRpcParsed(payload, payloadType);
    }
    return new JsonRpcParsed(err != null ? err : JsonRpcError.invalidRequest(obj), "invalid" /* invalid */);
}
exports.parseObject = parseObject;
// if error, return error, else return null
function validateMessage(obj, throwIt) {
    let err = null;
    if (obj instanceof RequestObject) {
        err = checkId(obj.id);
        if (err == null) {
            err = checkMethod(obj.method);
        }
        if (err == null) {
            err = checkParams(obj.params);
        }
    }
    else if (obj instanceof NotificationObject) {
        err = checkMethod(obj.method);
        if (err == null) {
            err = checkParams(obj.params);
        }
    }
    else if (obj instanceof SuccessObject) {
        err = checkId(obj.id);
        if (err == null) {
            err = checkResult(obj.result);
        }
    }
    else if (obj instanceof ErrorObject) {
        err = checkId(obj.id, true);
        if (err == null) {
            err = checkError(obj.error);
        }
    }
    if (throwIt && err != null) {
        throw err;
    }
    return err;
}
function checkId(id, maybeNull) {
    if (maybeNull && id === null) {
        return null;
    }
    return isString(id) || isInteger(id)
        ? null
        : JsonRpcError.internalError('"id" must be provided, a string or an integer.');
}
function checkMethod(method) {
    return isString(method) ? null : JsonRpcError.invalidRequest(method);
}
function checkResult(result) {
    return result === undefined
        ? JsonRpcError.internalError('Result must exist for success Response objects')
        : null;
}
function checkParams(params) {
    if (params === undefined) {
        return null;
    }
    if (Array.isArray(params) || isObject(params)) {
        // ensure params can be stringify
        try {
            JSON.stringify(params);
            return null;
        }
        catch (err) {
            return JsonRpcError.parseError(params);
        }
    }
    return JsonRpcError.invalidParams(params);
}
function checkError(err) {
    if (!(err instanceof JsonRpcError)) {
        return JsonRpcError.internalError('Error must be an instance of JsonRpcError');
    }
    if (!isInteger(err.code)) {
        return JsonRpcError.internalError('Invalid error code. It must be an integer.');
    }
    if (!isString(err.message)) {
        return JsonRpcError.internalError('Message must exist or must be a string.');
    }
    return null;
}
function isString(obj) {
    return obj !== '' && typeof obj === 'string';
}
function isObject(obj) {
    return obj != null && typeof obj === 'object' && !Array.isArray(obj);
}
const jsonrpc = {
    JsonRpc,
    JsonRpcError,
    request,
    notification,
    success,
    error,
    parse,
    parseObject,
    parseJsonRpcObject,
    parseJsonRpcString: exports.parseJsonRpcString,
};
exports.jsonrpc = jsonrpc;
exports.default = jsonrpc;

},{}]},{},[3]);
