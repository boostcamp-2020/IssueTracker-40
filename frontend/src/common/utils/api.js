import axios from "axios";
import Config from "@config";
import * as qs from "querystring";

const postLogin = async (email, password) => {
    const response = await axios.post(Config.API.POST_LOGIN, { email, password }, { withCredentials: true });
    return response;
};

const postSignup = async (email, name, password) => {
    const response = await axios.post(Config.API.POST_SIGNUP, { email, name, password }, { withCredentials: true });
    return response;
};

const getIssues = async ({ page }) => {
    const query = qs.stringify({
        page
    });
    const response = await axios.get(`${Config.API.GET_ISSUES}?${query}`, { withCredentials: true });
    return response;
};

export { postLogin, postSignup, getIssues };
