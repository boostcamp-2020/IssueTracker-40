import axios from "axios";
import Config from "@config";
import * as qs from "querystring";

axios.defaults.withCredentials = true;

const postLogin = async (email, password) => {
    const response = await axios.post(Config.API.POST_LOGIN, { email, password });
    return response;
};

const postSignup = async (email, name, password) => {
    const response = await axios.post(Config.API.POST_SIGNUP, { email, name, password });
    return response;
};

const getLabels = async () => {
    const response = await axios.get(Config.API.LABLE);
    return response;
};


const getIssues = async ({ page }) => {
    const query = qs.stringify({
        page
    });
    const response = await axios.get(`${Config.API.GET_ISSUES}?${query}`, { withCredentials: true });
    return response;
};

const postLabel = async (data) => {
    const response = await axios.post(Config.API.LABLE, data);
    return response;
};

const patchLabel = async (id) => {
    const response = await axios.post(`${Config.API.LABLE}/${id}`);
    return response;
};

const deleteLabel = async (id) => {
    const response = await axios.post(`${Config.API.LABLE}/${id}`);
    return response;
};

const getIssueById = async (issueId) => {
    const response = await axios.get(`${Config.API.GET_ISSUE}/${issueId}`);
    return response?.data?.issue;
};

export { postLogin, postSignup, getLabels, postLabel, patchLabel, deleteLabel, getIssueById, getIssues };
