import axios from "axios";
import Config from "@config";

const getLogin = async (email, password) => {
    const response = await axios.post(Config.API.POST_LOGIN, { email, password }, { withCredentials: true });
    return response;
};

export { getLogin };
