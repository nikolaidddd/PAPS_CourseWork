const token = localStorage.getItem('token');
const table = document.querySelector('.main_residents_table_content');
// const sort_by_address_btn = document.querySelector('.sort_by_address');
let residents = [];

async function getResidents() {
    const response = await fetch('/dispatcher/get/residents', {
        method: "GET",
        headers: {
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
    if(response.ok) {
        const residents = await response.json();
        return residents;
    }
    return null;
}

async function postResident(resident) {
    const response = await fetch('/dispatcher/post/resident', {
        method: "POST",
        headers: {
            "Accept" : "application/json",
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify(resident)
    });
    return response;
}

async function start() {
    residents = await getResidents();
    residents.forEach(resident => {
        createRow(resident);
    });
}

function createRow(resident) {
    const row = document.createElement('div');
    row.classList.add('main_residents_table_content_row');

    const {_id,surname,name,address,tel, numApart} = resident;
    
    const id_column = document.createElement('div');
    const name_column = document.createElement('div');
    const address_column = document.createElement('div');
    const contacts_column = document.createElement('div');

    id_column.style.cssText = 'width: 250px;';
    name_column.style.cssText = 'width: 300px;';
    address_column.style.cssText = 'width: 450px;';
    contacts_column.style.cssText = 'width: 220px;';

    id_column.innerText = _id;
    name_column.innerText = surname + ' ' + name;
    address_column.innerText = address.city + ' ' + address.street + ' ' + address.numHome + ' ' + numApart;
    contacts_column.innerText = tel;

    row.append(id_column);
    row.append(name_column);
    row.append(address_column);
    row.append(contacts_column);

    table.append(row);
}
start();

// sort_by_address_btn.addEventListener('click', () => {
//     table.innerHTML = '';
//     residents.sort((a,b) => a.surname > b.surname ? 1 : -1);
//     residents.forEach(resident => {
//         createRow(resident);
//     });
// });

//modal
const modal_close_btn = document.querySelector('.modal_content_close'),
      modal_open_btn = document.querySelector('.add_resident_btn'),
      modal_send_btn = document.querySelector('.modal_content_input_submit'),
      form = document.forms['sendRequestForm'],
      modal_window = document.querySelector('.modal');

modal_close_btn.addEventListener('click', () => {
    CloseModal(modal_window);
});

modal_open_btn.addEventListener('click', () => {
    ShowModal(modal_window);
});

modal_send_btn.addEventListener('click', async (e) => {
    if(form.checkValidity()) {
        const city = form.elements['city'].value,
              street = form.elements['street'].value,
              numHome = form.elements['numHome'].value,
              numApart = form.elements['numApart'].value,
              surname = form.elements['surname'].value,
              name = form.elements['name'].value,
              tel = form.elements['tel'].value;
        const resident = {
            surname,
            name,
            tel,
            numApart: Number(numApart),
            city,
            street,
            numHome: Number(numHome)
        }
        const result = await postResident(resident);
    }
});

function CloseModal(window) {
    window.classList.remove('show');
    window.classList.add('hide');
}
function ShowModal(window) {
    window.classList.remove('hide');
    window.classList.add('show');
}