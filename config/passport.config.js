import passport from "passport";
import GitHubStrategy from "passport-github2";
import userModel from "../src/dao/models/user.model.js";

const InitializePassport = () => {

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });
}

export default InitializePassport;