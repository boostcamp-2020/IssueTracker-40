import axios from "axios";
import Config from "@config";

const postLogin = async (email, password) => {
    const response = await axios.post(Config.API.POST_LOGIN, { email, password }, { withCredentials: true });
    return response;
};

export { postLogin };
