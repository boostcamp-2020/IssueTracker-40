import { validate } from "class-validator";
import { BadRequestError } from "../common/error/bad-request-error";
import { UserService } from "../service";
import { EntityAlreadyExist } from "../common/error/entity-already-exist";

const validateSignupParam = async (req, res, next) => {
    const { email, name, password } = req.body;
    const userService = new UserService();
    const newUser = userService.createUser({ email, name, password });

    const error = await validate(newUser);
    if (error.length > 0) {
        next(new BadRequestError());
        return;
    }
    req.newUser = newUser;
    next();
};

const checkUserSignedUp = async (req, res, next) => {
    const { email, name } = req.newUser;
    const userService = new UserService();

    if (!(await userService.isUserExistByEmail({ email })) || !(await userService.isUserExistByName({ name }))) {
        next(new EntityAlreadyExist());
        return;
    }
    next();
};

const signup = async (req, res, next) => {
    const userService = new UserService();
    await userService.signup(req.newUser);
    res.status(200).send("");
};

export { validateSignupParam, checkUserSignedUp, signup };
