import { UserService } from "../service";
import { tokenGenerator } from "../common/lib";

const signup = async (req, res, next) => {
    try {
        const { email, name, password } = req.body;
        const userService = UserService.getInstance();
        await userService.signup({ email, name, password });
        res.status(200).send("ok");
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userService = UserService.getInstance();
        const user = await userService.authenticate({ email, password });

        const token = tokenGenerator.generateJWTToken({
            userId: user.id,
            username: user.name,
            email: user.email,
            photos: user.profileImage
        });

        const EXPIRED_DATE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        res.cookie("token", token, { expires: EXPIRED_DATE, httpOnly: true });
        res.status(200).send("ok");
    } catch (e) {
        next(e);
    }
};

const logout = (req, res) => {
    res.clearCookie("token").send("ok");
};

export { signup, login, logout };
