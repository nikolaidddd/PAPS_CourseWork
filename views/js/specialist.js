"use strict"
// const new_requests_table = document.querySelector("#content-new"),
//       current_request = document.querySelector("#content-current"),
//       done_requests_table = document.querySelector('#content-done');
// async function GetRequestsByExecutor(executor) {
//     const response = await fetch("/get/requests/" + executor, {
//         method: "GET",
//         headers: { "Accept" : "application/json" }
//     });

//     if(response.ok === true) {
//         const requests = await response.json();
//         requests.forEach(item => {
//             CreateRequest(item);
//         });
//         return requests;
//     }
//     else {
//         console.log('err by get request');
//     } 
// }

// function CreateRequest(request) {
//     const request_block = document.createElement('div'),
//           request_block_numreq = document.createElement('div'),
//           request_block_info = document.createElement('div');
          

//     request_block.style.cssText = 'margin-bottom: 10px;border-radius: 5px;';
//     request_block_numreq.style.cssText = 'background-color: rgb(230,230,230); display:flex;justify-content:center;border-radius: 5px 5px 0px 0px;';
//     request_block_info.style.cssText = 'font-size: 15px;padding:10px;display: flex;justify-content:center;';
//     request_block_numreq.innerHTML = "№" + request._id + '<hr>';
//     request_block_info.innerHTML = 'Адрес: '+ request.city+','+request.street+','+request.numApart + '<br>' +
//     'Заявитель: ' + request.name + '<br>' +'Вид заявки: ' + request.type + '<br>' + 'Описание: ' + request.descr;

//     request_block.classList.add('main_requests_table_item');
//     request_block.append(request_block_numreq);
//     request_block.append(request_block_info);
//     if(request.status == 'Передана') {
//         const request_block_btn = document.createElement('button');
//         request_block_btn.innerText = "Принять";
//         request_block_btn.style.cssText = 'display:block;width: 130px;height:30px;margin: 10px auto;border-radius:5px;background: green;color:white;';
//         request_block.append(request_block_btn);
//         request_block_btn.addEventListener('click', () => {
//             EditRequest(request._id, request.executor, 'В работе');
//         });
//         new_requests_table.append(request_block);
//     }
//     else if (request.status == 'В работе') {
//         current_request.append(request_block);
//     }
//     else {
//         done_requests_table.append(request_block);
//     }
// }

// async function EditRequest(requestId, requestExecutor, requestStatus) {
//     const response = await fetch('/put/request/' + requestId,{
//         method: "PUT",
//         headers: {
//             "Accept" : "application/json", "Content-Type" : "application/json"
//         },
//         body: JSON.stringify({
//             executor: requestExecutor,
//             status: requestStatus
//         })
//     });
// }

// GetRequestsByExecutor("2");


const hamburger = document.querySelector('.hamburger'),
      menu = document.querySelector('.menu');

hamburger.addEventListener('click', () => {
    menu.classList.remove('hide');
    menu.classList.add('show');
});