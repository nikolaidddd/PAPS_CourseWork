const Request = require('../models/Request.js').Request;
const Type = require('../models/Type.js').Type;
const Status = require('../models/Status.js').Status;
const User = require('../models/User.js').User;
const Employee = require('../models/Employee.js').Employee;
const Resident = require('../models/Resident.js').Resident;
const Address = require('../models/Address.js').Address;
const TypeWork = require('../models/TypeWork.js').TypeWork;

module.exports.requests = async function (request, response) {
    const new_requests = await Request.find({status: 'Новая'}),
    inwork_requests = await Request.find({status: 'В работе'}),
    done_requests = await Request.find({status: 'Выполнена'}),
    send_requests = await Request.find({status: 'Передана'}),
    cancel_requests = await Request.find({status: 'Отмена'});

    response.render("dispatcher.hbs", {
    request_new_count: new_requests.length,
    request_inwork_count: inwork_requests.length,
    request_done_count: done_requests.length,
    request_send_count: send_requests.length,
    request_cancel_count: cancel_requests.length
    });
}

module.exports.getRequests = async (_,response) => {
    try {
        let requests = await Request.find().populate({
            path: 'resident',
            populate: { path: 'address' }
        }).populate({
            path: 'dispatcher'
        }).populate({
            path: 'executor'
        });
        response.send(requests);
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при получении всех запросов'});
    }
}

module.exports.postRequest = async (request, response) => {
    if(!request.body) return response.status(400);
    try {
        const {typework, descr, resident} = request.body;
        console.log(resident);
        const type = await Type.findOne({value: 'Аварийная'});
        const status = await Status.findOne({value: 'Новая'});
        const currDate = new Date();
        date = ("0" + (currDate.getDate())).slice(-2) + '.' + ("0" + (currDate.getMonth() + 1)).slice(-2) + '.' + currDate.getFullYear();
        const result = await Request.create({
            resident,
            type: type.value,
            status: status.value,
            date,
            descr,
            typework
        });
        if(result) {
            console.log('Заявка успешно добавлена');
            response.send(result);
        }
        else {
            console.log('Ошибка при создании заявки');
            response.status(400).json({message: 'ошибка при создании заявки'});
        }
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при добавлении запроса'});
    }
}
async function putRequestStatus(request, response) {
    try {
        const id = request.params.id;
        const {status} = request.body;
        const statusRequest = await Status.findOne({value: status});
        const result = await Request.updateOne({_id:id}, { status: statusRequest.value});
        if(result) {
            console.log(`У заявки №${id} изменен статус на ${statusRequest}`);
            response.send(result);
        }
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при изменении статуса заявки'});
    }
}

module.exports.putRequest = async (request, response) => {
    if(!request.body) return response.status(400);
    try {
        const id = request.params.id;
        const { executor } = request.body;
        if(executor) {
            const executorRequest = await Employee.findOne({name: executor});
            const dispatcher = await Employee.findOne({_id: request.user.id});
            const result = await Request.updateOne({_id:id}, {executor: executorRequest, dispatcher});
            if(result) {
                console.log(`У заявки №${id} изменен исполнитель на ${executorRequest.name}`);
                putRequestStatus(request,response);
            }
        }
        else {
            putRequestStatus(request,response);
        }
        

    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при изменении исполнителя заявки'});
    }
}

module.exports.deleteRequest = async (request,response) => {
    if(!request.body) return response.status(400);
    try {
        const id = request.params.id;
        const result = await Request.deleteOne({_id: id});
        if(result) {
            console.log('Заявка успешно удалена');
            response.send(result);
        }
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при удалении запроса'});
    }
}

module.exports.getExecutors = async (request,response) => {
    try {
        const type_work = request.params.type_work;
        let executors;
        switch(type_work) {
            case 'Подъезд':
                executors = await Employee.find({roles: ['Плотник']});
                break;
            case 'Крыша и водосточная система':
                executors = await Employee.find({roles: ['Плотник']});
                break;
            case 'Лифт':
                executors = await Employee.find({roles: ['Электрик']});
                break;
            case 'Холодное водоснабжение':
                executors = await Employee.find({roles: ['Слесарь-сантехник']});
                break;
            case 'Горячее водоснабжение':
                executors = await Employee.find({roles: ['Слесарь-сантехник']});
                break;
            case 'Канализация':
                executors = await Employee.find({roles: ['Слесарь-сантехник']});
                break;
            case 'Электроснабжения':
                executors = await Employee.find({roles: ['Электрик']});
                break;
            default:
                executors = await Employee.find();
                break;
        }
        response.send(executors);
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при получении исполнителей'});
    }
}

module.exports.getExecutor = async (request,response) => {
    if(!request.body) return response.status(400);
    try {
        const id = request.params.id;
        const result = await Employee.findOne({_id: id});
        if(result) {
            console.log('Получен исполнитель');
            response.send(result);
        }
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при получении исполнителя'});
    }
}

module.exports.getResidents = async function (_,response) {
    try {
        const residents = await Resident.find().populate('address');
        response.send(residents);
    } catch(e) {
        console.log(e);
        response.status(400).json({message: "Ошибка при получении жильцов"});
    }
    
}


module.exports.users = function (_, response) {
    response.render('users.hbs');
}

module.exports.getUsers = async function (_, response) {
    try {
        let users = await User.find({}).populate({
            path: 'resident',
            populate: {
                path: 'address'
            }
        });
        response.send(users);
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при получении всех пользователей'});
    }
}
module.exports.getSpecialists = async function (_, response) {
    try {
        const specialists = await Employee.find({roles: ['Плотник']});
        specialists.push(...await Employee.find({roles: ['Электрик']}));
        specialists.push(...await Employee.find({roles: ['Слесарь-сантехник']}));
        specialists.push(...await Employee.find({roles: ['Уборщик']}));
        specialists.push(...await Employee.find({roles: ['Дворник']}));
        response.send(specialists);
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при получении всех специалистов'});
    }
}

module.exports.residents = function (_,response) {
    response.render('residents.hbs');
}

module.exports.postResident = async function (request,response) {
    const {name, surname, tel, numApart, city, street, numHome} = request.body;
    const address = await Address.findOne({
        city,
        street,
        numHome
    });
    if(address) {
        const checkResident = await Resident.findOne({
            address,
            numApart
        });
        if(!checkResident) {
            const resident = await Resident.create({
                surname,
                name,
                address,
                tel,
                numApart
            });
            console.log('Жилец успешно создан');
            response.send(resident);
        }
        else {
            console.log('Жилец уже существует');
            response.json({message: 'Уже существует'});
        }
    }   
    else {
        const address = await Address.create({
            city,
            street,
            numHome
        });
        const resident = await Resident.create({
            surname,
            name,
            address,
            tel,
            numApart
        });
        console.log('Жилец и адрес успешно создан');
        response.send(resident);
    }
}