"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const express_session_1 = __importDefault(require("express-session"));
const config_1 = require("../config/config");
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const multer_2 = require("../utils/multer");
const auth_1 = __importDefault(require("../middlewares/auth"));
dotenv_1.default.config();
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.use((0, express_session_1.default)({
    secret: config_1.session_secret,
    resave: false,
    saveUninitialized: false
}));
userRouter.use('/public', express_1.default.static(path_1.default.join(__dirname, '../../src/public')));
const upload = (0, multer_1.default)({ storage: multer_2.storage });
userRouter.get('/', auth_1.default.userAuth, userController_1.default.loadHome);
userRouter.get('/signup', userController_1.default.loadSignup);
userRouter.post('/signup', upload.single('image'), userController_1.default.postSignup);
userRouter.get('/login', userController_1.default.loadLogin);
userRouter.post('/login', userController_1.default.postLogin);
userRouter.get('/logout', userController_1.default.logout);
userRouter.get('/edit-user', auth_1.default.userAuth, userController_1.default.getEditUser);
userRouter.post('/edit-user', auth_1.default.userAuth, upload.single('image'), userController_1.default.editUser);
