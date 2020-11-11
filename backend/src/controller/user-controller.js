import { UserService } from "../service";
import { USER_TYPE } from "../common/type";

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
        const { type } = req.query;
        const userService = UserService.getInstance();

        let users;
        switch (type) {
            case USER_TYPE.AUTHUOR:
                users = await userService.getAuthors();
                break;
            case USER_TYPE.ASSIGNEE:
                users = await userService.getAssignees();
                break;
            default:
                users = await userService.getUsers();
        }

        const jsonData = users.reduce((acc, cur) => acc.concat({ id: cur.id, name: cur.name }), []);
        res.status(200).json({ users: jsonData });
    } catch (error) {
        next(error);
    }
};

export { sendUserInfo, sendUsers };
