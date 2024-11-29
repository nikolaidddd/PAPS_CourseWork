"use strict"

const requests_table = document.querySelector('.main_requests_table_content'),
      token = localStorage.getItem('token');

// Получение всех заявок
async function GetRequests() {
    const response = await fetch("/dispatcher/get/requests", {
        method: "GET",
        headers: { 
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
    if(response.ok) {
        const requests = await response.json();
        console.log('Получены все заявки');
        requests.forEach(item => {
            CreateRequest(item);
        });
    }
    else {
        if(response.status == 403) {
            console.log('Не уполномочен');
        }
        else if(response.status == 401){
            console.log('Не авторизован');
        }
        else {
            console.log('Ошибка при получении запроса');
        }
        console.log(response.status);
    } 
}
//Изменение заявки
async function EditRequest(requestId, requestExecutor, requestStatus) {
    const response = await fetch('/dispatcher/put/request/' + requestId,{
        method: "PUT",
        headers: {
            "Accept" : "application/json", "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify({
            executor: requestExecutor,
            status: requestStatus
        })
    });
}

//Удаление заявки
async function DeleteRequest(id) {
    const response = await fetch('/dispatcher/delete/request/' + id, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
}

async function GetExecutors(type_work) {
    const response = await fetch("/dispatcher/get/executors/" + type_work, {
        method: "GET",
        header: { 
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });

    if(response.ok) {
        const executors = await response.json();
        console.log('Получены все исполнители');
        return executors;
    }
    else {
        console.log('Ошибка при получении исполнителей');
    } 
}

//Запрос на добавление новой заявки
async function PostRequest(request) {
    const response = await fetch('/dispatcher/post/request', {
        method: "POST",
        headers: { 
            "Accept": "application/json", "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify(request)
    });
    if (response.ok) {
        const result = await response.json();
        console.log(result);
        return result;
    }
    else {return null;}
}

//Создание заявки на сайте
function CreateRequest(request) {
    //Создаем строку для новой заявки
    const row = document.createElement('div');
    row.classList.add('main_requests_table_content_row');

    //Обозначаем строку id заявки
    row.setAttribute('data-rowid', request._id);

    //Создаем 6 столбцов
    const items = [];
    for(let i = 0; i < 6; i++){
        const item = document.createElement('div');
        item.classList.add('main_requests_table_content_row_item');
        items.push(item);
    }
    items[0].setAttribute('style', 'width: 200px;min-height:100px;');
    items[1].setAttribute('style', 'width: 240px;min-height:100px;');
    items[2].setAttribute('style', 'width: 110px;min-height:100px;');
    items[3].setAttribute('style', 'width: 160px;min-height:100px;');
    items[4].setAttribute('style', 'width: 140px;min-height:100px;');
    items[5].setAttribute('style', 'width: 250px;min-height:100px;');
        items[0].innerHTML =`<span style="font-size:12px;">№${request._id}</span>` + '<br>' + request.date + '<br>' ;
    if(request.dispatcher) {
        items[0].innerHTML += request.dispatcher.surname + ' ' +request.dispatcher.name;
    }
    //Адрес и заявитель
    items[1].innerHTML = '<span style="font-weight: 700">Адрес: </span>' +request.resident.address.city +', ' + request.resident.address.street + ', ' + request.resident.address.numHome + ', ' + request.resident.numApart + '<br><br>' + '<span style="font-weight: 700">Заявитель: </span>' + request.resident.surname + ' ' + request.resident.name;

    //Вид заявки
    items[2].append(request.type);
    if(!request.executor) {
        items[3].append('Не назначен');
    }
    else {
        items[3].append(request.executor.surname +' ' + request.executor.name);
    }
    items[4].append(request.status);
    items[5].innerHTML = `<b>Тип проблемы:</b> ${request.typework.name} <br><b>Проблема:</b> ${request.typework.work} <br><b>Описание проблемы:</b> ${request.descr}`;

    items.forEach(item => {
        row.append(item);
    });
    const btn_block = document.createElement('div'),
          btn_block_edit = document.createElement('div'),
          btn_block_remove = document.createElement('div'),
          btn_block_edit_btn = document.createElement('button'),
          btn_block_remove_btn = document.createElement('button');
    btn_block.classList.add('main_requests_table_content_row_item');
    btn_block.setAttribute('style', 'width: 49px;height: 100px;');
    btn_block_edit.classList.add('main_requests_table_content_row_item_edit');
    btn_block_remove.classList.add('main_requests_table_content_row_item_remove');

    btn_block_edit_btn.classList.add('main_requests_table_content_row_item_edit_btn');
    btn_block_edit_btn.innerHTML = `<img src="images/edit.png" alt="">`;
    btn_block_edit_btn.setAttribute('data-rowid', request._id);
    btn_block_remove_btn.classList.add('main_requests_table_content_row_item_remove_btn');
    btn_block_remove_btn.innerHTML = `<img src="images/remove.png" alt="">`;
    
    if(request.status != 'Новая') {
        btn_block_edit_btn.setAttribute('disabled','');
    }
    if(request.status != 'Отмена' && request.status != 'Новая') {
        btn_block_remove_btn.setAttribute('disabled','');
    }

    if(request.status == "Новая") {
    //Кнопка изменения заявки доступна только у новой заявки
        row.style.cssText = "background-color: rgb(255, 255, 255);";
        btn_block_edit_btn.addEventListener('click', async () => {
        const executors = await GetExecutors(request.typework.name);
        const combobox = document.createElement('select');
        combobox.classList.add('main_requests_table_content_row_item_combobox');
        executors.forEach(executor => {
            const option = document.createElement('option');
            option.innerText = executor.name;
            combobox.append(option);
        });
        items[3].innerHTML = ``;
        items[3].append(combobox);

        const confirm_btn = document.createElement('button');
        confirm_btn.classList.add('main_requests_table_content_row_item_confirm_btn');
        confirm_btn.innerHTML = `<img src="images/confirm.png" alt="">`;
        confirm_btn.addEventListener('click', () => {
            if(!(combobox.value == 'Не назначен') && confirm("Изменить исполнителя у заявки?"))
            {
                combobox.replaceWith(combobox.value);
                const req = EditRequest(request._id, combobox.value, 'Передана');
                confirm_btn.replaceWith(btn_block_edit_btn);
                row.style.cssText = "background-color: rgb(255, 248, 117);";
                items[4].innerHTML = `Передана`;
            }
            else {
                confirm_btn.replaceWith(btn_block_edit_btn);
                items[3].innerHTML = `Не назначен`;
            }

        });
        btn_block_edit_btn.replaceWith(confirm_btn);
    });

    //Кнопка отмены заявки так же доступна лишь для новой заявки
    btn_block_remove_btn.addEventListener('click', () => {
        // const result = prompt("Причина отмены заявки: ");
        const req = EditRequest(request._id, request.executor, 'Отмена');
        row.style.cssText = "background-color: rgb(255, 117, 117);";
        items[4].innerHTML = `Отмена`;
        // DeleteRequest(request._id);
    });
    }
    if(request.status == "Передана") 
    {
        row.style.cssText = "background-color: rgb(255, 248, 117);";
        btn_block_edit_btn.setAttribute('disabled','');
    }
    else if(request.status == "В работе") {
        row.style.cssText = "background-color: rgb(255, 207, 117);";
    }
    else if(request.status == "Выполена") {
        row.style.cssText = "background-color: rgb(135, 255, 117);";
    }
    else if(request.status == "Отмена") 
    {
        row.style.cssText = "background-color: rgb(255, 117, 117);";
        btn_block_edit_btn.setAttribute('disabled','');

        //Кнопка отмены заявки будет удалять её, если она уже отменена
        btn_block_remove_btn.addEventListener('click', () => {
            row.remove();
            DeleteRequest(request._id);
        });
    }



    btn_block_edit.append(btn_block_edit_btn);
    btn_block_remove.append(btn_block_remove_btn);

    btn_block.append(btn_block_edit);
    btn_block.append(btn_block_remove);
    row.append(btn_block);

    requests_table.append(row);
}

GetRequests();


//Модальное окно создания заявки
const modal_close_btn = document.querySelector('.modal_content_close'),
      modal_window = document.querySelector('.modal'),
      modal_open_btns = document.querySelectorAll('.modal_open_btn'),
      modal_form_request = document.forms["sendRequestForm"],
      modal_send_btn = document.querySelector('.modal_content_input_submit');
let currResident;

async function getTypesWork() {
    const response = await fetch('/get/works', {
        method: "GET",
        headers: { 
            "Accept" : "application/json"
        }
    });
    if(response.ok) {
        const works = await response.json();
        return works;
    }
    return null;
}

async function getResidents() {
    const response = await fetch('/dispatcher/get/residents', {
        method: "GET",
        headers: {
            "Accept" : "application/json"
        }
    });
    if(response.ok) {
        const residents = await response.json();
        return residents;
    }
    return null;
}
modal_close_btn.addEventListener('click', (event) => {
    CloseModal(modal_window);
});

modal_open_btns.forEach(item => {
    item.addEventListener('click', () => {
        ShowModal(modal_window);
    });
});
modal_send_btn.addEventListener('click', async (event) => {
    // event.preventDefauwlt();
    if(!modal_form_request.checkValidity()) {return;}
    const request = {
        resident: currResident,
        typework: {
            name: modal_form_request.elements['typeproblem'].value,
            work: modal_form_request.elements['select_problem'].value
        },
        descr: modal_form_request.elements['problem_descr'].value,
    }
    const response = await PostRequest(request);
    CloseModal(modal_window);
    modal_form_request.reset();
    GetRequests();
});

function CloseModal(window) {
    window.classList.add('hide');
    window.classList.remove('show');
    document.body.style.cssText = "overflow:auto;";
}


async function ShowModal(window) {
    window.classList.add('show');
    window.classList.remove('hide');
    document.body.style.cssText = "overflow:hidden;";

    const residents = await getResidents();
    let addresses = [];
    residents.forEach(resident => {
        if(!addresses.includes(resident.address)) {
            resident.address.numApart = resident.numApart;
            addresses.push(resident.address);
        }
    });
    addresses.forEach(address => {
        const option = document.createElement('option');
        option.innerText = address.city;
        modal_form_request.elements['city'].append(option);
        modal_form_request.elements['city'].value = '';
    });
    modal_form_request.elements['city'].addEventListener('change', () => {
        addresses.forEach(address => {
            if(address.city == modal_form_request.elements['city'].value) {
                const option = document.createElement('option');
                option.innerText = address.street;
                modal_form_request.elements['street'].append(option);
                modal_form_request.elements['street'].value = '';
            }
        });
    });
    modal_form_request.elements['street'].addEventListener('change', () => {
        addresses.forEach(address => {
            if(address.street == modal_form_request.elements['street'].value) {
                const option = document.createElement('option');
                option.innerText = address.numHome;
                modal_form_request.elements['numHome'].append(option);
                modal_form_request.elements['numHome'].value = '';
            }
        });
    });
    modal_form_request.elements['numHome'].addEventListener('change', () => {
        addresses.forEach(address => {
            if(address.numHome == modal_form_request.elements['numHome'].value) {
                const option = document.createElement('option');
                option.innerText = address.numApart;
                modal_form_request.elements['numApart'].append(option);
                modal_form_request.elements['numApart'].value = '';
            }
        });
    });
    modal_form_request.elements['numApart'].addEventListener('change', () => {
        addresses.forEach(address => {
            if(address.numApart == modal_form_request.elements['numApart'].value) {
                residents.forEach(resident=>{
                    if(
                        resident.address.city == modal_form_request.elements['city'].value &&
                        resident.address.street == modal_form_request.elements['street'].value &&
                        resident.address.numHome == modal_form_request.elements['numHome'].value &&
                        resident.numApart == modal_form_request.elements['numApart'].value
                    )
                    {
                        modal_form_request.elements['resident'].setAttribute('value', `${resident.surname} ${resident.name}`);
                        currResident = resident;
                        console.log(currResident);
                    }
                });
            }
        });
    });
    const typeworks = await getTypesWork();
    typeworks.forEach(typework => {
        const option = document.createElement('option');
        option.innerText = typework.name;
        modal_form_request.elements['typeproblem'].append(option);
    });
    typeworks[0].works.forEach(work => {
        const option = document.createElement('option');
        option.innerText = work;
        modal_form_request.elements['select_problem'].append(option);
    });
    modal_form_request.elements['typeproblem'].addEventListener('change', () => {
        modal_form_request.elements['select_problem'].innerHTML = '';
        const works = typeworks.find(work => work.name === modal_form_request.elements['typeproblem'].value).works;
        works.forEach(work => {
            const option = document.createElement('option');
            option.innerText = work;
            modal_form_request.elements['select_problem'].append(option);
        });
    });
}