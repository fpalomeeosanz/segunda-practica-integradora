import express from "express";
import mongoose from "mongoose";
import handlebars  from "express-handlebars";

import  { __dirname }  from "./utils.js";

import userRoutes from "./routes/users.routes.js";
import { viewRouter } from "./routes/views.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { productRouter } from "./routes/product.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { sessionsRouter } from "./routes/sessions.routes.js";

import passport from "passport";
import { initializePassport } from "../config/passport.config.js";
import session from "express-session";

import MongoStore from "connect-mongo";
import { options } from "../config/config.js";
import  dotenv  from "dotenv";
import { generateToken, authToken } from "./JWT.utils.js"

const users = [];

dotenv.config();

const MONGO = process.env.MONGO;
const connection = mongoose.connect(MONGO).then(() => console.log("MongoDB connected successfully!"))
.catch((err) => console.error("MongoDB connection error:", err));

const PORT = options.server.port;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));



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

initializePassport();
app.use(session({
    store: MongoStore.create({
        mongoUrl: options.mongo.url
    }),
    secret:"fpalomerosanz",
    resave:false,
    saveUninitialized:false
}));


app.use(passport.initialize());
app.use("/api/sessions", sessionsRouter);



