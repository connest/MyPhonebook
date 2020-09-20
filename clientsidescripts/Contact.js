const { signinIfNotLogined, logout } = require('./IsLogined')
const {rpc_send} = require('./JsonRpcAjax')
const jsonrpc = require('jsonrpc-lite')

const _name = document.getElementById('_name')
const _surname = document.getElementById('_surname')
const _phones = document.getElementById('_phones')
const _new_phone = document.getElementById('_new_phone')
const _add_phone = document.getElementById('_add_phone')
const _delete_contact = document.getElementById('_delete_contact')
const _logout = document.getElementById('_logout')


function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function getCurrentId() {
    return getUrlVars()['id']
}

function delete_phone(phoneId) {
    rpc_send('/api/v1.0', 'phone.delete', {
        phoneId: phoneId
    }).then((response) => {
        if (!response) {
            console.warn("response is not recognized");
            return;
        }

        try {
            const parsedResponse = jsonrpc.parse(response + '');
            const result = parsedResponse.payload.result


            if (result.isDeleted)
                getContact();

        } catch (e) {
            console.warn(e);
        }
    });
}

function showContactPhone(phone) {
    const phone_container = document.createElement('li')
    const phone_number = document.createElement('div')
    const delete_button = document.createElement('button')

    phone_number.innerText = phone.phone_number;

    delete_button.innerText = 'X'
    delete_button.onclick = delete_phone.bind(this, phone.id_phone)

    phone_container.insertAdjacentElement('beforeend', phone_number)
    phone_container.insertAdjacentElement('beforeend', delete_button)

    _phones.insertAdjacentElement('beforeend', phone_container)
}

function showContact(name, surname, phones) {
    _name.innerText = name;
    _surname.innerText = surname;

    _phones.innerHTML = ''
    if (phones) {
        for (let phone of phones) {
            showContactPhone(phone);
        }
    }
}

function getContact() {
    rpc_send('/api/v1.0', 'contact.getWithPhones', {
        id: getCurrentId()
    }).then((response) => {
        if (!response) {
            console.warn("response is not recognized");
            return;
        }

        try {
            const parsedResponse = jsonrpc.parse(response + '');
            const result = parsedResponse.payload.result

            showContact(result.name, result.surname, result.phones)

        } catch (e) {
            console.warn(e);
        }
    });
}


function addPhone() {
    const phone_number = _new_phone.value;
    rpc_send('/api/v1.0', 'phone.add', {
        contactId: getCurrentId(),
        phone: phone_number
    }).then((response) => {
        if (!response) {
            console.warn("response is not recognized");
            return;
        }

        try {
            const parsedResponse = jsonrpc.parse(response + '');
            const result = parsedResponse.payload.result

            if(result.isAdded)
                getContact();

        } catch (e) {
            console.warn(e);
        }
    });
}

function deleteThisContact() {
    rpc_send('/api/v1.0', 'contact.delete', {
        contactId: getCurrentId(),
    }).then((response) => {
        if(!response) {
            console.warn("response is not recognized");
            return;
        }

        try {
            const parsedResponse = jsonrpc.parse(response + '');
            const result = parsedResponse.payload.result

            if(result.isDeleted)
            {
                window.history.back();
            }

        } catch (e) {
            console.warn(e);
        }
    });
}

_delete_contact.onclick = deleteThisContact;
_add_phone.onclick = addPhone;
_logout.onclick = logout;
window.onload = function () {
    signinIfNotLogined();
    getContact();
}