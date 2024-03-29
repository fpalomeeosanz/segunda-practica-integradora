import passport from "passport";
import LocalStrategy  from "passport-local";
import { createHash, isValidPassword } from "../src/utils.js";

export const initializePassport = ()=>{
    
    passport.use("signupStrategy", new LocalStrategy(
        {
            usernameField:"email",
            passReqToCallback:true
        },
        async(req,username,password,done)=>{
            try {
                const {name} = req.body;
                const user = await UserModel.findOne({email:username});
                if(user){
                    return done(null,false)
                }
                //crear el usuario
                let rol='user';
                if (username.endsWith("@coder.com")) {
                    rol = "admin";
                }
               
                const newUser = {
                    name,
                    email:username,
                    password:createHash(password),
                    rol
                };
                const userCreated = await UserModel.create(newUser);
                return done(null,userCreated)
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use("loginStrategy", new LocalStrategy(
        {
            usernameField:"email"
        },
        async (username, password, done)=>{
            try {
                const user = await UserModel.findOne({email:username});
                if(!user){
                    return done(null, false);
                }
                if(!isValidPassword(password, user)) return done(null, false);
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    });

    passport.deserializeUser(async(id,done)=>{
        const userDB = await UserModel.findById(id);
        done(null, userDB)
    });
}
