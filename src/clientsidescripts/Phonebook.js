const {signinIfNotLogined, logout} = require('./IsLogined')
const {rpc_send} = require('./JsonRpcAjax')
const jsonrpc = require('jsonrpc-lite')

const _contacts = document.getElementById('_contacts')
const _add_contact = document.getElementById('_add_contact')
const _logout = document.getElementById('_logout')
const _export = document.getElementById('_export')

function refreshContacts() {
    rpc_send('/api/v1.0', 'contact.get', {
        limit: 0,
        offset: 0
    }).then((response) => {
        if (!response) {
            console.warn("response is not recognized");
            return;
        }

        try {
            const parsedResponse = jsonrpc.parse(response + '');
            const result = parsedResponse.payload.result

            console.log(result)
            _contacts.innerText = '';
            result.forEach(contact => add_contact(contact));

        } catch (e) {
            console.warn(e);
        }
    });
}

function moveToConctact(idContact) {
    window.location.href = '/Contact.html?id=' + idContact
}

function delete_contact(idContact) {
    rpc_send('/api/v1.0', 'contact.delete', {
        contactId: idContact,
    }).then((response) => {
        if (!response) {
            console.warn("response is not recognized");
            return;
        }

        try {
            const parsedResponse = jsonrpc.parse(response + '');
            const result = parsedResponse.payload.result

            if (result.isDeleted)
                refreshContacts();

        } catch (e) {
            console.warn(e);
        }
    });
}

function add_contact(contact) {
    const contact_list_element = document.createElement('li');
    const contact_name = document.createElement('span');
    const contact_icon = document.createElement('i');

    const contact_delete_button = document.createElement('a');
    const contact_delete_button_icon = document.createElement('i');

    contact_list_element.className = 'mdl-list__item'
    contact_name.className = 'mdl-list__item-primary-content'
    contact_icon.className = 'material-icons mdl-list__item-icon'
    contact_delete_button.className = 'mdl-list__item-secondary-action'
    contact_delete_button_icon.className = 'material-icons'

    contact_icon.innerText = 'person'
    contact_delete_button_icon.innerText = 'delete'
    contact_name.innerHTML += contact.name + ' ' + contact.surname;

    contact_delete_button.onclick = function (event) {
        event.stopPropagation()
        delete_contact(Number(contact.id_contact));
    }


    contact_list_element.onclick = moveToConctact.bind(this, Number(contact.id_contact));


    contact_delete_button.insertAdjacentElement('beforeend', contact_delete_button_icon)
    contact_list_element.insertAdjacentElement('beforeend', contact_icon)
    contact_list_element.insertAdjacentElement('beforeend', contact_name)
    contact_list_element.insertAdjacentElement('beforeend', contact_delete_button)
    _contacts.insertAdjacentElement('beforeend', contact_list_element);

}

_export.onclick = function () {
    window.open('/api/v1.0/exportContacts', '_blank');
    /*rpc_send('/api/v1.0', 'contact.export', {})
        .then((response) => {
        if (!response) {
            console.warn("response is not recognized");
            return;
        }

        try {
            const parsedResponse = jsonrpc.parse(response + '');
            const result = parsedResponse.payload.result

            console.log(result)

        } catch (e) {
            console.warn(e);
        }
    });*/
}


_add_contact.onclick = function () {
    window.location.href = '/CreateContact.html'
}
_logout.onclick = logout;

window.onload = function () {
    signinIfNotLogined();
    refreshContacts();
}