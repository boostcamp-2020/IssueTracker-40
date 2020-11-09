import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const encrypt = async (data) => {
    const genSalt = async (rounds) => await bcrypt.genSalt(rounds);
    const hash = async (data, salt) => await bcrypt.hash(data, salt);

    return await hash(data, await genSalt(SALT_ROUNDS));
};

const compare = async (data, hash) => await bcrypt.compare(data, hash);

module.exports = {
    encrypt,
    compare
};
