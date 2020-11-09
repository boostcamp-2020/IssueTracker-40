import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
const PIPE = (f, g) => (x, y) => g(y, f(x));

const encrypt = (data) => {
    const genSalt = (rounds) => bcrypt.genSaltSync(rounds);
    const hash = (data, salt) => bcrypt.hashSync(data, salt);

    return PIPE(genSalt, hash)(SALT_ROUNDS, data);
};

const compare = (data, hash) => bcrypt.compareSync(data, hash);

module.exports = {
    encrypt,
    compare
};
