const jsonrpc = require('jsonrpc-lite')
const { rpc_send } = require('./JsonRpcAjax');

const _login = document.getElementById("_login")
const _password = document.getElementById("_password")
const _error = document.getElementById("_error")
const _signin = document.getElementById("_signin")
const _signup = document.getElementById("_signup")



_signin.onclick = function()
{
    rpc_send('/api/v1.0', "person.signin", {
        login: _login.value,
        password: _password.value
    }).then(function (response) {
        if(!response) {
            console.warn("response is not recognized");
            return;
        }

        try {
            const parsedResponse = jsonrpc.parse(response + '');
            const result = parsedResponse.payload.result

            if(result.isLogined) {
                window.location.href = '/Phonebook.html';
            } else {
                _error.innerText = 'Cannot sign in. Please check your login and password'
            }
        } catch (e) {
            console.warn(e);
        }
    });
}

_signup.onclick = function ()
{
    window.location.href = "/Registration.html"
}
