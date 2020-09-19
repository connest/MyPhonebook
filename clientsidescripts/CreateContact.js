const jsonrpc = require('jsonrpc-lite');
const { rpc_send } = require('./JsonRpcAjax');

const _name = document.getElementById('_name')
const _surname = document.getElementById('_surname')
const _phones = document.getElementById('_phones')
const _add_phone = document.getElementById('_add_phone')
const _cancel = document.getElementById('_cancel')
const _add_contact = document.getElementById('_add_contact')

function createPhoneNumber()
{
    const phone = document.createElement('div');
    const phone_input = document.createElement('input');
    const delete_phone = document.createElement('button');

    delete_phone.onclick = function ()
    {
        phone_input.remove()
        delete_phone.remove()
    }
    delete_phone.innerText = 'X'

    phone.insertAdjacentElement('beforeend', phone_input)
    phone.insertAdjacentElement('beforeend', delete_phone)

    _phones.insertAdjacentElement('beforeend', phone);
}


function getPhonesArray() {
    const phones = _phones.getElementsByTagName('input');

    let phoneArray = []
    for(let phone of phones)
    {
        phoneArray.push(phone.value);
    }

    return phoneArray;
}


_add_contact.onclick = function () {
    const resuestParams = {
        name: _name.value,
        surname: _surname.value,
        phones: getPhonesArray()
    }

    console.log(resuestParams)
    rpc_send('/api/v1.0', 'contact.create', resuestParams)
        .then((response) => {
        if(!response) {
            console.warn("response is not recognized");
            return;
        }

        try {
            const parsedResponse = jsonrpc.parse(response + '');
            const result = parsedResponse.payload.result

            if(result) {
                window.history.back();
            }

        } catch (e) {
            console.warn(e);
        }
    });
}



_add_phone.onclick = createPhoneNumber;
_cancel.onclick = function () {
    window.history.back();
}

window.onload = createPhoneNumber;