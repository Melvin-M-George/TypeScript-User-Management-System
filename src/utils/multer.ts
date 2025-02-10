import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname, '../../src/public/userImages'))
    },
    filename: function(req,file,cb){
        const name = Date.now()+"-"+file.originalname;
        cb(null,name);
    }
})

export {storage}