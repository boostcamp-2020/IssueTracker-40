import { Strategy as JwtStrategy } from "passport-jwt";
import passport from "./passport";
import { UserService } from "../../../service";
import { UnauthorizedError } from "../../error/unauthorized-error";

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.token;
    }
    return token;
};

const setStrategy = () => {
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: cookieExtractor,
                secretOrKey: process.env.JWT_SECRET
            },
            async (jwtPayload, done) => {
                try {
                    const userService = new UserService();
                    const user = await userService.getUserByName(jwtPayload.username);

                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                } catch (error) {
                    return done(error, false);
                }
            }
        )
    );
};

const validateAuthorization = (req, res, next) => {
    return passport.authenticate(
        "jwt",
        {
            sessions: false
        },
        (error, user) => {
            if (!user) {
                next(new UnauthorizedError());
            }
            req.user = user;
            next();
        }
    )(req, res, next);
};

export { setStrategy, validateAuthorization };
