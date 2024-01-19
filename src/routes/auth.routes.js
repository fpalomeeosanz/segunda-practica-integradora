import { Router } from "express";
import userModel from "../dao/models/user.model.js";

const router = Router();

//POST REG
router.post("/register", (req, res) => {
    
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send("Debes proporcionar todos los datos necesarios");
    }

    
    const user = new userModel({
        username,
        email,
        password,
    });

    
    user.save((err) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.redirect("/");
    });
});

//GET LOGOUT
router.get("/logout", (req, res) => {
    
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.redirect("/");
    });
});

//POST LOGIN
router.post("/login", (req, res) => {
    
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send("Hola! Escribe todos los datos necesarios para iniciar sesión.");
    }

    const user = userModel.findOne({ username }); 
    if (!user || user.password !== password || user.role !== "admin") {
        return res.status(401).send("Credenciales incorrectas");
    }

    req.session.user = user._id;

    res.redirect("/products");
});

export { router as authRouter }
