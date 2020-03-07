import { Router } from 'express';
import multer from 'multer';

import FileController from './app/controllers/FileController';
import ProblemController from './app/controllers/ProblemController';
import SessionController from './app/controllers/SessionController';
import DeliveryController from './app/controllers/DeliveryController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryEndsController from './app/controllers/DeliveryEndsController';
import DeliveryStartsController from './app/controllers/DeliveryStartsController';
import DeliverymanDeliveryController from './app/controllers/DeliverymanDeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

// routes to logged users
routes.use(authMiddleware);

// deliveryman routes
routes.get('/deliverymen/:id/deliveries', DeliverymanDeliveryController.show);

// start and and deliveries
routes.put('/deliveries/:id/start', DeliveryStartsController.update);
routes.put(
  '/deliveries/:id/finish',
  upload.single('file'),
  DeliveryEndsController.update
);

// deliveries problems
routes.get('/deliveries/:id/problems', DeliveryProblemController.show);
routes.post('/deliveries/:id/problems', DeliveryProblemController.store);

// cancel delivery (problem)
routes.put('/problems/:id/cancel-delivery', ProblemController.update);

// routes to admins
routes.use(adminMiddleware);

// recipients routes
routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.show);
routes.put('/recipients/:id', RecipientController.update);
routes.get('/recipients/:id', RecipientController.index);
routes.delete('/recipients/:id', RecipientController.destroy);

// deliverimen admin routes
routes.post('/deliverymen', DeliverymanController.store);
routes.get('/deliverymen', DeliverymanController.show);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.destroy);
routes.get('/deliverymen/:id', DeliverymanController.index);

// file upload routes
routes.post('/files', upload.single('file'), FileController.store);

// deliveries routes
routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.show);
routes.get('/deliveries/:id', DeliveryController.index);
routes.delete('/deliveries/:id', DeliveryController.destroy);
routes.put('/deliveries/:id', DeliveryController.update);

export default routes;
