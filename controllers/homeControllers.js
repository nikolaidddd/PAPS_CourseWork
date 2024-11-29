const Type = require('../models/Type.js').Type;
const Status = require('../models/Status.js').Status;
const Request = require('../models/Request.js').Request;
const TypeWork = require('../models/TypeWork.js').TypeWork;
const User = require('../models/User.js').User;
const Resident = require('../models/Resident.js').Resident;


module.exports.index = (_,response) => {
    response.render("index.hbs");
}
module.exports.getUser = (request,response) => {
    response.json(request.user);
}

module.exports.notifications = (_,response) => {
    response.render("notifications.hbs");
}

module.exports.postRequest = async (request, response) => {
    if(!request.body) return response.status(400);
    try {
        const {typework, descr} = request.body;
        const user = await User.findOne({_id: request.user.id});
        const resident = await Resident.findOne({_id: user.resident});
        const type = await Type.findOne({value: 'Аварийная'});
        const status = await Status.findOne({value: 'Новая'});
        const currDate = new Date();
        date = ("0" + (currDate.getDate())).slice(-2) + '.' + ("0" + (currDate.getMonth() + 1)).slice(-2) + '.' + currDate.getFullYear();
        const typeWork = await TypeWork.findOne({name: typework.name});
        const work = typeWork.works.find(item => item === typework.work);
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
module.exports.getWorks = async (request, response) => {
    const works = await TypeWork.find();
    if(works) {
        response.send(works);
    }
    else {
        response.status(400).json({message: 'ОШибка при получении видов работ'});
    }
}