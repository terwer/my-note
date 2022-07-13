import PUBLISH_TYPE_CONSTANTS, {getApiParams} from "../util";

var MetaWeblog = require('metaweblog-api');

/**
 * getRecentPosts
 * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getRecentPosts
 *
 * @returns {Promise<MetaWeblog.Post[]>}
 */
export default async function getRecentPosts(numberOfPosts: number) {
    const apiParams = getApiParams(PUBLISH_TYPE_CONSTANTS.API_TYPE_WORDPRESS);
    const metaWeblog = new MetaWeblog(apiParams.API_URL);
    const data = await metaWeblog.getRecentPosts(apiParams.appKey, apiParams.username, apiParams.password, numberOfPosts);
    return data;
}

export function testGetRecentPostsWithExampleData() {
    const result = getRecentPosts(10);
    result.then(function (posts) {
        console.log("posts=>", posts);
    });
}