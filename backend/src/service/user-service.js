import { getRepository } from "typeorm";
import { User } from "../model/user";

class UserService {
    constructor() {
        this.userRepository = getRepository(User);
    }

    async getUserByName(username) {
        const user = await this.userRepository.findOne({ name: username });
        return user;
    }

    async signup(profile) {
        const user = await this.getUserByName(profile.username);

        if (!user) {
            const newUser = new User();
            newUser.email = `${profile.username}@github.com`;
            newUser.name = profile.username;
            newUser.profileImage = profile.photos[0].value;
            await this.userRepository.save(newUser);
        }
    }
}

export { UserService };
