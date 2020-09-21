const { isLogined } = require('./IsLogined');

window.onload = function () {
    if(isLogined())
        window.location.href = '/Phonebook.html';
    else
        window.location.href = '/Login.html'
}