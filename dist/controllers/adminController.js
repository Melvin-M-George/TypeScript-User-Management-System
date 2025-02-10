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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
class AdminRouter {
    constructor() {
        this.getLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.session.admin) {
                    return res.redirect('/admin/home');
                }
                res.render('adminLogin', { message: "" });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.postLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const admin = yield userSchema_1.default.findOne({ email: data.email, is_admin: 1 });
                if (!admin) {
                    return res.render('adminLogin', { message: "Invalid email or Password." });
                }
                const passMatch = yield bcryptjs_1.default.compare(data.password, admin.password);
                if (passMatch) {
                    req.session.admin = true;
                    return res.redirect('/admin/home');
                }
                res.render('adminLogin', { message: "Invalid Email or Password." });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.loadHome = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.session.admin) {
                    return res.redirect('/admin');
                }
                const query = req.query.q || "";
                const users = yield userSchema_1.default.find({ is_admin: 0, $or: [
                        { name: { $regex: query, $options: "i" } },
                        { email: { $regex: query, $options: "i" } }
                    ] });
                res.render('adminHome', { users });
            }
            catch (error) {
                console.log("Error loading admin dashboard", error);
            }
        });
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                req.session.admin = false;
                res.redirect('/admin');
            }
            catch (error) {
                console.log("Error in admin logout", error);
            }
        });
        this.getEditUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                const userData = yield userSchema_1.default.findById(userId);
                res.render('user-edit', { user: userData });
            }
            catch (error) {
                console.error("Error loading edit user page", error);
            }
        });
        this.postEditUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = req.body;
                const updateDetails = {
                    $set: {
                        name: data.name,
                        email: data.email,
                        mobile: data.mobile,
                        image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename
                    }
                };
                yield userSchema_1.default.findByIdAndUpdate(data.userId, updateDetails);
                res.redirect('/admin/home');
            }
            catch (error) {
                console.error("Error updating user");
            }
        });
        this.blockUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                const user = yield userSchema_1.default.findByIdAndUpdate(userId, { $set: { isBlocked: true } });
                res.redirect('/admin/home');
            }
            catch (error) {
                console.error("Error blocking user", error);
            }
        });
        this.unBlockUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                const user = yield userSchema_1.default.findByIdAndUpdate(userId, { $set: { isBlocked: false } });
                res.redirect('/admin/home');
            }
            catch (error) {
                console.error("Error unblocking user", error);
            }
        });
    }
}
exports.default = new AdminRouter();
