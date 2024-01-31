import passport from "passport";
import cookieExtractor from "passport-cookie";
import userModel from "../src/dao/models/user.model.js";

const currentStrategy = new passport.Strategy({
    
    name: "current",
    extractor: cookieExtractor({
        name: "token",
    }),

    validate: async (token, done) => {
        
        const user = await userModel.findOne({
            token,
        });

        if (!user) {
            return done(new Error("El token no es válido"));
        }
        
        return done(null, user);
    },
});

export default currentStrategy;
