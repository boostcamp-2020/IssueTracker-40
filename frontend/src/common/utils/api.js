import axios from "axios";
import Config from "@config";

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

export { postLogin, postSignup, getLabels, postLabel, putLabel, deleteLabel };
