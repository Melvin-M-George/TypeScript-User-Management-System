import { Request, Response } from 'express';
import User from '../models/userSchema'
import bcrypt from "bcryptjs";
import session from 'express-session';

class UserController {

    securePassword = async (password: string): Promise<string | undefined> => {
        try {
            return await bcrypt.hash(password, 10);
        } catch (error) {
            console.log(error);
        }
    }

    loadHome = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.session.user;
            if (!userId) {
                return res.redirect('/login');
            }
            const user = await User.findById(userId);
            res.render('home', { user });
        } catch (error) {
            console.log(error);
        }
    }

    loadSignup = async (req: Request, res: Response): Promise<void> => {
        try {
            res.render('signup', { message: "" })
        } catch (error) {
            console.log(error);
        }
    }

    postSignup = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = req.body;
            const existingUser = await User.findOne({ email: data.email });
            if (existingUser) {
                return res.render('signup', { message: "User with this email already exists." });
            }
            const sPassword = await this.securePassword(data.password)
            const newUser = new User({
                name: data.name,
                email: data.email,
                mobile: data.mobile,
                password: sPassword,
                image: req.file?.filename
            })

            await newUser.save();
            res.redirect('/login')
        } catch (error) {
            console.log(error);
        }
    }

    loadLogin = async (req: Request, res: Response): Promise<void> => {
        try {
            if (req.session.user) {
                return res.redirect('/');
            }
            res.render('login', { message: "" });
        } catch (error) {
            console.log(error);
        }
    }

    postLogin = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = req.body;
            const user = await User.findOne({ email: data.email, is_admin: 0, isBlocked: false })

            if (!user) {
                return res.render('login', { message: "User not found." });
            }
            const passMatch = await bcrypt.compare(data.password, user.password);
            if (passMatch) {
                req.session.user = user._id.toString();
                return res.redirect('/')
            }
            return res.render('login', { message: "Email or Password is incorrect" });
        } catch (error) {
            console.log("Error in user login", error);
        }
    }

    logout = async (req: Request, res: Response): Promise<void> => {
        try {
            req.session.user = null;
            res.redirect('/login');
        } catch (error) {
            console.log(error);
        }
    }

    getEditUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.session.user
            if (!userId) {
                return res.redirect('/login')
            }
            const user = await User.findById(userId);
            res.render('edit-user', { user });
        } catch (error) {

        }
    }

    editUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.session.user;
            const data = req.body;
            if (!userId) {
                return res.redirect('/login');
            }
            const userDetails = {
                $set: {
                    name: data.name,
                    email: data.email,
                    mobile: data.mobile,
                    image: req.file?.filename
                }
            }
            await User.findByIdAndUpdate(userId, userDetails)
            res.redirect('/');
        } catch (error) {
            console.log("Error updating user", error);
        }
    }
}

export default new UserController()