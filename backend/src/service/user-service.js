import { getRepository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { User } from "../model/user";
import { crypto } from "../common/lib";
import { EntityAlreadyExist } from "../common/error/entity-already-exist";

class UserService {
    constructor() {
        this.userRepository = getRepository(User);
        this.defaultProfileImage = "https://pbs.twimg.com/profile_images/977835673511084032/xXA979th.jpg";
    }

    static instance = null;

    static getInstance() {
        if (UserService.instance === null) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    createUser({ email, name, password, profileImage = this.defaultProfileImage }) {
        const newUser = new User();
        newUser.email = email;
        newUser.name = name;
        newUser.password = password;
        newUser.profileImage = profileImage;

        return newUser;
    }

    async isUserExistByEmail({ email }) {
        const user = await this.getUserByEmail(email);
        return user === undefined;
    }

    async isUserExistByName({ name }) {
        const user = await this.getUserByName(name);
        return user === undefined;
    }

    async getUserByEmail(useremail) {
        const user = await this.userRepository.findOne({ email: useremail });
        return user;
    }

    async getUserByName(username) {
        const user = await this.userRepository.findOne({ name: username });
        return user;
    }

    @Transactional()
    async signup(newUser) {
        const { email, name, password } = newUser;

        if (!(await this.isUserExistByEmail({ email })) || !(await this.isUserExistByName({ name }))) {
            throw new EntityAlreadyExist();
        }

        newUser.password = await crypto.encrypt(password);
        const result = await this.userRepository.save(newUser);
    }

    async signupWithGitHub(profile) {
        const user = await this.getUserByName(profile.username);

        if (user !== undefined) {
            return user;
        }

        const { username, photos } = profile;
        const newUser = this.userRepository.create({ email: `${username}@github.com`, name: username, profileImage: photos[0].value });
        await this.userRepository.save(newUser);

        return newUser;
    }
}

export { UserService };
