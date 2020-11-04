import { getRepository } from "typeorm";
import { User } from "../model/user";

const findByUserName = async (userName) => {
    const userRepository = getRepository(User);
    const user = await userRepository.find({ name: userName });
    return user;
};

const findOrCreate = async (profile) => {
    const userRepository = getRepository(User);
    const user = await findByUserName(profile.username);

    if (user.length === 0) {
        const newUser = new User();
        newUser.email = `${profile.username}@github.com`;
        newUser.name = profile.username;
        await userRepository.save(newUser);
    }
};

export { findOrCreate, findByUserName };
