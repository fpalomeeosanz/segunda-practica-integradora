import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const __filename = fileURLToPath(import.meta.url);

export const createHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

export const isValidPassword = (password, user)=>{
    return bcrypt.compareSync(password, user.password)
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,`${__dirname}/public/images`)
    },
    filename: function(req, file, cb){
        cb(null,`${Date.now()} - ${file.originalname}`)
    }
})

export const uploader = multer({storage});