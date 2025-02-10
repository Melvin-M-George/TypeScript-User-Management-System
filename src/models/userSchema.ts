import {Schema, model} from 'mongoose';

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_admin:{
        type:Number,
        required:true,
        default:false
    },
    isBlocked:{
        type:Boolean,
        required:true,
        default:false
    }
})

const User = model('User',userSchema);
export default User;