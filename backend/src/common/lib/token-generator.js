import jwt from "jsonwebtoken";

const generateJWTToken = (
    payload,
    options = {
        expiresIn: process.env.JWT_OPTION_TOKEN_EXPIRES_IN,
        issuer: process.env.JWT_OPTION_TOKEN_ISSUER,
        subject: process.env.JWT_OPTION_TOKEN_SUBJECT
    }
) => jwt.sign(payload, process.env.JWT_SECRET, options);

export { generateJWTToken };
