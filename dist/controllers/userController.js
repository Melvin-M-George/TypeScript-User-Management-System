"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userSchema_1 = __importDefault(require("../models/userSchema"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserController {
    constructor() {
        this.securePassword = (password) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield bcryptjs_1.default.hash(password, 10);
            }
            catch (error) {
                console.log(error);
            }
        });
        this.loadHome = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.session.user;
                if (!userId) {
                    return res.redirect('/login');
                }
                const user = yield userSchema_1.default.findById(userId);
                res.render('home', { user });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.loadSignup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.render('signup', { message: "" });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.postSignup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = req.body;
                const existingUser = yield userSchema_1.default.findOne({ email: data.email });
                if (existingUser) {
                    return res.render('signup', { message: "User with this email already exists." });
                }
                const sPassword = yield this.securePassword(data.password);
                const newUser = new userSchema_1.default({
                    name: data.name,
                    email: data.email,
                    mobile: data.mobile,
                    password: sPassword,
                    image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename
                });
                yield newUser.save();
                res.redirect('/login');
            }
            catch (error) {
                console.log(error);
            }
        });
        this.loadLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.session.user) {
                    return res.redirect('/');
                }
                res.render('login', { message: "" });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.postLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const user = yield userSchema_1.default.findOne({ email: data.email, is_admin: 0, isBlocked: false });
                if (!user) {
                    return res.render('login', { message: "User not found." });
                }
                const passMatch = yield bcryptjs_1.default.compare(data.password, user.password);
                if (passMatch) {
                    req.session.user = user._id.toString();
                    return res.redirect('/');
                }
                return res.render('login', { message: "Email or Password is incorrect" });
            }
            catch (error) {
                console.log("Error in user login", error);
            }
        });
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                req.session.user = null;
                res.redirect('/login');
            }
            catch (error) {
                console.log(error);
            }
        });
        this.getEditUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.session.user;
                if (!userId) {
                    return res.redirect('/login');
                }
                const user = yield userSchema_1.default.findById(userId);
                res.render('edit-user', { user });
            }
            catch (error) {
            }
        });
        this.editUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
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
                        image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename
                    }
                };
                yield userSchema_1.default.findByIdAndUpdate(userId, userDetails);
                res.redirect('/');
            }
            catch (error) {
                console.log("Error updating user", error);
            }
        });
    }
}
exports.default = new UserController();
