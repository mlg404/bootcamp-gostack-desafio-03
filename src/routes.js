import { Router } from 'express';
import multer from 'multer';

import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import DeliveryController from './app/controllers/DeliveryController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';

import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.show);
routes.put('/recipients/:id', RecipientController.update);
routes.get('/recipients/:id', RecipientController.index);
routes.delete('/recipients/:id', RecipientController.destroy);

routes.post('/deliverymen', DeliverymanController.store);
routes.get('/deliverymen', DeliverymanController.show);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.destroy);
routes.get('/deliverymen/:id', DeliverymanController.index);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.show);
routes.get('/deliveries/:id', DeliveryController.index);
routes.delete('/deliveries/:id', DeliveryController.destroy);
// routes.put('/deliveries/:id', DeliveryController.update);

export default routes;
