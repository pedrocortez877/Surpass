import { Router } from 'express'
import multer from 'multer'

import AreasController from './controllers/AreasController'
import UsersController from './controllers/UsersController'
import AuthController from './controllers/AuthController'
import uploadConfig from './config/upload'

import authJwt from './middleware/authJwt';
import verifySignUp from './middleware/verifySignUp'

const routes = Router();
const upload = multer(uploadConfig);

routes.post('/areas', upload.array('images'), authJwt.verifyToken,  AreasController.create);
routes.get('/areas', AreasController.index);
routes.get('/areas/:id',AreasController.show);
routes.delete('/areas/:id', authJwt.verifyToken, AreasController.remove);
routes.put('/areas/:id', authJwt.verifyToken, AreasController.update);

routes.post('/users', verifySignUp.checkDuplicateEmail, UsersController.create);
routes.get('/users/:id', UsersController.show);

routes.post('/login', AuthController.authentication);
routes.get('/logout', AuthController.logout);

export default routes;