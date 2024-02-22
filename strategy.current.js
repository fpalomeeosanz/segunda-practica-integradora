import { Strategy as CookieStrategy } from "passport-cookie";
import userModel from "./src/dao/models/user.model.js";

const currentStrategy = new CookieStrategy(
  {
    cookieName: "token",
  },
  async (token, done) => {
    try {
      const user = await userModel.findOne({ token });
      if (!user) {
        return done(new Error("Invalid token"));
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

export default currentStrategy;