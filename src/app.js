import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";

import __dirname from "./utils.js";

import userRoutes from "./routes/users.routes.js";
import viewRoutes from "./routes/views.router.js";
import { cartRouter } from "./routes/cart.routes.js";
import { productRouter } from "./routes/product.routes.js";

const MONGO = "mongodb+srv://fpalomerosanz:fpalomerosanz@cluster0.xx4eski.mongodb.net/PracticaIntegradora";
const connection = mongoose.connect(MONGO);

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const httpServer = app.listen(PORT, () =>{
    console.log(`Servidor funcionado en el puerto:${PORT}`);
})
 
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(`${__dirname}/public`));


app.use("/api/users", userRoutes);
app.use("/", viewRoutes);
app.use("api/carts", cartRouter);
app.use("api/products", productRouter);