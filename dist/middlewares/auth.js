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
class Middlewares {
    constructor() {
        this.adminAuth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.admin)) {
                    return res.redirect('/admin');
                }
                next();
            }
            catch (error) {
                console.log(error);
            }
        });
        this.userAuth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.session.user;
                if (!userId) {
                    return res.redirect('/login');
                }
                const user = yield userSchema_1.default.findById(userId);
                if (!user) {
                    return res.redirect('/login');
                }
                if (user.isBlocked) {
                    req.session.user = null;
                    return res.redirect('/login');
                }
                next();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = new Middlewares;
