import { svgPreloader, svgAddContact, svgAdd, svgCrossContact, svgMail, svgVk, svgFb, svgPhone, svgAddPhone, svgOther } from './svg.js'

window.onload = function () {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('non') // Скрываем прелоадер
    }
};

// Добавление на сервер нового клиента(отправляем данные о новом клиенте на сервер) 
async function serverAddClient(obj) {
    //отправляем запрос
    const response = await fetch('http://localhost:3000/api/clients', {
        //указываем что именно хотим добавить
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, //говорим серверу что это JSON формат
        //в body сама информация и преобразуем в строку
        body: JSON.stringify(obj),
    });
    //тут будут храниться данные которые вернет сервер(получаем  ответ с информацией о созданном клиенте.)
    let data = await response.json()
    console.log('ответ от сервера:', data);
    return data  // возвращаем данные
}

//получаем данные с сервера
async function serverGetClient() {
    //отправляем запрос
    const response = await fetch('http://localhost:3000/api/clients/', {
        //указываем что именно хотим добавить
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }//говорим серверу что это JSON формат
    })
    let data = await response.json()
    return data  // возвращаем данные
}


async function serverDeleteClient(id) {
    //отправляем запрос
    const response = await fetch('http://localhost:3000/api/clients/' + id, {
        //указываем что именно хотим добавить
        method: 'DELETE',
    });
    //тут будут храниться данные которые вернет сервер(получаем  ответ с информацией о созданном клиенте.)
    let data = await response.json()
    return data  // возвращаем данные
}


// id клиента,которого нужно обновить,clientObj сам объект с изменеными данными
async function serverChangeClient(id, clientObj) {
    //отправляем запрос с id нужного нам клиента
    const response = await fetch('http://localhost:3000/api/clients/' + id, {
        //указываем что именно хотим добавить
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }, //говорим серверу что это JSON формат
        //в body сама информация и преобразуем в строку
        body: JSON.stringify(clientObj), // отправляются измененные данные клиента в формате JSON, полученные из clientObj
    });
    //Функция ждет ответа от сервера с помощью оператора await и преобразует ответ сервера из формата JSON в объект JavaScript с помощью метода response.json().
    let data = await response.json()

    console.log('ответ от сервера:', data);
    //возвращаем данные от сервера, которые представляют собой обновленные данные клиента после успешного обновления на сервере
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
    //установка содержимого ссылки
    link.innerHTML = svg;

    //установка  атрибута href в зависимости от типа
    if (type === 'Email') {
        link.href = `mailto:${value.trim()}`
    } else if (type === 'Телефон') {
        link.href = `tel:${value.trim()}`;

    } else {
        link.href = value.trim()
    }
    link.append(setTooltip.tooltip)
    // //добавление  элемента в родительский элемент
    item.appendChild(link)
    // console.log(link);
    // return item
    //  linkItem ссылается на только что созданный link
    const linkItem = item; // Сохраняем ссылку на элемент
    // console.log(item); // выводит  созданный элемент

    return linkItem; // Возвращаем созданный элемент

}

// создание элемента контакта в зависимости от типа
function createContsctItemByType(type, value, item) {
    //какой блок кода выполнить в зависимости от значения type
    switch (type) {

        //если type равен Телефон
        case 'Телефон':
            //блок кода,который выполнится
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
        //Если type не соответствует ни одному из указанных значений, выполняется блок
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


// Создаем прелоадер и добавляем его в таблицу
const preloader = createPreloader();
$divClients.appendChild(preloader);

// Массив для хранения данных клиентов
let ClientList = [];
// ClientList.push(getpushClients)
ClientList = await serverGetClient() //получаем всех клиентов с сервера
render(ClientList)
searchClients(ClientList);


//создание модального "Добавить клиента"
function createWindow(open, close, oneClient = null) {

    const $divModalWindowContainer = document.createElement('div')
    const $divModalBox = document.createElement('div')

    $divModalWindowContainer.classList.add('modal')
    $divModalBox.classList.add('modal__box')

    //Кнопка закрытия модального окна 
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
    $inputModalSurname.required='true'

    $inputModalName.placeholder = 'Имя'
    $inputModalName.name = 'Name'
    $inputModalName.classList.add('input__form__modal')
    $inputModalName.id = 'floatingName';
    $inputModalName.required='true'


    $inputModalMiddelname.placeholder = 'Отчество'
    $inputModalMiddelname.name = 'Middelname'
    $inputModalMiddelname.classList.add('input__form__modal')
    $inputModalMiddelname.id = 'floatingLastName';
    $inputModalMiddelname.required='true'

        // console.log(oneClient);

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

    //Функция добавления контактов в форму
    function addContact() {
        // Массив с контактами
        let contactsArr = []; // Объявляем массив здесь, чтобы он очищался при каждом добавлении клиента

        //сбор контактов
        const divs = document.querySelector('.div__add__contact')//находим div

        const selects = divs.querySelectorAll('select')//из дива находим все select

        const inputs = divs.querySelectorAll('input')//из дива находим все input
        for (let i = 0; i < selects.length; i++) {
            contactsArr.push({
                type: selects[i].value,//получаем конкретный селект.
                value: inputs[i].value//получаем конкретный инпут.
            })
        }


        //Очищаем содержимое инпутов
        const inputsModalForm = document.querySelectorAll('.input__form__modal')
        //перебираем каждое поле input
        inputsModalForm.forEach(input => {
            input.value = ''; // устанавливаем значение для каждого поля
        });

        // Если контакты не были введены, создаем пустой массив
        if (contactsArr.length === 0) {
            contactsArr = []; // Пустой массив, если контакты не введены
        }

        return contactsArr; // Возвращаем массив контактов

    }

    //используется для проверки, передан ли объект oneClient в функцию createWindow. 
    //Если объект oneClient существует (то есть не равен null или undefined),
    //то значения полей ввода (инпутов) для имени, фамилии и отчества заполняются данными из этого объекта
    if (oneClient) {
        $inputModalName.value = oneClient.name
        $inputModalSurname.value = oneClient.surname
        $inputModalMiddelname.value = oneClient.lastName
        // $inputIputField.value = oneClient.contacts
        // createDropdownlist(oneClient.contacts)
    }

    //создание заголовка модал.окна "Новый клиента"
    const $titleModalAddClient = document.createElement('h2')
    $titleModalAddClient.classList.add('title__modal')
    $titleModalAddClient.textContent = 'Новый клиент'

    //создание заголовка модал.окна "Изменить данные"
    const $divWrapperСhange = document.createElement('div')
    $divWrapperСhange.classList.add('Wrapper__Сhange')
    const $titleModalСhange = document.createElement('h2')
    const $spanTitelChange = document.createElement('span')
    $titleModalСhange.textContent = 'Изменить данные'

    $titleModalСhange.classList.add('wrapper__titel')
    $spanTitelChange.textContent = 'ID:'
    $spanTitelChange.classList.add('id__span')
    $divWrapperСhange.append($titleModalСhange, $spanTitelChange)


    //Кнопка "удалить клиента"
    const $btnDeleteChange = document.createElement('button')
    $btnDeleteChange.textContent = 'Удалить клиента'
    $btnDeleteChange.classList.add('btn__delete__change')




    //Создание кнопки "добавить контакт"  в модальном окне 
    function createbtnAddContsct() {
        const $divContainerAddContact = document.createElement('div')//контейнер для контактов общий и кнопка
        $divContainerAddContact.classList.add('div__add__contact')

        const $divWrapperContacts = document.createElement('div')//див для дива с контактми 
        $divWrapperContacts.classList.add('divWrapperContacts')
        const $divContacts = document.createElement('div')//сам див с контактами сами контакты(выпадающий список и инпут-поле ввода)
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



    //Создане дива "Добавить контакт" 
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

        //Добавление дива для ввода к выпадающему списку
        const $inputIputField = document.createElement('input')
        $inputIputField.placeholder = 'Введите данные контакта'
        $inputIputField.classList.add('dropdownlist__input')
        $inputIputField.name = 'данные контакта'
        // $inputIputField.required='true'
        $divdropdownlist.classList.add('open')

        //кнопка удаления контакта в окне "Изменить"
        const $btnCross = document.createElement('button')
        $btnCross.classList.add('btn__cross')
        $btnCross.type = 'button'
        $btnCross.innerHTML = svgCrossContact;

        $divdropdownlist.append($inputIputField, $btnCross)

        $btnCross.addEventListener('click', function (event) {
            event.preventDefault();
            $divdropdownlist.remove();
        });


        // Установка выбранного значения, если оно передано
        if (contactType) {
            $selectdropdownlist.value = contactType;
        }

        // Установка значения инпута, если оно передано
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
    // let divdropdownlist= createDropdownlist()

    // Здесь добавляем обработчик события для кнопки добавления контакта
    btnAddContact.$btnModalAdd.onclick = contactAddFunc;
    function contactAddFunc(event) {
        event.preventDefault();
        //получаем дивы контактов
        const contactdivs = document.getElementsByClassName('divdropdownlist')

        //если меньше 9 создаем див
        if (contactdivs.length < 9) {
            const dropdown = createDropdownlist();
            btnAddContact.$divContacts.append(dropdown.$divdropdownlist)
        } else {
            //иначе скрываем кнопку 
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

    //При нажатии на кнопку "Отмена" закрывается модальное окно 
    $btnСancel.addEventListener('click', function () {
        $divModalWindowContainer.remove()//удаляем модальное окно
    })



    //Создание окна при нажатии на "Удалить"
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
        $divModalWindowContainer.remove()//удаляем модальное окно
    })

    const $btnWindowCancel = document.createElement('button')
    $btnWindowCancel.textContent = 'Отмена'
    $btnWindowCancel.classList.add('btn__cancel')

    const $btnCloseWidow = document.createElement('button')
    $btnCloseWidow.classList.add('btn__close')
    $btnCloseWidow.textContent = 'X'
    // Добавляем обработчик события для кнопки удаления


    $divWindowDelete.append($btnCloseWidow, $titelDelete, $spanDelete, $btnWindowDelete, $btnWindowCancel)
    //При нажатии на кнопку "Отмена" закрывается модальное окно 
    $btnWindowCancel.addEventListener('click', function () {
        $divModalWindowContainer.remove()//удаляем модальное окно
    })

    //При нажатии на кнопку "X" закрывается  модальное окно 
    $btnClose.addEventListener('click', function (event) {
        event.preventDefault()
        $divModalWindowContainer.remove()//удаляем модальное окно
    })

    //апппенд окна 
    $divContainer.append($divModalWindowContainer)
    $divModalWindowContainer.append($divModalBox, $divWindowDelete)

    $divModalBox.append($divWrapperСhange)

    // let divlist = createDropdownlist()

    open({
        $divModalBox, $divWrapperСhange, $titleModalAddClient, $btnСancel, $btnWindowDelete, $formInputsModal,
        $spanTitelChange, $btnDeleteChange, $divWindowDelete, $btnSave, btnAddContact, createDropdownlist
    })
    //добавляем в основное окно кнопку закрыть и заголовок и форму
    $divModalBox.append($btnClose, $titleModalAddClient, $formInputsModal)
    //добавляем в форму все инпуты и див с контактами
    $formInputsModal.append($inputModalSurname, $inputModalName, $inputModalMiddelname, btnAddContact.$divContainerAddContact, $errorBlock,
        $btnSave, $btnСancel, $btnDeleteChange)

    close({ $btnСancel, $btnDeleteChange })
    // btnAddContact.$divContacts.append(divdropdownlistAdd)

    //При нажатии на кнопку "X" закрывается  модальное окно 
    $btnCloseWidow.addEventListener('click', function (event) {
        event.preventDefault()
        $divModalWindowContainer.remove()//удаляем модальное окно
    })

    // //Отправка формы и валидация
    $formInputsModal.addEventListener('submit', async function createSubmit(event) {
        event.preventDefault()

           // Валидация контактов
    const validatedContact = validationContacts($formInputsModal);
    if (!validatedContact) {
        return; // Если валидация не прошла, выходим из функции.
    }
        //  debugger;
        // // Проверка данных ФИО
        // const validatedClient = validateClientForm();
        // if (!validatedClient) {
        //     console.log('проверка прошла ');
        //     return; // Если проверка не прошла, выходим из функции.

        // }
        // const formContacts = document.querySelector('.form__inputs__modal__add')
        // // console.log(formContacts)


        // // Проверка данных контакта .
        // const validatedContact = validationContacts(formContacts);
        // if (!validatedContact) {
        //     console.log('проверка прошла ');
        //     return; // Если проверка не прошла, выходим из функции.
        // }

        // // Сбор контактов из состояния формы.
        // const contacts = addContact();  //остается  без изменений и возвращает массив контактов.

        // // валидация контактов
        // if (contacts.length > 0) {
        //     for (const contact of contacts) {
        //         const isValid = validateClientForm(contact.type, contact.value);
        //         if (!isValid) {
        //             return; // выходим если любой контакт не валиден.
        //         }
        //     }
        // }



        //получаем значение из формы(собираем данные из формы)
        let clientObj = {
            name: $inputModalName.value.trim(),
            surname: $inputModalSurname.value.trim(),
            lastName: $inputModalMiddelname.value.trim(),
            contacts: addContact()//добавляется массив контактов 
        }
        console.log(clientObj);

        console.log(oneClient);
        //отправляем данные на сервер
        if (oneClient) {
            // Отправляем запрос к  серверу для изменения данных клиента
            await serverChangeClient(oneClient.id, clientObj);
            ClientList = await serverGetClient()//приходит массив
            console.log(ClientList);

        } else {
            //await приостанавливает выполнение кода до тех пор, пока промис, возвращаемый serverAddClient, не будет разрешен.Ждем пока сервер обработает запрос и вернет ответ.
            //Ответ(данные) от сервера сохраняется в переменной serverData
            let serverData = await serverAddClient(clientObj)

            // Проверка данных, возвращаемых сервером
            console.log('Добавлен клиент:', serverData);
            //добавляем объект полученный с сервера
            ClientList.push(serverData)
            console.log(ClientList);
        }
        $divModalWindowContainer.remove()//удаляем модальное окно
        render(ClientList)
    })
}


//При нажатии на кнопку "Добавить клиента" открывается модальное окно 
$buttonAddClient.addEventListener('click', function () {
    createWindow(

        //вызываем при открытии модал.окна open()
        function () {
            console.log('ззз')
        },

        //вызываем при закрытии модал.окна close()
        function () {
            console.log('закрыто')
        }
    )
})

//получаем дату в формате дд.мм.гг
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
    // console.log('список клиентов:', arrData); // Логируем входные данные

    // // Проверяем, является ли arrData массивом
    // if (!Array.isArray(arrData)) {
    //     console.error('arrData не является массивом:', arrData);
    //     return; // Прекращаем выполнение функции, если это не массив
    // }
    // Очищаем таблицу
    $tabelBody.innerHTML = ''
    let copyClientList = [...arrData]//массив с клиентами


    //проходимся по массиву 
    for (const oneClient of copyClientList) {
        oneClient.id = oneClient.id
        oneClient.fio = oneClient.surname + ' ' + oneClient.name + ' ' + oneClient.lastName
        oneClient.contacts = oneClient.contacts
        oneClient.createdAt = oneClient.createdAt//преобразуем строку  с помощью объекта Date в дату и время 
        oneClient.updatedAt = oneClient.updatedAt//преобразуем строку  с помощью объекта Date в дату и время 
    }
    // console.log(arrData);

    //Отрисовка 
    for (const oneClient of ClientList) {
        const $clientTr = createClient(oneClient)

        // Добавляем новую строку в тело таблицы
        $tabelBody.append($clientTr)
    }

    // const $clientTr = createClient(oneClient);
    // $tabelBody.append($clientTr);
}
// console.log(ClientList);
render(ClientList)

// $btnWindowDelete.addEventListener('click', async function (){
//     await serverDeleteClient(oneClient.id)
//     $clientTr.remove()
//     })

//функция создания строки  клиента(добавления клиента в таблицу)
function createClient(oneClient) {
    //шапка-отрисовка таблицы
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

    //установление текстового содержимого ячеек 
    $clientid.textContent = oneClient.id
    $clientfio.textContent = oneClient.fio
    $clientTimeCreate.textContent = formatDate(new Date(oneClient.createdAt))
    $clientlastChang.textContent = formatDate(new Date(oneClient.updatedAt))

    // console.log(oneClient);
    // Общее количество контактов
    const totalContacts = oneClient.contacts?.length;

    // console.log(oneClient);
    // console.log(totalContacts);
    // Проверка на наличие контактов
    if (oneClient.contacts && oneClient.contacts.length > 0) {
        // Отображение контактов (не более 4)
        oneClient.contacts.forEach((contact, index) => {
            if (index < 4) { // Отображаем только первые 4 контакта
                createContsctItemByType(contact.type, contact.value, $clientContacts);
            }
        });
    } else {
        // Если контактов нет, добавляем пустую ячейку
        $clientContacts.textContent = ''; // Пустая строка
    }
    // Проверка на количество скрытых контактов
    if (totalContacts > 4) {
        const hiddenContactsCount = totalContacts - 4; // Скрытые контакты
        const $hiddenContactsSpan = document.createElement('span');
        $hiddenContactsSpan.classList.add('hidden__contacts');
        $hiddenContactsSpan.textContent = `+${hiddenContactsCount}`;

        // Обработчик события для раскрытия скрытых контактов
        $hiddenContactsSpan.addEventListener('click', () => {
            // Отображаем скрытые контакты
            oneClient.contacts.forEach((contact, index) => {
                if (index >= 4) { // Показываем скрытые контакты
                    createContsctItemByType(contact.type, contact.value, $clientContacts);
                }
            });
            $hiddenContactsSpan.remove(); // Убираем счетчик после отображения скрытых контактов
        });

        $clientContacts.appendChild($hiddenContactsSpan); // Добавляем кнопку в ячейку контактов
    }

    //преобразуем массив контактов в строку
    // $clientContacts.textContent = oneClient.contacts.map(contact => `${contact.type}: ${contact.value}`).join('\n');


    const $btnChange = document.createElement('button')
    $btnChange.textContent = 'Изменить'
    $btnChange.classList.add('clients__edit')

    //При нажатии на кнопку "Изменить" открывается модальное окно 
    $btnChange.addEventListener('click', function () {
        createWindow(
            //вызываем при открытии модал.окна open()
            function ({ $divWrapperСhange, $titleModalAddClient, $btnCross, $divWindowDelete, $spanTitelChange, btnAddContact, createDropdownlist }) {

                $spanTitelChange.textContent = 'ID:' + '' + oneClient.id


                if (oneClient && oneClient.contacts) {
                    for (let contact of oneClient.contacts) {
                        if (contact) {
                            const dropdown = createDropdownlist(contact.type, contact.value);
                            //вызываем функцию добавления контакта
                            btnAddContact.$divContacts.append(dropdown.$divdropdownlist);

                        }
                    }
                }

                $divWrapperСhange.classList.add('open')
                $titleModalAddClient.classList.add('close')
                // $btnCross.classList.add('open')
                $spanTitelChange.classList.add('open')
                $divWindowDelete.classList.remove('open')
            },
            //вызываем при закрытии модал окна 
            function ({ $btnСancel, $btnDeleteChange }) {
                $btnСancel.classList.add('close')
                $btnDeleteChange.classList.add('open')
            },
            // Передаем oneClient как третий параметр.Передаем текущего клиента в модальное окно
            oneClient
        )

    })

    // //При нажатии на кнопку "Удалить" открывается модальное окно 
    let $btnDelete = document.createElement('button')
    $btnDelete.textContent = 'Удалить'
    $btnDelete.classList.add('clients__delete')

    $btnDelete.addEventListener('click', function () {
        ////удаление строки
        // $btnWindowDelete.addEventListener('click', async function () {
        //     await serverDeleteClient(oneClient.id);
        //     $clientTr.remove();
        // });
        createWindow(
            //вызываем при открытии модал.окна open()
            function ({ $divModalBox, $divWrapperСhange, $titleModalAddClient, $divWindowDelete, $btnWindowDelete }) {
                $divWindowDelete.classList.add('open')
                $divWrapperСhange.classList.remove('open')
                $divModalBox.classList.add('close')
                $titleModalAddClient.classList.add('close')

                //удаление клиента
                $btnWindowDelete.addEventListener('click', async function () {
                    await serverDeleteClient(oneClient.id);//удалила с сервера 

                    // Полностью обновляем ClientList новыми данными на сервере
                    ClientList = await serverGetClient()

                    $clientTr.remove();//удаление строки
                });

            },

            //вызываем при закрытии модал окна 
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
    //получаем доступ к таблице и заголовкам
    const tabel = document.querySelector('table');
    const headers = tabel.querySelectorAll('th');//получаем все заголовки
    // Метод querySelectorAll('th') выбирает все элементы <th> (заголовки таблицы) на странице и возвращает их в виде коллекции.
    //Результат вызова метода это NodeList (набор узлов-элементов th)
    const tbody = tabel.querySelector('tbody');
    const headersArray = Array.from(headers); // Преобразуем NodeList в массив

    //Направления сортировки для каждого заголовка таблицы.
    //это массив,который записан в переменную directions
    // для хранения текущего направления сортировки для каждого заголовка таблицы
    const directions = headersArray.map(() => '')
    // console.log(directions);

    //форматирование типа и контента
    function transformText(type, content) {
        switch (type) {
            case 'id':
                return parseFloat(content);//из строчки с буквами возвращаем только цифры
            case 'create':
            case 'update':
                //content это дата создания и обновления
                return content.split('.').reverse().join('-'); //обработка и сортировка контента-даты
            //text - это фио клиентов 
            case 'text':
            default:
                return content;
        }
    }

    //сортировка строк от выбраного заголовка
    function sortColumn(index) {
        //получаем тип хедера по индексу 
        const type = headers[index].getAttribute('data-type');
        // console.log(type);
        const rows = tbody.querySelectorAll('tr')//получаем саму строку

        //Определяем направление сортировки direction и multiply

        //Проверка текущего направления сортировки
        const direction = directions[index] || 'sortUp';//если не было предыдущей сортировки, то по умолчанию используется сортировка по возрастанию.

        //определения порядка, в котором строки будут упорядочены
        //direction === 'sortUp' проверка. Равно ли тек.состояние sortUp 
        //если нет,то multiply равно 1, это означает, что строки будут отсортированы по возрастанию
        //если multiply равно -1, строки будут отсортированы по убыванию
        const multiply = direction === 'sortUp' ? 1 : -1;


        //Сортировка строк
        const newRows = Array.from(rows); //нов массив с строками

        //Для каждой пары строк получаем значение и форматируем его
        newRows.sort((row1, row2) => {
            //получаем контент
            const cellA = row1.querySelectorAll('td')[index].textContent
            const cellB = row2.querySelectorAll('td')[index].textContent

            //форматируем контент
            const a = transformText(type, cellA)
            const b = transformText(type, cellB)
            // console.log(a,b);
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

        //удаляем старые строки,чтобы добавить отсортированные строки
        Array.from(rows).forEach(row => {
            tbody.removeChild(row);
        });

        //обновление направления строки
        directions[index] = direction === 'sortUp' ? 'sortDown' : 'sortUp';

        //Добавление отсортированных строк обратно в таблицу:
        newRows.forEach(newRow => {
            tbody.appendChild(newRow);
        });
    }
    //Добавление обработчиков событий к заголовкам
    //перебераем все заголовки
    headersArray.forEach((header, index) => {
        //добавляем клик к каждому заголовку 
        header.addEventListener('click', () => {
            sortColumn(index);
        });
    });

}
sortTabel()

// console.log(ClientList);

function searchClients() {
    const findList = document.querySelector('.find-list');
    const input = document.querySelector('.header__input');
    let timeoutId; //хранение идентификатора таймаута

    // Функция для обновления списка автодополнения
    function updateFindList(clients) {
        findList.innerHTML = ''; //удаляем  из списка  ранее введеные значения
        //перебираем массив с объектами клиентов, соответствующих текущему запросу
        clients.forEach(client => {
            const findItem = document.createElement('li');
            // const findLink = document.createElement('a');

            findItem.classList.add('find-list__item');
            // findLink.classList.add('find-list__link');
            //создаем элементы списка
            findItem.textContent = `${client.name} ${client.surname} ${client.lastName}`;
            // findLink.href = '#';

            // findItem.append(findLink);
            findList.append(findItem);
        });
    };

    //ввод поля
    input.addEventListener('input', async () => {
        const value = input.value.trim();//забирается тек.значение поля

        // Очищаем предыдущий таймаут
        clearTimeout(timeoutId);

        // Устанавливаем новый таймаут
        timeoutId = setTimeout(async () => {
            if (value !== '') {
                //запрос на данные с сервера, передавая введенное значение для поиска 
                ClientList = await findClients(value);
                updateFindList(ClientList); // Обновляем список с полученными данными 
                // перерисовываем  таблицу,отображаем  только тех клиентов, которые соответствуют запросу.
                // render(ClientList) 
            } else {
                // если поле ввода пустое, очищаем список и восстанавливаем всех клиентов
                findList.innerHTML = '';
                // render(ClientList); // Восстанавливаем всех клиентов
                ClientList = await serverGetClient(); // Получаем всех клиентов
            }
            // Рендерим клиентов
            render(ClientList);
        }, 300);
    });
}
// //перерисовка таблицы 
// async function redrawTabel(clients) {
//     const tbodyFind = document.querySelector('.clients__tbody');
//     tbodyFind.innerHTML = ''; // Очищаем предыдущие записи 

//     // перебираем массив клиентов и передаем каждого клиента в функцию 
//     clients.forEach(client => {
//         // Отрисовываем клиентов полученных на основе поиска
//         tbodyFind.append(createClient(client));
//     });
// }

// //Валидация формы ФИО
function validateClientForm() {
    //получаем элименты 
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
            //когда будет ошибка бордер красный
            input.classList.add('error')
            for (const item of validateArray) {
                //у каждой ошибки будет чиститься поле
                item.textContent = '';
            }
        });

        //устанавливаем обработчика на инпут oncut, oncopy, onpaste
        input.oncut = input.oncopy = input.onpaste = () => {
            input.classList.add('noerror')
            for (const item of validateArray) {
                item.textContent = '';
            }
        };

        // если значение поля ввода изменилось и пользователь закончил ввод
        input.onchange = () => {
            input.classList.add('noerror')
            //проверка на заполнение инпутов
            if (userSurname.value && userName.value && userLastName.value) {
                for (const item of validateArray) {
                    //убираем текст об ошибках 
                    item.textContent = '';
                }
            }
        }
    }

    //вызываем для каждого инпута проверку
    onInputValue(userName);
    onInputValue(userSurname);
    onInputValue(userLastName);

    //проверка вводимого фио
    function checkRequiredName(input, message, name) {
        //если ничего не было введено и форму хотели отправить
        if (!input.value) {
            input.classList.add('error')
            message.textContent = `Введите ${name} клиента!`;
            //проверка не проходит фолс 
            return false;
        } else {
            message.textContent = '';
        }
        return true;
    }

    //проверка на то что ввел пользователь
    function checkRegexp(input, regexp) {
        //соответствует ли строка заданному регулярному выражению regexp
        if (regexp.test(input.value)) {
            input.classList.add('error')
            unacceptableLetter.textContent = 'Недопустимые символы!';
            return false;
        }

        return true;
    }

    //вызываем функции для каждого инпута
    //первые три строки проверяют  было ли введено значение в обязательные поля
    //checkRequiredName принимает три элемена ввода,которые надо проверить
    //второй аргумент это где сообщение об ошибке будет храниться
    //формулируем ошибку
    //а в после сообщения об ошибки,функция прекращает свои действия
    if (!checkRequiredName(userSurname, writeSurname, 'Фамилию')) { return false };
    if (!checkRequiredName(userName, writeName, 'Имя')) { return false };
    if (!checkRequiredName(userLastName, writeLastName, 'Отчество')) { return false };
    //проверка на соответствие регулярному выражению
    if (!checkRegexp(userName, regexp)) { return false };
    if (!checkRegexp(userSurname, regexp)) { return false };
    if (!checkRegexp(userLastName, regexp)) { return false };

    // Создаем объект клиента для возврата
    const validatedClient = {
        surname: userSurname.value.trim(),
        name: userName.value.trim(),
        lastName: userLastName.value.trim()
    };

    // Возвращаем объект клиента
    return validatedClient;
}



//Валидация контактов.

//удалит все, кроме цифр, из строки, введенной пользователем, и вернет строку, содержащую только цифры.
function getInputNumbersValue(input) {
    return input.value.replace(/\D/g, '');
}

function showError(input, message) {
    const errorMessage = document.createElement('span');
    errorMessage.classList.add('error')
    errorMessage.textContent = message;
    input.parentElement.appendChild(errorMessage); // Добавляем сообщение об ошибке после поля ввода
}

function hideError(event) {
    const input = event.target; // Получаем элемент, вызвавший событие
    const message = input.parentElement.querySelector('.error'); // Ищем сообщение об ошибке в родительском элементе

    if (message) {
        message.remove(); // Удаляем элемент сообщения об ошибке
    }

    input.classList.remove('error'); // Убираем класс ошибки из поля ввода
}


//валадация контактов
function validationContacts(form) {
    //  // Проверяем, что form - это элемент формы
    //  if (!(form instanceof HTMLElement)) {
    //     console.error('Переданный аргумент не является элементом формы');
    //     return false; // или обработайте ошибку по-другому
    // }

    const userName = document.getElementById('floatingName');
    const userSurname = document.getElementById('floatingSurname');
    const userLastName = document.getElementById('floatingLastName');

// Проверка на пустые поля
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


    //переменная для статуса валидации
    let isValidate = true;

    // Получаем элементы селектора и инпута
    const select = document.querySelector('.selectCotacts');
    //получение полей ввода
    const inputFields = form.querySelectorAll('.dropdownlist__input');
    // console.log(select);
    // если есть селект,то 
    if (select) {
        select.addEventListener('change', () => {
            // Получаем выбранное значение
            const selectedValue = select.value;

            input.dataset.type = selectedValue; // 
        });
    }

    // console.log(clientObj);
    //проходим по каждому полю
    for (const input of inputFields) {

        // Проверка на пустое поле
        if (!input.value.trim()) {
            showError(input, "Ошибка: Поле не может быть пустым!");
            input.addEventListener("input", hideError);
            isValidate = false;
            continue; // Пропускаем это поле и переходим к следующему
        }

        //проверка типа ввода
        //data-type текущего поля ввода выполняются разные проверки.
        switch (input.dataset.type) {

            case "phone":
                const regExpPhone = /^\d{11,12}$/g;
                //если проверка не проходит,то 
                if (!regExpPhone.test(getInputNumbersValue(input))) {
                    showError(
                        input,
                        "Ошибка: Номер телофона должен содержать от 11 до 12 цифр!"
                    );
                    //слухач. вызываем функцию hideError при каждом изменении содержимого поля ввода.
                    //скрываем сообщение об ошибке
                    input.addEventListener("input", hideError);
                    //фолс-проверка не прошла
                    isValidate = false;
                } else {
                    //валидация прошла успешно,
                    //  создается новый объект с данными о контакте и добавляется в начало массива contacts объекта clientObj
                    clientObj.contacts.unshift({
                        type: String(input.dataset.type),//тип контакта извлекается из атрибута
                        value: String(input.value.replace(/[\s\(\)-]/g, "")),//оставляем только цифры
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
            //         // console.log(clientObj);
            //         // debugger;
            //         clientObj.contacts.unshift({
            //             type: String(input.dataset.type),
            //             value: String(input.value),
            //         });
        }
        //если валидация не прошла возвращаем false
        if (!isValidate) return false;
    }
    // debugger;
    return {
        isValidate,
    };
}
