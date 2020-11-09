import { validate } from "class-validator";
import { BadRequestError } from "../common/error/bad-request-error";
import { UserService } from "../service";

const validateSignupParam = async (req, res, next) => {
    const { email, name, password } = req.body;
    const userService = UserService.getInstance();
    const newUser = userService.createUser({ email, name, password });

    const error = await validate(newUser);
    if (error.length > 0) {
        next(new BadRequestError());
        return;
    }
    req.newUser = newUser;
    next();
};

const signup = async (req, res, next) => {
    try {
        const userService = UserService.getInstance();
        await userService.signup(req.newUser);
        res.status(200).send("ok");
    } catch (error) {
        next(error);
    }
};

export { validateSignupParam, signup };
