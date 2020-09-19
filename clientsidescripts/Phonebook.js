const { rpc_send } = require('./JsonRpcAjax')
const jsonrpc = require('jsonrpc-lite')

const _contacts = document.getElementById('_contacts')
const _add_contact = document.getElementById('_add_contact')

function refreshContacts() {
    rpc_send('/api/v1.0', 'contact.get', {
        limit: 0,
        offset: 0
    }).then((response) => {
        if(!response) {
            console.warn("response is not recognized");
            return;
        }

        try {
            const parsedResponse = jsonrpc.parse(response + '');
            const result = parsedResponse.payload.result

            _contacts.innerText = '';
            result.forEach(contact => add_contact(contact));

        } catch (e) {
            console.warn(e);
        }
    });
}

function delete_contact(idContact) {
    rpc_send('/api/v1.0', 'contact.delete', {
        contactId: idContact,
    }).then((response) => {
        if(!response) {
            console.warn("response is not recognized");
            return;
        }

        try {
            const parsedResponse = jsonrpc.parse(response + '');
            const result = parsedResponse.payload.result

            console.log(result)
            refreshContacts();

        } catch (e) {
            console.warn(e);
        }
    });
}


function add_contact(contact) {
    var cont = document.createElement('li');
    var name_div = document.createElement('div');
    var surname_div = document.createElement('div');
    var delete_button = document.createElement('button');

    name_div.innerText = contact.name;
    surname_div.innerText = contact.surname;
    delete_button.innerText = 'X';

    delete_button.onclick = delete_contact.bind(contact.id_contact);


    cont.insertAdjacentElement('beforeend', name_div);
    cont.insertAdjacentElement('beforeend', surname_div);
    cont.insertAdjacentElement('beforeend', delete_button);

    _contacts.insertAdjacentElement('beforeend', cont);
}


window.onload = refreshContacts;
_add_contact.onclick = function () {
    window.location.href = '/CreateContact.html'
}