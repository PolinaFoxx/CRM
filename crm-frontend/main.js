import { svgPreloader, svgAddContact, svgAdd, svgCrossContact, svgMail, svgVk, svgFb, svgPhone, svgAddPhone, svgOther } from './svg.js'
const API_BASE_URL = 'https://crm-kve9.onrender.com/api';
window.onload = function () {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('non')
    }
};

async function serverAddClient(obj) {
    const response = await fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
    });
    let data = await response.json()
    console.log('ответ от сервера:', data);
    return data
}

async function serverGetClient() {
    const response = await fetch('http://localhost:3000/api/clients/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    let data = await response.json()
    return data
}


async function serverDeleteClient(id) {
    const response = await fetch('http://localhost:3000/api/clients/' + id, {
        method: 'DELETE',
    });
    let data = await response.json()
    return data
}

async function serverChangeClient(id, clientObj) {
    const response = await fetch('http://localhost:3000/api/clients/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientObj),
    });
    let data = await response.json()

    console.log('ответ от сервера:', data);
    return data
}

async function findClients(value) {
    try {
        const response = await fetch(`http://localhost:3000/api/clients?search=${value}`, {
            method: 'GET'
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.log(error);
    }
}


// Прелоадер
function createPreloader() {
    const preloaderBlock = document.createElement('div');
    const preloaderCircle = document.createElement('span')

    preloaderBlock.classList.add('preloader');
    preloaderCircle.id = 'loader';

    preloaderCircle.innerHTML = svgPreloader;

    preloaderBlock.append(preloaderCircle)

    return preloaderBlock
}

// создание тултипа
function contactTooltip(type, value) {
    const tooltip = document.createElement('div');
    const tooltipType = document.createElement('span');
    const tooltipValue = document.createElement('a');

    tooltip.classList.add('contact__tooltip', 'site__tooltip');
    tooltipType.classList.add('contact__tooltipe__type');
    tooltipValue.classList.add('contact__tooltipe__value')

    tooltipType.textContent = type + ':';
    tooltipValue.textContent = value;

    tooltip.append(tooltipType, tooltipValue)
    return {
        tooltip,
        tooltipType,
        tooltipValue
    }
}
//форматируем ссылки 
function createContsctLinck(type, value, svg, item) {
    const setTooltip = contactTooltip(type, value)

    const link = document.createElement('a');
    link.classList.add('contacts__link');
    link.innerHTML = svg;

    if (type === 'Email') {
        link.href = `mailto:${value.trim()}`
    } else if (type === 'Телефон') {
        link.href = `tel:${value.trim()}`;

    } else {
        link.href = value.trim()
    }
    link.append(setTooltip.tooltip)
    item.appendChild(link)

    const linkItem = item; // Сохраняем ссылку на элемент

    return linkItem; // Возвращаем созданный элемент

}

function createContsctItemByType(type, value, item) {
    switch (type) {

        case 'Телефон':
            createContsctLinck(type, value, svgPhone, item);
            break
        case 'Facebook':
            createContsctLinck(type, value, svgFb, item);
            break
        case 'VK':
            createContsctLinck(type, value, svgVk, item);
            break
        case 'Email':
            createContsctLinck(type, value, svgMail, item);
            break
        case 'Доп.телефон':
            createContsctLinck(type, value, svgAddPhone, item);
            break
        case 'Другое':
            createContsctLinck(type, value, svgOther, item);
            break
        default:
    }

}

//СОЗДАНИЕ И СТИЛИЗАЦИЯ ЭЛЕМЕНТОВ 
//создание элементов хедера 
const $formHeader = document.createElement('form')
const $inputHeader = document.createElement('input')
const $divHeader = document.getElementById('header-container')
const $listHeader = document.createElement('ul')
$listHeader.classList.add('find-list', 'hide')

$inputHeader.classList.add('header__input')
$inputHeader.placeholder = 'Введите запрос'
$inputHeader.name = 'запрос'
$divHeader.append($formHeader)
$formHeader.append($inputHeader, $listHeader)

const $divContainer = document.getElementById('container')

const $buttonAddClient = document.createElement('button')
$buttonAddClient.classList.add('buttonAdd')

const $spanBtnAdd = document.createElement('span')
$spanBtnAdd.textContent = 'Добавить клиента'
$buttonAddClient.append($spanBtnAdd)
$buttonAddClient.innerHTML += svgAdd;

$divContainer.append($buttonAddClient)

//Создание таблицы
const $divClients = document.getElementById('clients')//в котором хранится вся таблица
const $sortingDisplay = document.createElement('thead')//заголовки для сортировки
const $theadTr = document.createElement('tr')

const $tabelBody = document.createElement('tbody')//тело с всеми ячейками
const $tabel = document.createElement('table')//сама таблица

//создаем ячейку для каждого заголовка
const $tabelid = document.createElement('th')
const $tabelfio = document.createElement('th')
const $tabelTimeCreate = document.createElement('th')
const $tabellastChang = document.createElement('th')
const $tabelContacts = document.createElement('th')
const $tabelActions = document.createElement('th')
const $sortingSpan = document.createElement('span')
const $createSpan = document.createElement('span')
const $editSpan = document.createElement('span')

const sortItems = [$tabelid, $tabelfio, $tabelTimeCreate, $tabellastChang];

for (const item of sortItems) {
    item.addEventListener('click', () => {
        if (item.classList.contains('sort-down')) {
            item.classList.remove('sort-down')
            item.classList.add('sort-up')
        } else {
            item.classList.add('sort-down')
            item.classList.remove('sort-up')
        }
    });

}

$tabelTimeCreate.addEventListener('click', () => {
    if ($tabelTimeCreate.classList.contains('sort-down')) {
        $createSpan.classList.add('sort-up')
    } else {
        $createSpan.classList.remove('sort-up')
    }
})


$tabellastChang.addEventListener('click', () => {
    if ($tabellastChang.classList.contains('sort-down')) {
        $editSpan.classList.add('sort-up')
    } else {
        $editSpan.classList.remove('sort-up')
    }
})

$divClients.classList.add('clients__wrapper')
$tabel.classList.add('clients__tabel')
$tabelBody.classList.add('clients__tbody')
$sortingDisplay.classList.add('clients__display', 'display-info')

$tabelid.classList.add('display-info__item', 'display-info__id', 'sort-up')
$tabelfio.classList.add('display-info__item', 'display-info__fio', 'sort-down')
$tabelTimeCreate.classList.add('display-info__item', 'display-info__timeCreate', 'sort-down')
$tabellastChang.classList.add('display-info__item', 'display-info__lastChang', 'sort-down')
$tabelContacts.classList.add('display-info__item', 'display-info__contacts')
$tabelActions.classList.add('display-info__item', 'display-info__actions')
$sortingSpan.classList.add('display-info__sort')
$createSpan.classList.add('create__span')
$editSpan.classList.add('edit__span')

$tabelid.textContent = 'ID'
$tabelfio.textContent = 'Фамилия Имя Отчество'
$tabelTimeCreate.textContent = 'Дата и время создания'
$tabellastChang.textContent = 'Последние изменения'
$tabelContacts.textContent = 'Контакты'
$tabelActions.textContent = 'Действия'
$sortingSpan.textContent = 'А-Я'

$tabelid.setAttribute('data-type', 'id')
$tabelfio.setAttribute('data-type', 'text')
$tabelTimeCreate.setAttribute('data-type', 'create')
$tabellastChang.setAttribute('data-type', 'update')

$tabelfio.append($sortingSpan)
$tabelTimeCreate.append($createSpan)
$tabellastChang.append($editSpan)
$theadTr.append($tabelid, $tabelfio, $tabelTimeCreate, $tabellastChang, $tabelContacts, $tabelActions)
$sortingDisplay.append($theadTr)
$divClients.append($tabel)
$tabel.append($sortingDisplay, $tabelBody)


const preloader = createPreloader();
$divClients.appendChild(preloader);

let ClientList = [];
ClientList = await serverGetClient()
render(ClientList)
searchClients(ClientList);


function createWindow(open, close, oneClient = null) {

    const $divModalWindowContainer = document.createElement('div')
    const $divModalBox = document.createElement('div')

    $divModalWindowContainer.classList.add('modal')
    $divModalBox.classList.add('modal__box')

    const $btnClose = document.createElement('button')
    $btnClose.classList.add('btn__close')
    $btnClose.textContent = 'X'

    //создание обертки инпутов ФИО
    const $formInputsModal = document.createElement('form')
    $formInputsModal.classList.add('form__inputs__modal__add')

    //создание инпутов ФИО
    const $inputModalSurname = document.createElement('input')
    const $inputModalName = document.createElement('input')
    const $inputModalMiddelname = document.createElement('input')

    $inputModalSurname.type = 'text'
    $inputModalSurname.placeholder = 'Фамилия'
    $inputModalSurname.name = 'Surname'
    $inputModalSurname.classList.add('input__form__modal')
    $inputModalSurname.id = 'floatingSurname';
    $inputModalSurname.required = 'true'

    $inputModalName.placeholder = 'Имя'
    $inputModalName.name = 'Name'
    $inputModalName.classList.add('input__form__modal')
    $inputModalName.id = 'floatingName';
    $inputModalName.required = 'true'

    $inputModalMiddelname.placeholder = 'Отчество'
    $inputModalMiddelname.name = 'Middelname'
    $inputModalMiddelname.classList.add('input__form__modal')
    $inputModalMiddelname.id = 'floatingLastName';
    $inputModalMiddelname.required = 'true'

    //валидация формы
    const $errorBlock = document.createElement('p');
    const $unacceptableLetter = document.createElement('span');
    const $writeName = document.createElement('span');
    const $writeSurname = document.createElement('span');
    const $writeLastName = document.createElement('span');
    const $requiredValue = document.createElement('span');
    const $requiredContacts = document.createElement('span');

    $errorBlock.classList.add('modal__error');
    $unacceptableLetter.id = 'unacceptableLetter';
    $writeName.id = 'writeName';
    $writeSurname.id = 'writeSurname';
    $writeLastName.id = 'writeLastName';
    $requiredValue.id = 'requiredValue';
    $requiredContacts.id = 'requiredContacts';

    $errorBlock.append($writeSurname, $writeName, $writeLastName, $requiredValue, $unacceptableLetter, $requiredContacts)

    function addContact() {
        let contactsArr = [];

        const divs = document.querySelector('.div__add__contact')

        const selects = divs.querySelectorAll('select')

        const inputs = divs.querySelectorAll('input')
        for (let i = 0; i < selects.length; i++) {
            contactsArr.push({
                type: selects[i].value,
                value: inputs[i].value
            })
        }

        const inputsModalForm = document.querySelectorAll('.input__form__modal')
        inputsModalForm.forEach(input => {
            input.value = '';
        });

        if (contactsArr.length === 0) {
            contactsArr = [];
        }

        return contactsArr;

    }


    if (oneClient) {
        $inputModalName.value = oneClient.name
        $inputModalSurname.value = oneClient.surname
        $inputModalMiddelname.value = oneClient.lastName
    }

    //создание заголовка модал.окна "Новый клиента"
    const $titleModalAddClient = document.createElement('h2')
    $titleModalAddClient.classList.add('title__modal')
    $titleModalAddClient.textContent = 'Новый клиент'

    const $divWrapperСhange = document.createElement('div')
    $divWrapperСhange.classList.add('Wrapper__Сhange')
    const $titleModalСhange = document.createElement('h2')
    const $spanTitelChange = document.createElement('span')
    $titleModalСhange.textContent = 'Изменить данные'

    $titleModalСhange.classList.add('wrapper__titel')
    $spanTitelChange.textContent = 'ID:'
    $spanTitelChange.classList.add('id__span')
    $divWrapperСhange.append($titleModalСhange, $spanTitelChange)

    const $btnDeleteChange = document.createElement('button')
    $btnDeleteChange.textContent = 'Удалить клиента'
    $btnDeleteChange.classList.add('btn__delete__change')

    function createbtnAddContsct() {
        const $divContainerAddContact = document.createElement('div')
        $divContainerAddContact.classList.add('div__add__contact')

        const $divWrapperContacts = document.createElement('div')
        $divWrapperContacts.classList.add('divWrapperContacts')
        const $divContacts = document.createElement('div')
        $divContacts.classList.add('divContacts')

        const $btnModalAdd = document.createElement('button')

        $btnModalAdd.classList.add('btn__modal__add')
        $btnModalAdd.type = 'button'
        $btnModalAdd.textContent = 'Добавить контакт'
        $btnModalAdd.innerHTML += svgAddContact;

        $divContainerAddContact.append($divWrapperContacts, $btnModalAdd)
        $divWrapperContacts.append($divContacts)

        return {
            $divContainerAddContact,
            $divWrapperContacts,
            $divContacts,
            $btnModalAdd
        }
    }
    const btnAddContact = createbtnAddContsct()

    function createDropdownlist(contactType = null, contactValue = null) {
        const $divdropdownlist = document.createElement('div')
        const $formdropdownlist = document.createElement('div')
        const $labeldropdownlist = document.createElement('label')
        const $selectdropdownlist = document.createElement('select')
        const $optiondropdownAddPhone = document.createElement('option')
        const $optiondropdownPhone = document.createElement('option')
        const $optiondropdownMail = document.createElement('option')
        const $optiondropdownVK = document.createElement('option')
        const $optiondropdownFb = document.createElement('option')
        const $optiondropdownOther = document.createElement('option')

        $selectdropdownlist.classList.add('selectCotacts')

        $optiondropdownPhone.textContent = 'Телефон'
        $optiondropdownPhone.dataset.type = 'Телефон'
        $optiondropdownAddPhone.textContent = 'Доп.телефон'
        $optiondropdownAddPhone.dataset.type = 'Доп.телефон'
        $optiondropdownMail.textContent = 'Email'
        $optiondropdownMail.dataset.type = 'Email'
        $optiondropdownVK.textContent = 'VK'
        $optiondropdownVK.dataset.type = 'VK'
        $optiondropdownFb.textContent = 'Facebook'
        $optiondropdownFb.dataset.type = 'Facebook'
        $optiondropdownOther.textContent = 'Другое'
        $optiondropdownOther.dataset.type = 'Другое'

        $divdropdownlist.classList.add('divdropdownlist')

        $divdropdownlist.append($formdropdownlist)
        $formdropdownlist.append($labeldropdownlist)
        $labeldropdownlist.append($selectdropdownlist)
        $selectdropdownlist.append($optiondropdownAddPhone, $optiondropdownPhone, $optiondropdownMail, $optiondropdownVK, $optiondropdownFb, $optiondropdownOther)

        const $inputIputField = document.createElement('input')
        $inputIputField.placeholder = 'Введите данные контакта'
        $inputIputField.classList.add('dropdownlist__input')
        $inputIputField.name = 'данные контакта'
        $divdropdownlist.classList.add('open')

        const $btnCross = document.createElement('button')
        $btnCross.classList.add('btn__cross')
        $btnCross.type = 'button'
        $btnCross.innerHTML = svgCrossContact;

        $divdropdownlist.append($inputIputField, $btnCross)

        $btnCross.addEventListener('click', function (event) {
            event.preventDefault();
            $divdropdownlist.remove();
        });

        if (contactType) {
            $selectdropdownlist.value = contactType;
        }

        if (contactValue) {
            $inputIputField.value = contactValue;
        }

        return {
            $divdropdownlist,
            $inputIputField,
            $labeldropdownlist,
            $selectdropdownlist,
            $btnCross
        }
    }
    btnAddContact.$btnModalAdd.onclick = contactAddFunc;
    function contactAddFunc(event) {
        event.preventDefault();
        const contactdivs = document.getElementsByClassName('divdropdownlist')

        if (contactdivs.length < 9) {
            const dropdown = createDropdownlist();
            btnAddContact.$divContacts.append(dropdown.$divdropdownlist)
        } else {
            btnAddContact.$btnModalAdd.classList.add('hide')
        }
    }


    //Сохранить 
    const $btnSave = document.createElement('button')
    $btnSave.textContent = 'Сохранить'
    $btnSave.classList.add('btn__save')
    $btnSave.setAttribute('type', 'submit')
    // Отмена 
    const $btnСancel = document.createElement('button')
    $btnСancel.textContent = 'Отмена'
    $btnСancel.classList.add('btn__cancel')
    $btnСancel.type = 'button'

    $btnСancel.addEventListener('click', function () {
        $divModalWindowContainer.remove()
    })

    const $divWindowDelete = document.createElement('div')
    $divWindowDelete.classList.add('modal__box__delete')

    const $titelDelete = document.createElement('h2')
    $titelDelete.classList.add('title__modal')
    $titelDelete.textContent = 'Удалить клиента'

    const $spanDelete = document.createElement('span')
    $spanDelete.textContent = 'Вы действительно хотите удалить данного клиента?'
    $spanDelete.classList.add('span__delete')

    const $btnWindowDelete = document.createElement('button')
    $btnWindowDelete.textContent = 'Удалить'
    $btnWindowDelete.classList.add('btn__delete')

    $btnWindowDelete.addEventListener('click', function () {
        $divModalWindowContainer.remove()
    })

    const $btnWindowCancel = document.createElement('button')
    $btnWindowCancel.textContent = 'Отмена'
    $btnWindowCancel.classList.add('btn__cancel')

    const $btnCloseWidow = document.createElement('button')
    $btnCloseWidow.classList.add('btn__close')
    $btnCloseWidow.textContent = 'X'

    $divWindowDelete.append($btnCloseWidow, $titelDelete, $spanDelete, $btnWindowDelete, $btnWindowCancel)
    $btnWindowCancel.addEventListener('click', function () {
        $divModalWindowContainer.remove()
    })

    $btnClose.addEventListener('click', function (event) {
        event.preventDefault()
        $divModalWindowContainer.remove()
    })

    $divContainer.append($divModalWindowContainer)
    $divModalWindowContainer.append($divModalBox, $divWindowDelete)

    $divModalBox.append($divWrapperСhange)

    open({
        $divModalBox, $divWrapperСhange, $titleModalAddClient, $btnСancel, $btnWindowDelete, $formInputsModal,
        $spanTitelChange, $btnDeleteChange, $divWindowDelete, $btnSave, btnAddContact, createDropdownlist
    })
    $divModalBox.append($btnClose, $titleModalAddClient, $formInputsModal)
    $formInputsModal.append($inputModalSurname, $inputModalName, $inputModalMiddelname, btnAddContact.$divContainerAddContact, $errorBlock,
        $btnSave, $btnСancel, $btnDeleteChange)

    close({ $btnСancel, $btnDeleteChange })

    $btnCloseWidow.addEventListener('click', function (event) {
        event.preventDefault()
        $divModalWindowContainer.remove()
    })

    $formInputsModal.addEventListener('submit', async function createSubmit(event) {
        event.preventDefault()


        const validatedContact = validationContacts($formInputsModal);
        if (!validatedContact) {
            return;
        }

        let clientObj = {
            name: $inputModalName.value.trim(),
            surname: $inputModalSurname.value.trim(),
            lastName: $inputModalMiddelname.value.trim(),
            contacts: addContact()
        }
        console.log(clientObj);

        console.log(oneClient);
        if (oneClient) {
            await serverChangeClient(oneClient.id, clientObj);
            ClientList = await serverGetClient()
            console.log(ClientList);

        } else {

            let serverData = await serverAddClient(clientObj)

            console.log('Добавлен клиент:', serverData);
            ClientList.push(serverData)
            console.log(ClientList);
        }
        $divModalWindowContainer.remove()
        render(ClientList)
    })
}


$buttonAddClient.addEventListener('click', function () {
    createWindow(

        function () {
            console.log('ззз')
        },

        function () {
            console.log('закрыто')
        }
    )
})

function formatDate(date) {

    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    let yy = date.getFullYear();
    if (yy < 10) yy = '0' + yy;

    let hh = date.getHours()
    if (hh < 10) hh = '0' + hh

    let minmin = date.getMinutes()
    if (minmin < 10) minmin = '0' + minmin

    return dd + '.' + mm + '.' + yy + ' ' + hh + ':' + minmin
}

const arrData = await serverGetClient();

function render(arrData) {
    $tabelBody.innerHTML = ''
    let copyClientList = [...arrData]

    for (const oneClient of copyClientList) {
        oneClient.id = oneClient.id
        oneClient.fio = oneClient.surname + ' ' + oneClient.name + ' ' + oneClient.lastName
        oneClient.contacts = oneClient.contacts
        oneClient.createdAt = oneClient.createdAt
        oneClient.updatedAt = oneClient.updatedAt
    }

    for (const oneClient of ClientList) {
        const $clientTr = createClient(oneClient)

        $tabelBody.append($clientTr)
    }
}
render(ClientList)

function createClient(oneClient) {
    const $clientTr = document.createElement('tr')
    const $clientid = document.createElement('td')
    $clientid.classList.add('client__id')

    const $clientfio = document.createElement('td')
    $clientfio.classList.add('clients__full-name')
    const $clientTimeCreate = document.createElement('td')
    const $clientlastChang = document.createElement('td')
    const $clientContacts = document.createElement('td')
    $clientContacts.classList.add('clients__contacts')
    $clientContacts.classList.add('td__wrap')
    const $clientActions = document.createElement('td')
    $clientTr.classList.add('clients__item')

    $clientid.textContent = oneClient.id
    $clientfio.textContent = oneClient.fio
    $clientTimeCreate.textContent = formatDate(new Date(oneClient.createdAt))
    $clientlastChang.textContent = formatDate(new Date(oneClient.updatedAt))

    const totalContacts = oneClient.contacts?.length;

    if (oneClient.contacts && oneClient.contacts.length > 0) {
        oneClient.contacts.forEach((contact, index) => {
            if (index < 4) {
                createContsctItemByType(contact.type, contact.value, $clientContacts);
            }
        });
    } else {
        $clientContacts.textContent = '';
    }
    if (totalContacts > 4) {
        const hiddenContactsCount = totalContacts - 4;
        const $hiddenContactsSpan = document.createElement('span');
        $hiddenContactsSpan.classList.add('hidden__contacts');
        $hiddenContactsSpan.textContent = `+${hiddenContactsCount}`;

        $hiddenContactsSpan.addEventListener('click', () => {
            oneClient.contacts.forEach((contact, index) => {
                if (index >= 4) {
                    createContsctItemByType(contact.type, contact.value, $clientContacts);
                }
            });
            $hiddenContactsSpan.remove();
        });

        $clientContacts.appendChild($hiddenContactsSpan);
    }

    const $btnChange = document.createElement('button')
    $btnChange.textContent = 'Изменить'
    $btnChange.classList.add('clients__edit')

    $btnChange.addEventListener('click', function () {
        createWindow(
            function ({ $divWrapperСhange, $titleModalAddClient, $btnCross, $divWindowDelete, $spanTitelChange, btnAddContact, createDropdownlist }) {

                $spanTitelChange.textContent = 'ID:' + '' + oneClient.id

                if (oneClient && oneClient.contacts) {
                    for (let contact of oneClient.contacts) {
                        if (contact) {
                            const dropdown = createDropdownlist(contact.type, contact.value);
                            btnAddContact.$divContacts.append(dropdown.$divdropdownlist);
                        }
                    }
                }

                $divWrapperСhange.classList.add('open')
                $titleModalAddClient.classList.add('close')
                $spanTitelChange.classList.add('open')
                $divWindowDelete.classList.remove('open')
            },
            function ({ $btnСancel, $btnDeleteChange }) {
                $btnСancel.classList.add('close')
                $btnDeleteChange.classList.add('open')
            },
            oneClient
        )

    })

    let $btnDelete = document.createElement('button')
    $btnDelete.textContent = 'Удалить'
    $btnDelete.classList.add('clients__delete')

    $btnDelete.addEventListener('click', function () {

        createWindow(
            function ({ $divModalBox, $divWrapperСhange, $titleModalAddClient, $divWindowDelete, $btnWindowDelete }) {
                $divWindowDelete.classList.add('open')
                $divWrapperСhange.classList.remove('open')
                $divModalBox.classList.add('close')
                $titleModalAddClient.classList.add('close')

                $btnWindowDelete.addEventListener('click', async function () {
                    await serverDeleteClient(oneClient.id);

                    ClientList = await serverGetClient()

                    $clientTr.remove();
                });

            },

            function () {
            }
        )
    })

    $clientTr.append($clientid, $clientfio, $clientTimeCreate, $clientlastChang, $clientContacts, $clientActions)
    $clientActions.append($btnChange, $btnDelete)

    return $clientTr
}

//Сортировка 
function sortTabel() {
    const tabel = document.querySelector('table');
    const headers = tabel.querySelectorAll('th');

    const tbody = tabel.querySelector('tbody');
    const headersArray = Array.from(headers);

    const directions = headersArray.map(() => '')

    function transformText(type, content) {
        switch (type) {
            case 'id':
                return parseFloat(content);
            case 'create':
            case 'update':
                return content.split('.').reverse().join('-');
            case 'text':
            default:
                return content;
        }
    }

    function sortColumn(index) {
        const type = headers[index].getAttribute('data-type');
        const rows = tbody.querySelectorAll('tr')
        const direction = directions[index] || 'sortUp';
        const multiply = direction === 'sortUp' ? 1 : -1;
        const newRows = Array.from(rows);

        newRows.sort((row1, row2) => {
            const cellA = row1.querySelectorAll('td')[index].textContent
            const cellB = row2.querySelectorAll('td')[index].textContent

            const a = transformText(type, cellA)
            const b = transformText(type, cellB)
            switch (true) {
                case a > b:
                    return 1 * multiply;

                case a < b:
                    return -1 * multiply;

                default:
                    break;
                case a === b:
                    return 0
            }
        });

        Array.from(rows).forEach(row => {
            tbody.removeChild(row);
        });

        directions[index] = direction === 'sortUp' ? 'sortDown' : 'sortUp';

        newRows.forEach(newRow => {
            tbody.appendChild(newRow);
        });
    }

    headersArray.forEach((header, index) => {
        header.addEventListener('click', () => {
            sortColumn(index);
        });
    });

}
sortTabel()

function searchClients() {
    const findList = document.querySelector('.find-list');
    const input = document.querySelector('.header__input');
    let timeoutId;

    function updateFindList(clients) {
        findList.innerHTML = '';
        clients.forEach(client => {
            const findItem = document.createElement('li');

            findItem.classList.add('find-list__item');
            findItem.textContent = `${client.name} ${client.surname} ${client.lastName}`;

            findList.append(findItem);
        });
    };

    input.addEventListener('input', async () => {
        const value = input.value.trim();
        clearTimeout(timeoutId);

        timeoutId = setTimeout(async () => {
            if (value !== '') {

                ClientList = await findClients(value);
                updateFindList(ClientList);

            } else {
                findList.innerHTML = '';
                ClientList = await serverGetClient();
            }
            render(ClientList);
        }, 300);
    });
}


function validateClientForm() {
    const userName = document.getElementById('floatingName');
    const userSurname = document.getElementById('floatingSurname');
    const userLastName = document.getElementById('floatingLastName');

    const unacceptableLetter = document.getElementById('unacceptableLetter');
    const writeName = document.getElementById('writeName');
    const writeSurname = document.getElementById('writeSurname');
    const writeLastName = document.getElementById('writeLastName');
    const requiredValue = document.getElementById('requiredValue');
    const validateArray = [unacceptableLetter, writeName, writeSurname, writeLastName, requiredValue];
    const regexp = /[^а-яА-ЯёЁa-zA-Z]+/g;

    function onInputValue(input) {
        input.addEventListener('input', () => {
            input.classList.add('error')
            for (const item of validateArray) {
                item.textContent = '';
            }
        });

        input.oncut = input.oncopy = input.onpaste = () => {
            input.classList.add('noerror')
            for (const item of validateArray) {
                item.textContent = '';
            }
        };

        input.onchange = () => {
            input.classList.add('noerror')
            if (userSurname.value && userName.value && userLastName.value) {
                for (const item of validateArray) {
                    item.textContent = '';
                }
            }
        }
    }

    onInputValue(userName);
    onInputValue(userSurname);
    onInputValue(userLastName);

    function checkRequiredName(input, message, name) {
        if (!input.value) {
            input.classList.add('error')
            message.textContent = `Введите ${name} клиента!`;
            return false;
        } else {
            message.textContent = '';
        }
        return true;
    }

    function checkRegexp(input, regexp) {
        if (regexp.test(input.value)) {
            input.classList.add('error')
            unacceptableLetter.textContent = 'Недопустимые символы!';
            return false;
        }

        return true;
    }

    if (!checkRequiredName(userSurname, writeSurname, 'Фамилию')) { return false };
    if (!checkRequiredName(userName, writeName, 'Имя')) { return false };
    if (!checkRequiredName(userLastName, writeLastName, 'Отчество')) { return false };
    //проверка на соответствие регулярному выражению
    if (!checkRegexp(userName, regexp)) { return false };
    if (!checkRegexp(userSurname, regexp)) { return false };
    if (!checkRegexp(userLastName, regexp)) { return false };

    const validatedClient = {
        surname: userSurname.value.trim(),
        name: userName.value.trim(),
        lastName: userLastName.value.trim()
    };

    return validatedClient;
}

function getInputNumbersValue(input) {
    return input.value.replace(/\D/g, '');
}

function showError(input, message) {
    const errorMessage = document.createElement('span');
    errorMessage.classList.add('error')
    errorMessage.textContent = message;
    input.parentElement.appendChild(errorMessage);
}

function hideError(event) {
    const input = event.target;
    const message = input.parentElement.querySelector('.error');

    if (message) {
        message.remove();
    }

    input.classList.remove('error');
}


function validationContacts(form) {
    const userName = document.getElementById('floatingName');
    const userSurname = document.getElementById('floatingSurname');
    const userLastName = document.getElementById('floatingLastName');

    if (!userSurname.value.trim()) {
        alert('Фамилия не введена!');
        return false;
    }
    if (!userName.value.trim()) {
        alert('Имя не введено!');
        return false;
    }
    if (!userLastName.value.trim()) {
        alert('Отчество не введено!');
        return false;
    }

    let isValidate = true;

    const select = document.querySelector('.selectCotacts');
    const inputFields = form.querySelectorAll('.dropdownlist__input');
    if (select) {
        select.addEventListener('change', () => {
            const selectedValue = select.value;

            input.dataset.type = selectedValue;
        });
    }

    for (const input of inputFields) {

        if (!input.value.trim()) {
            showError(input, "Ошибка: Поле не может быть пустым!");
            input.addEventListener("input", hideError);
            isValidate = false;
            continue;
        }

        switch (input.dataset.type) {

            case "phone":
                const regExpPhone = /^\d{11,12}$/g;
                if (!regExpPhone.test(getInputNumbersValue(input))) {
                    showError(
                        input,
                        "Ошибка: Номер телофона должен содержать от 11 до 12 цифр!"
                    );
                    input.addEventListener("input", hideError);
                    isValidate = false;
                } else {
                    clientObj.contacts.unshift({
                        type: String(input.dataset.type),
                        value: String(input.value.replace(/[\s\(\)-]/g, "")),
                    });
                }
                break;

            case "email":
                const regExpEmail =
                    /^[A-Za-z0-9!#$%&\'*+-/=?^_`{|}~]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+[A-Za-z]$/g;
                if (!regExpEmail.test(input.value)) {
                    showError(input, "Ошибка: Некорректный адрес электронной почты!");
                    input.addEventListener("input", hideError);
                    isValidate = false;
                } else {
                    clientObj.contacts.unshift({
                        type: String(input.dataset.type),
                        value: String(input.value),
                    });
                }
                break;
            case "vk":
            case "fb":
                const regExpSoc = input.dataset.type === "vk"
                    ? /^(https:\/\/)?vk\.com\/{1}[a-zA-Z0-9\.]{1,20}$/g
                    : /^(https:\/\/)?www\.facebook\.com\/{1}[a-zA-Z\.]{1,20}$/g;
                if (!regExpSoc.test(input.value)) {
                    showError(
                        input,
                        `Ошибка: Некорректное значение в поле "${input.dataset.type === "vk" ? "Vk" : "Facebook"
                        }"!`
                    );
                    input.addEventListener("input", hideError);
                    isValidate = false;
                } else {
                    clientObj.contacts.unshift({
                        type: String(input.dataset.type),
                        value: String(input.value).startsWith("https://")
                            ? String(input.value)
                            : "https://" + String(input.value),
                    });
                }
                console.log(clientObj);

                break;
            default:

        }
        if (!isValidate) return false;
    }
    return {
        isValidate,
    };
}
