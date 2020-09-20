const { signinIfNotLogined, logout } = require('./IsLogined')
const jsonrpc = require('jsonrpc-lite');
const { rpc_send } = require('./JsonRpcAjax');


const _name = document.getElementById('_name')
const _surname = document.getElementById('_surname')
const _phones = document.getElementById('_phones')
const _add_phone = document.getElementById('_add_phone')
const _cancel = document.getElementById('_cancel')
const _add_contact = document.getElementById('_add_contact')
const _logout = document.getElementById('_logout')
const _error_message = document.getElementById('_error_message')



function createPhoneNumber()
{


    const row = document.createElement('li');
    row.className = 'mdl-list__item'

    const row_content = document.createElement('span');
    row_content.className = 'mdl-list__item-primary-content'

    const row_content_div = document.createElement('div');
    row_content_div.className = 'mdl-textfield mdl-js-textfield'

    const row_content_input = document.createElement('input');
    row_content_input.className = 'mdl-textfield__input'
    row_content_input.pattern = '[0-9\\-\\(\\)\\+\\s]{9,22}'

    const row_content_label = document.createElement('label');
    row_content_label.className = 'mdl-textfield__label'
    row_content_label.innerText = '+0 (000) 000-00-00'

    const row_content_err = document.createElement('span');
    row_content_err.className = 'mdl-textfield__error'
    row_content_err.innerText = ''

    const row_delete = document.createElement('a');
    row_delete.className = 'mdl-list__item-secondary-action'

    const row_delete_icon = document.createElement('i');
    row_delete_icon.className = 'material-icons'
    row_delete_icon.innerText = 'delete'



    row_content_div.insertAdjacentElement('beforeend', row_content_err)
    row_content_div.insertAdjacentElement('beforeend', row_content_label)
    row_content_div.insertAdjacentElement('beforeend', row_content_input)
    row_delete.insertAdjacentElement('beforeend', row_delete_icon)


    componentHandler.upgradeElement(row_content_div);
    componentHandler.upgradeElement(row_delete);

    row_delete.onclick = function () {
        row.remove()
    }

    row_content.insertAdjacentElement('beforeend', row_content_div)
    row_content.insertAdjacentElement('beforeend', row_delete)
    row.insertAdjacentElement('beforeend', row_content)


    _phones.insertAdjacentElement('beforeend', row)

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
function checkPhonesValidation() {
    const phones = _phones.getElementsByTagName('input');

    for(let phone of phones)
    {
        if(!phone.validity.valid || phone.value === '')
            return false;
    }

    return true;
}

_add_contact.onclick = function () {
    if(!checkPhonesValidation())
    {
        const data = {message: 'Phones must be valid!'};
        _error_message.MaterialSnackbar.showSnackbar(data);
        return ;
    }


    const requestParams = {
        name: _name.value,
        surname: _surname.value,
        phones: getPhonesArray()
    }

    console.log(requestParams)
    rpc_send('/api/v1.0', 'contact.create', requestParams)
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
_logout.onclick = logout

window.onload = function () {
    signinIfNotLogined();
    createPhoneNumber();
}