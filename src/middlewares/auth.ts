import { NextFunction } from 'express';
import User from '../models/userSchema';
import { Request, Response } from 'express';

class Middlewares  {
    adminAuth = async (req:Request,res:Response,next:NextFunction) => {
        try {
            if(!req.session?.admin){
                return res.redirect('/admin')
            }
            next();
        } catch (error) {
            console.log(error);
        }
    }

    userAuth = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const userId = req.session.user
            if(!userId){
                return res.redirect('/login')
            }
            const user = await User.findById(userId);
            if(!user){
                return res.redirect('/login');
            }
            if(user.isBlocked){
                req.session.user = null;
                return res.redirect('/login');
            }
            next();
        } catch (error) {
            console.log(error);            
        }
    }
}

export default new Middlewares 