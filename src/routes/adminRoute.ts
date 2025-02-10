import express from 'express';
import path from 'path';
import adminController from '../controllers/adminController'
import multer from 'multer';
import {storage} from '../utils/multer'
import auth from '../middlewares/auth'
const upload = multer({storage:storage});

const adminRouter = express.Router();

adminRouter.use('/public', express.static(path.join(__dirname, '../../src/public')));

adminRouter.get('/',adminController.getLogin);
adminRouter.post('/',adminController.postLogin);
adminRouter.get('/home',auth.adminAuth,adminController.loadHome);
adminRouter.get('/logout',adminController.logout);
adminRouter.get('/edit-user',auth.adminAuth,adminController.getEditUser);
adminRouter.post('/edit-user',auth.adminAuth,upload.single('image'),adminController.postEditUser);
adminRouter.get('/block-user',auth.adminAuth,adminController.blockUser);
adminRouter.get('/unblock-user',auth.adminAuth,adminController.unBlockUser);

export {adminRouter};