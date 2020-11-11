import { UserService } from "../service";
import { tokenGenerator } from "../common/lib";

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
        res.send("ok");
    } catch (e) {
        next(e);
    }
};

const logout = (req, res) => {
    res.clearCookie("token").send("ok");
};

export { login, logout };
