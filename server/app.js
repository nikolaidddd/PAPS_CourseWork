const mongoose = require("mongoose");
const express = require('express'); 

const User = require('../models/User.js').User;
const PlanRequest = require('../models/PlanRequest.js').PlanRequest;
const Employee = require('../models/Employee.js').Employee;
const Role = require('../models/Role.js').Role;

const dispatcherRouter = require('../routes/dispatcherRouter.js');
const homeRouter = require('../routes/homeRouter.js');
const authRouter = require('../routes/authRouter.js');

const jsonParser = express.json();
const app = express();

app.set("view engine", "hbs");

async function run() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ManagementCompany');
        app.listen(3000);
        console.log(`Сервер запущен...\nКлиент: http://localhost:3000\nДиспетчер: http://localhost:3000/dispatcher\nСпециaлист: http://localhost:3000/specialist`);
    }catch(err) {
        console.log(err);
    }
}
run();


app.use(jsonParser);
app.use('/dispatcher', dispatcherRouter);
app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/login', (_,response) => {
    response.render('login.hbs')
});

app.get("/get/requests/:executor", async (request, response) => {
    const requests = await Request.find({executor: request.params.executor});
    response.send(requests);
});

app.get("/specialist", (_,response) => {
    response.render("specialist.hbs");
});


process.on("SIGINT", async() => {
    await mongoose.disconnect();
    console.log("Приложение завершило работу");
    process.exit();
});
// async function test() {
//     const role = await Role.findOne({value: 'Дворник'});
//     Employee.create({
//         surname: 'ФамДворник',
//         name: 'ИмДворник',
//         tel: '+79631244922',
//         username: 'dvornik',
//         password: 'dvornik',
//         roles: [role.value]
//     });
// }
// test();