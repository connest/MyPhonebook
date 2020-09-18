var JsonRPC = require('simple-jsonrpc-js');
function sayHello() {
    alert("Hello");
}
var _id = 1;
function sendJSONRPC(url, methodname, parameters, cb)
{
    const request = new XMLHttpRequest();



    const forSend = JSON.stringify({
        jsonrpc: "2.0",
        method: methodname,
        params: parameters,
        id: _id
    })

    _id++;

    request.open("POST", url, true);

    request.setRequestHeader("Content-type", 'application/json');

    request.onreadystatechange = () => {

        if(request.readyState === 4 && request.status === 200) {
            cb(request.responseText);
        }
    };

    request.send(forSend);
}

let _signin = document.getElementById("_signin");
let _signup = document.getElementById("_signup");
_signin.onclick = function (e) {
    sendJSONRPC('api/books', "person.get", {please: 'give me'}, function(response) {
        alert(response)
    })
};
_signup.onclick = function (e) {
    //TODO move to registration
};