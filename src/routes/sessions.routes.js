import { Router } from "express";
import passport from "passport";

const router = Router();

//GET
router.get(`/http://localhost:8080`,passport.authenticate(`github`, {scope:[`user:email`]}), async(req,res) => {
    
});

router.get(`http://localhost:8080/api/sessions/githubcallback`, passport.authenticate(`github`, {failureRedirect: `/login`}),async(req,res) => {
    req.session.user = req.user;
    res.redirect(`/`)
});


export {router as sessionsRouter};