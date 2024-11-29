"use strict"

const form = document.forms['loginForm'],
      login_btn = document.querySelector('.form_login_btn');
      
const label = document.createElement('label');
const block = document.querySelector('.main_auth_block');
form.append(label);
async function auth(loginUser,passwordUser) {

    const response = form['checkbox'].checked ? 
    await fetch('/auth/login/employee', {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            username: loginUser,
            password: passwordUser
        })
    }) :
    await fetch('/auth/login/user', {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            username: loginUser,
            password: passwordUser
        })
    })
    if (response.ok) {
        const token = await response.json();
        console.log(token);
        localStorage.setItem('token', `${token}`);
        location = '/';
    }
    else {
        console.log('ошибка');
        label.innerHTML = 'Неверный логин или пароль';
        label.style.cssText = 'color: red;';
    }
}

login_btn.addEventListener('click', (event) => {
    event.preventDefault();
    auth(form['login'].value, form['password'].value);
    console.log(form['checkbox'].checked);
    loginForm.reset();
});
