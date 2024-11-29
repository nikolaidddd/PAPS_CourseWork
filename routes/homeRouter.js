const express = require("express");
const homeControllers = require('../controllers/homeControllers.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const roleMiddleware = require('../middlewares/roleMiddleware.js');
const homeRouter = express.Router();

homeRouter.use(express.static('d:/Web/PAPS/views'));
homeRouter.use('/notifications' ,express.static('d:/Web/PAPS/views'));

homeRouter.get('/', homeControllers.index);
homeRouter.get('/notifications', homeControllers.notifications);

homeRouter.get('/get/user',authMiddleware,homeControllers.getUser);
homeRouter.get('/get/works', homeControllers.getWorks);
homeRouter.post('/post/request', roleMiddleware(['Пользователь']), homeControllers.postRequest);

module.exports = homeRouter;