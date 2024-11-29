"use strict"

const useful_links = document.querySelector('.page_useful_blocks'),
      menu = document.querySelector('.header_top_menu'),
      token = localStorage.getItem('token'),
      modal_close_btn = document.querySelector('.modal_content_close'),
      modal_window = document.querySelector('.modal'),
      modal_open_btns = document.querySelectorAll('.modal_open_btn'),
      modal_form_request = document.forms["sendRequestForm"],
      modal_send_btn = document.querySelector('.modal_content_input_submit');

useful_links.addEventListener('click', (event) => {
if(event.target == document.querySelector('[data-uslugirf]')) {
    window.open('https://www.gosuslugi.ru/');
}
else if(event.target == document.querySelector('[data-tatenergo]')) {
    window.open('https://tatenergosbyt.ru/');
}
else if(event.target == document.querySelector('[data-uslugirt]')) {
    window.open('https://uslugi.tatarstan.ru/');
}
});

async function LogStatus() {
    if(token){
        const user = await getUser(token);
        if(user) {
            const login_redirect = document.createElement('a');
            // login_redirect.setAttribute('href','/profile');
            login_redirect.classList.add('header_top_menu_login');
            login_redirect.innerText = user.roles[0];
            menu.append(login_redirect);

            // const logout = document.createElement('button');
            // logout.style.cssText = 'position: absolute;top: 10px;right: 120px;background:none;border:none;   font-weight: 300;color:white;';
            // logout.innerText = 'Выход';
            login_redirect.addEventListener('click', () => {
                localStorage.removeItem('token');
                location.reload();
            });
            modal_open_btns.forEach(btn => {
                btn.removeAttribute('disabled');
            });
        }
        else {
            const login_redirect = document.createElement('a');
            login_redirect.setAttribute('href','/login');
            login_redirect.classList.add('header_top_menu_login');
            login_redirect.innerText = 'Вход';
            menu.append(login_redirect);
        }
    }
    else {
        const login_redirect = document.createElement('a');
        login_redirect.setAttribute('href','/login');
        login_redirect.classList.add('header_top_menu_login');
        login_redirect.innerText = 'Вход';
        menu.append(login_redirect);
    }

}
LogStatus();

modal_close_btn.addEventListener('click', (event) => {
    CloseModal(modal_window);
});

modal_open_btns.forEach(item => {
    item.addEventListener('click', () => {
        ShowModal(modal_window);
    });
});
modal_send_btn.addEventListener('click', async (event) => {
    event.preventDefault();
    if(!modal_form_request.checkValidity()) {return;}
    const request = {
        typework: {
            name: modal_form_request.elements['typeproblem'].value,
            work: modal_form_request.elements['select_problem'].value
        },
        descr: modal_form_request.elements['problem_descr'].value,
    }
    const response = await PostReq(request);
    CloseModal(modal_window);
    modal_form_request.reset();
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
        console.log(works);
        works.forEach(work => {
            const option = document.createElement('option');
            option.innerText = work;
            modal_form_request.elements['select_problem'].append(option);
        });
    });
}

async function PostReq(request) {
    const response = await fetch('/post/request', {
        method: "POST",
        headers: { 
            "Accept": "application/json", "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify(request)
    });
    return response;
}

async function getUser(token) {
    const response = await fetch('/get/user', {
        method: "GET",
        headers: { 
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
    if(response.ok) {
        const user = await response.json();
        return user;
    }
    return null;
}

async function getTypesWork() {
    const response = await fetch('/get/works', {
        method: "GET",
        headers: { 
            "Accept" : "application/json",
        }
    });
    if(response.ok) {
        const works = await response.json();
        return works;
    }
    return null;
}