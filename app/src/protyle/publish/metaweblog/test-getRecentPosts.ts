import metaWeblogApiClient from "./metaweblog-api-client";
import PUBLISH_TYPE_CONSTANTS from "../util";

const metaWeblogApi = metaWeblogApiClient(PUBLISH_TYPE_CONSTANTS.API_TYPE_WORDPRESS);

export function testGetRecentPostsWithExampleData() {
    const result = metaWeblogApi.getRecentPosts(10);

    result.then(function (posts) {
        console.log("metaweblog get recent posts=>", posts);
    });
}