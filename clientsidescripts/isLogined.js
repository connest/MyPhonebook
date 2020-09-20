
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