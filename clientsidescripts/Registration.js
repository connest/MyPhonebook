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