import passport from "passport";
import userModel from "../src/dao/models/user.model.js";
import currentStrategy from "../strategy.current.js";

const InitializePassport = () => {

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });

    passport.use(currentStrategy);
};

export default InitializePassport;

