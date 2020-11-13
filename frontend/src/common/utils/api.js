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
    const response = await axios.get(`${Config.API.GET_ISSUES}?${query}`);
    return response;
};

const postLabel = async (data) => {
    const response = await axios.post(Config.API.LABLE, data);
    return response;
};

const putLabel = async (id, data) => {
    const response = await axios.put(`${Config.API.LABLE}/${id}`, data);
    return response;
};

const deleteLabel = async (id) => {
    const response = await axios.delete(`${Config.API.LABLE}/${id}`);
    return response;
};

const getIssueById = async (issueId) => {
    const response = await axios.get(`${Config.API.GET_ISSUE}/${issueId}`);
    return response?.data?.issue;
};

const getMilestone = async (milestoneId) => {
    const response = await axios.get(`${Config.API.MILESTONE}/${milestoneId}`);
    return response;
};

const getMilestones = async () => {
    const response = await axios.get(`${Config.API.MILESTONE}`);
    return response;
};

const postMilestone = async (data) => {
    const response = await axios.post(Config.API.MILESTONE, data);
    return response;
};

const patchMilestone = async (milestoneId, data) => {
    const response = await axios.patch(`${Config.API.MILESTONE}/${milestoneId}`, data);
    return response;
};

const deleteMilestone = async (milestoneId) => {
    const response = await axios.delete(`${Config.API.MILESTONE}/${milestoneId}`);
    return response;
};

export {
    postLogin,
    postSignup,
    getLabels,
    postLabel,
    putLabel,
    deleteLabel,
    getIssueById,
    getIssues,
    getMilestone,
    getMilestones,
    postMilestone,
    patchMilestone,
    deleteMilestone
};
