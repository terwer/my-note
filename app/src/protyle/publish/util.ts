const API_TYPE_CNBLPGS = "cnblogs";
const API_TYPE_WORDPRESS = "wordpress";
const API_TYPE_CONFLUENCE = "confluence";
const API_TYPE_JVUE = "jvue";

const CNBLOGS_API_URL = "https://rpc.cnblogs.com/metaweblog/tangyouwei";
const WORDPRESS_API_URL = "https://terwergreen.wordpress.com/xmlrpc.php";
const CONFLUENCE_API_URL = "https://xmlrpc.terwergreen.com/api/xmlrpc";
const JVUE_API_URL = "http://v4.terwergreen.com:8002/xmlrpc";

const PUBLISH_TYPE_CONSTANTS = {
    API_TYPE_CNBLPGS,
    API_TYPE_WORDPRESS,
    API_TYPE_CONFLUENCE,
    API_TYPE_JVUE
};

export function getApiParams(apiType: string) {
    // ==================
    // 修改这个切换api
    // ==================
    // cnblogs
    let API_URL = CNBLOGS_API_URL;
    let appKey = "cnblogs";
    let username = "";
    let password = "";

    // wordpress
    if (API_TYPE_WORDPRESS == apiType) {
        API_URL = WORDPRESS_API_URL;
        appKey = "wordpress";
        username = "";
        password = "";
    }

    // confluence
    if (API_TYPE_CONFLUENCE == apiType) {
        API_URL = CONFLUENCE_API_URL;
        appKey = "confluence";
        username = "";
        password = "";
    }

    // jvue
    if (API_TYPE_JVUE == apiType) {
        API_URL = JVUE_API_URL;
        appKey = "jvue";
        username = "";
        password = "";
    }

    return {
        API_URL,
        appKey,
        username,
        password
    };
}

export default PUBLISH_TYPE_CONSTANTS;