"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./db"));
(0, db_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT;
const userRoute_1 = require("./routes/userRoute");
const adminRoute_1 = require("./routes/adminRoute");
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    next();
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set('views', [
    path_1.default.join(__dirname, '../src/views/user'),
    path_1.default.join(__dirname, '../src/views/admin'),
]);
app.set('view engine', 'ejs');
app.use('/', userRoute_1.userRouter);
app.use('/admin', adminRoute_1.adminRouter);
app.listen(port, () => {
    console.log("Server running on port " + port);
});
