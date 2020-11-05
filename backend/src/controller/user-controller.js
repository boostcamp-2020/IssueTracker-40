const sendUserInfo = (req, res, next) => {
    const { user } = req;
    res.status(200).send({
        name: user.name,
        email: user.email,
        photoImage: user.profileImage
    });
};

export { sendUserInfo };
