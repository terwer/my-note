import {getApiParams} from "../util";

const MetaWeblog = require("metaweblog-api");

const metaWeblogApiClient = (type: any) => {
    const apiParams = getApiParams(type);
    const metaWeblog = new MetaWeblog(apiParams.API_URL);

    /**
     * getRecentPosts
     * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getRecentPosts
     *
     * @returns {Promise<MetaWeblog.Post[]>}
     */
    async function getRecentPosts(numberOfPosts: number) {
        const data = await metaWeblog.getRecentPosts(apiParams.appKey, apiParams.username, apiParams.password, numberOfPosts);
        return data;
    }

    return {
        getRecentPosts
    };
};

export default metaWeblogApiClient;