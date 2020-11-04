import jwt from 'jsonwebtoken';

const generateJWTToken = (payload, options = {
    expiresIn: '7d',
    issuer: 'issueTracker.com',
    subject: 'userInfo'
}) => jwt.sign(payload, process.env.JWT_SECRET, options);

export {
    generateJWTToken
}
