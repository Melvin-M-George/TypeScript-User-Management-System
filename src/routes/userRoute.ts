import express from 'express';
import userController from '../controllers/userController';
import session from 'express-session';
import {session_secret} from '../config/config'
import dotenv from 'dotenv'
import multer from 'multer';
import path from 'path';
import {storage} from '../utils/multer'
import auth from '../middlewares/auth'
dotenv.config();

const userRouter = express.Router();

userRouter.use(session({
    secret:session_secret,
    resave:false,
    saveUninitialized:false
}))

userRouter.use('/public', express.static(path.join(__dirname, '../../src/public')));


const upload = multer({storage:storage});

userRouter.get('/',auth.userAuth,userController.loadHome)
userRouter.get('/signup',userController.loadSignup)
userRouter.post('/signup',upload.single('image'),userController.postSignup);
userRouter.get('/login',userController.loadLogin);
userRouter.post('/login',userController.postLogin)
userRouter.get('/logout',userController.logout);
userRouter.get('/edit-user',auth.userAuth,userController.getEditUser);
userRouter.post('/edit-user',auth.userAuth,upload.single('image'),userController.editUser);

export {userRouter};