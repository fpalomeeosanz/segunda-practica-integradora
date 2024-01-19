import GithubStrategy from "passport-github";
import userModel from "./src/dao/models/user.model.js";
import passport from "passport";

const initializePassport = () => {
    passport.use(`github`, new GithubStrategy({
        clientID: "Iv1.514facd7ce886c08",
        clientSecret: `56881637e9a2a221631a807f39594c71724c73af`,
        callBackURL: `http://localhost:8080/api/sessions/githubcallback`
    }, async (accesToken, refreshToken, profile, done) =>{
        try{
            console.log(profile);
            let user = await userModel.findOne({email:profile._json.email})
            if(!user){

                const saltRounds = 10; 
                const hashedPassword = await bcrypt.hash(profile.id, saltRounds);

                let newUser = {
                    first_name: profile._json.name,
                    last_name:``,
                    age: 18,
                    email: profile._json.email,
                    password: hashedPassword
                }
                let result = await userModel.create(newUser);
               done(null, result);
            }
            else{
                done(null, user);
            }
        }catch(error){
            return done(error);
        }
    }))
};

export default initializePassport;