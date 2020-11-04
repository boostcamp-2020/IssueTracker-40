import express from "express";
import {authenticator} from "../common/lib"

const passport = authenticator.getPassport();
const router = express.Router();

router.get("/oauth/github", passport.authenticate("github"));

router.get("/oauth/github/login",
    (req, res, next)=>{
        console.log('callbackQuery', req.query);
        next();
    },
    (req, res) =>
        passport.authenticate("github", {
            sessions: false
        }, (error, token) => {
            if (token) res.cookie('token', token);
            res.redirect('http://localhost:5500');
        })(req, res)
);


export default router ;
