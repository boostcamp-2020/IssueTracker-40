import axios from "axios";
import Config from "@config";
import * as qs from "querystring";

axios.defaults.withCredentials = true;

const postLogin = async (email, password) => {
    const response = await axios.post(Config.API.POST_LOGIN, { email, password });
    return response;
};

const getLogout = async () => {
    const response = await axios.get(Config.API.GET_LOGOUT);
    return response;
};

const postSignup = async (email, name, password) => {
    const response = await axios.post(Config.API.POST_SIGNUP, { email, name, password });
    return response;
};

const getLabels = async () => {
    const response = await axios.get(Config.API.POST_ISSUE);
    return response;
};

const getIssues = async ({ page, q }) => {
    const query = qs.stringify({
        page,
        q
    });
    // const response = await axios.get(`https://api.mocki.io/v1/d1aa3d04`);
    const response = await axios.get(`${Config.API.GET_ISSUES}?${query}`, { withCredentials: true });
    return response?.data?.issues;
};

const postIssue = async ({ title, content }) => {
    const response = await axios.post(Config.API.POST_ISSUE, { title, content }, { withCredentials: true });
    return response;
};

const patchIssue = async ({ issueId, title, content, state }) => {
    const response = await axios.patch(`${Config.API.POST_ISSUE}/${issueId}`, { title, content, state }, { withCredentials: true });
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

export { postLogin, getLogout, postSignup, getLabels, postLabel, patchLabel, deleteLabel, getIssueById, getIssues, postIssue, patchIssue };
