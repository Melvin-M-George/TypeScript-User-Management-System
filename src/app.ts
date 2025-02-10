import express from 'express';
const app = express();
import mongoose from 'mongoose';
import path from 'path';
import connectDb from './db';
connectDb();

import dotenv from 'dotenv'
dotenv.config();
const port = process.env.PORT;

import {userRouter} from './routes/userRoute'
import {adminRouter} from './routes/adminRoute';

app.use((req,res,next)=>{
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', [
    path.join(__dirname, '../src/views/user'),
    path.join(__dirname, '../src/views/admin'),
]);
app.set('view engine','ejs');

app.use('/',userRouter);
app.use('/admin',adminRouter);



app.listen(port,()=>{
    console.log("Server running on port " + port);
})