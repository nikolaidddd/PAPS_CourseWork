const express = require("express");
const dispatcherController = require('../controllers/dispatcherControllers.js');
const dispatcherRouter = express.Router();
const roleMiddleware = require('../middlewares/roleMiddleware.js');


dispatcherRouter.use(express.static('d:/Web/PAPS/views'));
dispatcherRouter.get('/',dispatcherController.requests);
dispatcherRouter.get('/users', dispatcherController.users);
dispatcherRouter.get('/residents', dispatcherController.residents);

dispatcherRouter.get("/get/requests", roleMiddleware(['Диспетчер']), dispatcherController.getRequests);
dispatcherRouter.put('/put/request/:id', roleMiddleware(['Диспетчер']), dispatcherController.putRequest);
// dispatcherRouter.put('/put/request/status/:id', roleMiddleware(['Диспетчер']), dispatcherController.putRequestStatus);
dispatcherRouter.post('/post/request', roleMiddleware(['Диспетчер']), dispatcherController.postRequest);
dispatcherRouter.delete('/delete/request/:id', roleMiddleware(['Диспетчер']), dispatcherController.deleteRequest);

dispatcherRouter.get('/get/executors/:type_work', dispatcherController.getExecutors);
dispatcherRouter.get('/get/executor/:id', dispatcherController.getExecutor);

dispatcherRouter.get('/get/residents', dispatcherController.getResidents);
dispatcherRouter.post('/post/resident', dispatcherController.postResident);

dispatcherRouter.get('/get/users', dispatcherController.getUsers);
dispatcherRouter.get('/get/specialists', dispatcherController.getSpecialists);
// dispatcherRouter.post('/post/user', authController.registration);

module.exports = dispatcherRouter;