import express from "express";
import mongoose from "mongoose";
import handlebars  from "express-handlebars";

import __dirname from "./utils.js";

import userRoutes from "./routes/users.routes.js";
import { viewRouter } from "./routes/views.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { productRouter } from "./routes/product.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { sessionsRouter } from "./routes/sessions.routes.js";

import passport from "passport";
import InitializePassport from "../config/passport.config.js";
import session from "express-session";

import { generateToken, authToken } from "../JWT.utils.js"

const MONGO = "mongodb+srv://fpalomerosanz:fpalomerosanz@cluster0.xx4eski.mongodb.net/PracticaIntegradora";
const connection = mongoose.connect(MONGO);

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PRIVATE_KEY = "KEY_TestPalomeroJWT";
const users = [];

app.post(`/register`, (req,res) => {

    const {name, email, password} = req.body;
    const exists = users.find(user => user.email === email);
    if(exists) return res.status(400).send({status:"error", error: "User alredy exists"});

    const user = {
        name,
        email,
        password
    }
    users.push(user);
    const access_token = generateToken(user);
    res.send({status:"success", access_token})
})
app.post(`/login`, (req,res) => {

    const {email, password} = req.body;
    const user = users.find(user => user.email === email && user.password === password);
    if(!user) return res.status(400).send({staus:"error", error: "Invalid crdentials"});

    const access_token = generateToken(user);
    res.send({status:"success", access_token});
})
app.get(`/current`, authToken, (req,res) => {
    res.send({status:"success", payload:req.user});
})

const httpServer = app.listen(PORT, () =>{
    console.log(`Servidor funcionado en el puerto:${PORT}`);
})
 
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(`${__dirname}/public`));

app.use("/", viewRouter);
app.use("/auth", authRouter);
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);

InitializePassport();
app.use(session({
    secret: "56881637e9a2a221631a807f39594c71724c73af" 
}));
app.use(passport.initialize());
app.use("/api/sessions", sessionsRouter);



