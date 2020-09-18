const jsonrpc = require('jsonrpc-lite');

let _id = 1;
function sendJSONRPC(url, methodname, parameters, cb) {
  const request = new XMLHttpRequest();
  const requestObj = jsonrpc.request(_id, methodname, parameters)
  _id++;
  request.open("POST", url, true);
  request.setRequestHeader("Content-type", 'application/json');

  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      cb(request.responseText);
    }
  };
  request.send(requestObj.serialize());
}



let _signin = document.getElementById("_signin");
let _signup = document.getElementById("_signup");
let _login = document.getElementById("_login");
let _password = document.getElementById("_password");

_signin.onclick = function (e) {
  /*sendJSONRPC('api/books', "person.get",{
    login: _login.innerText,
    password: _password.innerText
  }, function (response) {
    alert(response);
  });*/
  sendJSONRPC('api/books', "person.get",{
    login: _login.value,
    password: _password.value
  }, function (response) {
    alert(response);
  });
};

_signup.onclick = function (e) {//TODO move to registration
};
