"use strict"

const menu_items = document.querySelectorAll('.header_top_menu_list_item a');

menu_items.forEach((item) => {
    item.addEventListener('mouseover', (event) => {
        item.style.cssText = 'color: #ff4c4c;';
    });
    item.addEventListener('mouseout', (event) => {
        item.style.cssText = 'color: rgb(255, 255, 255);';
    });
});

const response = fetch("/notifications", {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${document.cookie}`
    }
});
