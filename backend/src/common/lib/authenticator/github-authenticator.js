import * as rs from "randomstring";
import * as qs from "querystring";
import { Strategy as GitHubStrategy } from "passport-github";
import { generateJWTToken } from "../token-generator";
import { UserService } from "../../../service";
import { ForbiddenError } from "../../error/forbidden-error";
import passport from "./passport";

const setStrategy = () => {
    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: process.env.GITHUB_CLIENT_CALLBACK_URL
            },
            async (accessToken, refreshToken, profile, cb) => {
                const userService = new UserService();
                await userService.signupWithGitHub(profile);

                const token = generateJWTToken({
                    username: profile.username,
                    email: `${profile.username}@github.com`,
                    photos: profile.photos[0].value
                });

                return cb(null, token);
            }
        )
    );
};

const redirectToGithub = (req, res, next) => {
    const randomStr = rs.generate();
    const url = process.env.GITHUB_USER_AUTH_REDIRECT_URL;
    const query = qs.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        redirect_uri: process.env.GITHUB_CLIENT_CALLBACK_URL,
        state: randomStr,
        scope: "user:email"
    });

    req.session.state = randomStr;
    res.redirect(url + query);
};

const validateState = (req, res, next) => {
    if (req.query.state !== req.session.state) {
        next(new ForbiddenError());
    }
    req.session.destroy();
    next();
};

const sendTokenToClient = (req, res, next) => {
    return passport.authenticate(
        "github",
        {
            sessions: false
        },
        (error, token) => {
            const EXPIRED_DATE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            if (token) res.cookie("token", token, { expires: EXPIRED_DATE, httpOnly: true });
            res.redirect(process.env.ISSUE_TRACKER_CLIENT_URL);
        }
    )(req, res, next);
};

export { setStrategy, redirectToGithub, validateState, sendTokenToClient };
