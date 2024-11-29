const modal_close_btn = document.querySelector('.modal_content_close'),
      modal_window = document.querySelector('.modal'),
      modal_open_btn = document.querySelector('.main_create_user_btn'),
      modal_form_request = document.forms["createNewUser"],
      modal_send_btn = document.querySelector('.modal_content_input_submit');

modal_close_btn.addEventListener('click', (event) => {
    CloseModal(modal_window);
});

//Кнопка создания заявки для открытия формы
modal_open_btn.addEventListener('click', () => {
    ShowModal(modal_window);
});

//Кнопка создания заявки для отправки на сервер
modal_send_btn.addEventListener('click', async () => {
    if(!modal_form_request.checkValidity()) {return;}
    const user = {
        name: modal_form_request.elements['name'].value,
        address: {
            city: modal_form_request.elements['city'].value,
            street: modal_form_request.elements['street'].value,
            numHome: modal_form_request.elements['numHome'].value,
            numApart: modal_form_request.elements['numApart'].value
        },
        tel: modal_form_request.elements['tel'].value,
        email: modal_form_request.elements['email'].value,
        username: modal_form_request.elements['login'].value,
        password: modal_form_request.elements['password'].value,
        role: modal_form_request['role'].value
    }
    const response = await PostUser(user);
    // CreateRequest(response);
    // modal_form_request.reset();
    // CloseModal(modal_window);
});

//Запрос на добавление новой заявки
async function PostUser(user) {
    const response = await fetch('/auth/registration', {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });
    if (response.ok) {
        console.log(response.json());
        return response.json();
    }
    else {null;}
}

function CloseModal(window) {
    window.classList.add('hide');
    window.classList.remove('show');
    document.body.style.cssText = "overflow:auto;";
}
function ShowModal(window) {
    window.classList.add('show');
    window.classList.remove('hide');
    document.body.style.cssText = "overflow:hidden;";
}

const users_table = document.querySelector('.main_users_table_content'),
      token = localStorage.getItem('token'),
      tabs = document.querySelectorAll('.main_tabs_item');

tabs.forEach(tab => {
    tab.addEventListener('click', (event) => {
        users_table.innerHTML = '';
        tabs.forEach(item => {
            item.classList.remove('active');
        });
        event.target.classList.add('active');
        if(event.target.innerHTML == 'Пользователи') {
            GetUsers();
        }
        else if(event.target.innerHTML == 'Специалисты') {
            GetSpecialists();
        }
        else if(event.target.innerHTML == 'Пользователи') {

        }
    });
});


async function GetUsers() {
    const response = await fetch("/dispatcher/get/users", {
        method: "GET",
        headers: { 
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
    if(response.ok) {
        const users = await response.json();
        console.log('Получены все пользователи');
        users.forEach(item => {
            CreateUser(item);
        });
    }
    else {
        if(response.status == 403) {
            console.log('Не уполномочен');
            window.location.replace("/");
        }
        else if(response.status == 401){
            console.log('Не авторизован');
            window.location.replace("/login");
        }
        else {
            console.log('Ошибка при получении запроса');
        }
    } 
}
async function GetSpecialists() {
    const response = await fetch("/dispatcher/get/specialists", {
        method: "GET",
        headers: { 
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
    if(response.ok) {
        const specialists = await response.json();
        console.log('Получены все пользователи');
        console.log(specialists);
        specialists.forEach(item => {
            CreateSpec(item);
        });
    }
    else {
        if(response.status == 403) {
            console.log('Не уполномочен');
            window.location.replace("/");
        }
        else if(response.status == 401){
            console.log('Не авторизован');
            window.location.replace("/login");
        }
        else {
            console.log('Ошибка при получении запроса');
        }
    } 
}

function CreateSpec(spec) {
    const row = document.createElement('div');
    row.classList.add('main_users_table_content_row');

    const items = [];
    for(let i = 0; i < 8; i++) {
        const item = document.createElement('div');
        item.classList.add('main_users_table_content_row_item');
        items.push(item);
    }
    items[0].setAttribute('style', 'width:200px;');
    items[1].setAttribute('style', 'width:160px;;');
    items[2].setAttribute('style', 'width:160px;;');
    items[3].setAttribute('style', 'width:100px;;');
    items[4].setAttribute('style', 'width:140px;;');
    items[5].setAttribute('style', 'width:140px;;');
    items[6].setAttribute('style', 'width:100px;;');
    items[0].innerHTML =`<span style="font-size:12px;">№${spec._id}</span>`;
    items[1].innerHTML = `${spec.surname} ${spec.name}`;
    items[2].innerHTML = '';
    items[3].innerHTML = `${spec.tel}`;
    items[4].innerHTML = `${spec.username}`;
    items[5].innerHTML = `${spec.password}`;
    items[6].innerHTML = `${spec.roles[0]}`;

    items.forEach(item => {
        row.append(item);
    });
    users_table.append(row);
}
function CreateUser(user) {
    const row = document.createElement('div');
    row.classList.add('main_users_table_content_row');

    const items = [];
    for(let i = 0; i < 8; i++) {
        const item = document.createElement('div');
        item.classList.add('main_users_table_content_row_item');
        items.push(item);
    }
    items[0].setAttribute('style', 'width:200px;');
    items[1].setAttribute('style', 'width:160px;;');
    items[2].setAttribute('style', 'width:160px;;');
    items[3].setAttribute('style', 'width:100px;;');
    items[4].setAttribute('style', 'width:140px;;');
    items[5].setAttribute('style', 'width:140px;;');
    items[6].setAttribute('style', 'width:100px;;');
    items[0].innerHTML =`<span style="font-size:12px;">№${user._id}</span>`;
    items[1].innerHTML = `${user.resident.surname} ${user.resident.name}`;
    items[2].innerHTML = user.resident.address.city +', ' + user.resident.address.street + ', ' + user.resident.address.numHome + ', ' + user.resident.numApart;
    items[3].innerHTML = `${user.resident.tel}`;
    items[4].innerHTML = `${user.username}`;
    items[5].innerHTML = `${user.password}`;
    items[6].innerHTML = `${user.roles[0]}`;

    items.forEach(item => {
        row.append(item);
    });
    users_table.append(row);
}
GetUsers();