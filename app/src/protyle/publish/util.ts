const API_TYPE_CNBLPGS = "cnblogs";
const API_TYPE_WORDPRESS = "wordpress";
const API_TYPE_CONFLUENCE = "confluence";
const API_TYPE_JVUE = "jvue";
const API_TYPE_YUQUE = "yuque";
const API_TYPE_WECHAT = "wechat";
const API_TYPE_LIANDI = "liandi";

const CNBLOGS_API_URL = "https://rpc.cnblogs.com/metaweblog/tangyouwei";
const WORDPRESS_API_URL = "http://localhost:8000/xmlrpc.php";
const CONFLUENCE_API_URL = "https://xmlrpc.terwergreen.com/api/xmlrpc?t=conf";
const JVUE_API_URL = "http://v4.terwergreen.com:8002/xmlrpc";
const YUQUE_API_URL = "https://xmlrpc.terwergreen.com/api/xmlrpc?t=yuque";
const WECHAT_API_URL = "https://xmlrpc.terwergreen.com/api/xmlrpc?t=wechat";
const LIANDI_API_URL = "https://xmlrpc.terwergreen.com/api/xmlrpc?t=liandi";

const CNBLOGS_POSTID_KEY = "custom-cnblogs-post-id";
const WORDPRESS_POSTID_KEY = "custom-wordpress-post-id";
const CONFLUENCE_POSTID_KEY = "custom-conf-post-id";
const JVUE_POSTID_KEY = "custom-jvue-post-id";
const YUQUE_POSTID_KEY = "custom-yuque-post-id";
const WECHAT_POSTID_KEY = "custom-wechat-post-id";
const LIANDI_POSTID_KEY = "custom-liandi-post-id";

const PUBLISH_TYPE_CONSTANTS = {
    API_TYPE_CNBLPGS,
    API_TYPE_WORDPRESS,
    API_TYPE_CONFLUENCE,
    API_TYPE_JVUE,
    API_TYPE_YUQUE,
    API_TYPE_WECHAT,
    API_TYPE_LIANDI
};

export function getApiParams(apiType: string) {
    // ==================
    // 修改这个切换api
    // ==================
    // cnblogs
    let API_URL = window.siyuan.config.terwer.publish.cnblogsPublishApiUrl || CNBLOGS_API_URL;
    let appKey = API_TYPE_CNBLPGS;
    let username = window.siyuan.config.terwer.publish.cnblogsPublishUsername || "";
    let password = window.siyuan.config.terwer.publish.cnblogsPublishPassword || "";
    let postidKey = CNBLOGS_POSTID_KEY;

    // wordpress
    if (API_TYPE_WORDPRESS == apiType) {
        API_URL = WORDPRESS_API_URL;
        appKey = API_TYPE_WORDPRESS;
        username = "terwer";
        password = "123456";
        postidKey = WORDPRESS_POSTID_KEY;
    }

    // confluence
    if (API_TYPE_CONFLUENCE == apiType) {
        API_URL = CONFLUENCE_API_URL;
        appKey = "confluence";
        username = "";
        password = "";
        postidKey = CONFLUENCE_POSTID_KEY;
    }

    // jvue
    if (API_TYPE_JVUE == apiType) {
        API_URL = JVUE_API_URL;
        appKey = API_TYPE_JVUE;
        username = "";
        password = "";
        postidKey = JVUE_POSTID_KEY;
    }

    // yuque
    if (API_TYPE_YUQUE == apiType) {
        API_URL = YUQUE_API_URL;
        appKey = API_TYPE_YUQUE;
        username = "";
        password = "";
        postidKey = YUQUE_POSTID_KEY;
    }

    // wechat
    if (API_TYPE_WECHAT == apiType) {
        API_URL = WECHAT_API_URL;
        appKey = API_TYPE_WECHAT;
        username = "";
        password = "";
        postidKey = WECHAT_POSTID_KEY;
    }

    // liandi
    if (API_TYPE_LIANDI == apiType) {
        API_URL = LIANDI_API_URL;
        appKey = API_TYPE_LIANDI;
        username = "";
        password = "";
        postidKey = LIANDI_POSTID_KEY;
    }

    return {
        API_URL,
        appKey,
        username,
        password,
        postidKey
    };
}

export default PUBLISH_TYPE_CONSTANTS;