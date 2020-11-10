import axios from "axios";
import Config from "@config";

const waitAuthorizationApi = async () => {
    const userInfo = await axios.get(Config.API.GET_AUTH, { withCredentials: true });
    return userInfo;
};

export default waitAuthorizationApi;
