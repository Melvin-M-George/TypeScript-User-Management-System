import { Request, Response } from 'express';
import bcrypt from "bcryptjs";
import User from '../models/userSchema'

class AdminRouter {
    getLogin = async (req: Request, res: Response): Promise<void> => {
        try {
            if (req.session.admin) {
                return res.redirect('/admin/home');
            }
            res.render('adminLogin', { message: "" });
        } catch (error) {
            console.log(error);
        }
    }

    postLogin = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = req.body;
            const admin = await User.findOne({ email: data.email, is_admin: 1 });
            if (!admin) {
                return res.render('adminLogin', { message: "Invalid email or Password." })
            }
            const passMatch = await bcrypt.compare(data.password, admin.password)
            if (passMatch) {
                req.session.admin = true;
                return res.redirect('/admin/home');
            }
            res.render('adminLogin', { message: "Invalid Email or Password." })
        } catch (error) {
            console.log(error);
        }
    }

    loadHome = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.session.admin) {
                return res.redirect('/admin')
            }
            const query = req.query.q || "";
            const users = await User.find({ is_admin: 0,$or: [
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]})
            res.render('adminHome', { users });
        } catch (error) {
            console.log("Error loading admin dashboard", error);
        }
    }

    logout = async (req: Request, res: Response): Promise<void> => {
        try {
            req.session.admin = false;
            res.redirect('/admin')
        } catch (error) {
            console.log("Error in admin logout", error);
        }
    }

    getEditUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.query.userId;
            const userData = await User.findById(userId);
            res.render('user-edit', { user: userData });
        } catch (error) {
            console.error("Error loading edit user page", error);
        }
    }

    postEditUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = req.body;
            const updateDetails = {
                $set: {
                    name: data.name,
                    email: data.email,
                    mobile: data.mobile,
                    image: req.file?.filename
                }
            }

            await User.findByIdAndUpdate(data.userId, updateDetails);
            res.redirect('/admin/home')
        } catch (error) {
            console.error("Error updating user");
        }
    }

    blockUser = async (req:Request,res:Response):Promise<void> => {
        try {
            const userId = req.query.userId;
            const user = await User.findByIdAndUpdate(userId,{$set:{isBlocked:true}});
            res.redirect('/admin/home')
        } catch (error) {
            console.error("Error blocking user",error)
        }
    }

    unBlockUser = async (req:Request,res:Response):Promise<void> => {
        try {
            const userId = req.query.userId;
            const user = await User.findByIdAndUpdate(userId,{$set:{isBlocked:false}});
            res.redirect('/admin/home')
        } catch (error) {
            console.error("Error unblocking user",error)
        }
    }
}

export default new AdminRouter();