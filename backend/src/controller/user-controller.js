import { UserService } from "../service";

const sendUserInfo = (req, res, next) => {
    const { user } = req;
    res.status(200).send({
        name: user.name,
        email: user.email,
        photoImage: user.profileImage
    });
};

const sendUsers = async (req, res, next) => {
    try {
        const userService = UserService.getInstance();
        const users = await userService.getUsers();

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export { sendUserInfo, sendUsers };
