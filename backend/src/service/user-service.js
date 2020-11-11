import { getRepository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { User } from "../model/user";
import { crypto } from "../common/lib";
import { EntityAlreadyExist } from "../common/error/entity-already-exist";
import { EntityNotFoundError } from "../common/error/entity-not-found-error";
import { BadRequestError } from "../common/error/bad-request-error";

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

    async getUsers() {
        const users = await this.userRepository.find();
        return users;
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
    async signup({ email, name, password }) {
        const promises = [];
        promises.push(this.isUserExistByEmail({ email }));
        promises.push(this.isUserExistByName({ name }));

        const [isEmailExist, isNameExist] = await Promise.all(promises);
        if (!isEmailExist || !isNameExist) {
            throw new EntityAlreadyExist();
        }

        const encryptedPassword = await crypto.encrypt(password);
        const newUser = this.userRepository.create({ email, name, password: encryptedPassword, profileImage: this.defaultProfileImage });

        await this.userRepository.save(newUser);
    }

    @Transactional()
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

    async authenticate({ email, password }) {
        const user = await this.userRepository.findOne({ email });

        if (!user) throw new EntityNotFoundError();
        if (!(await crypto.compare(password, user.password))) throw new BadRequestError();

        return user;
    }
}

export { UserService };
