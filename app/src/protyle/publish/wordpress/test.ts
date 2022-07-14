// See doc
// https://codex.wordpress.org/XML-RPC_WordPress_API
// https://developer.wordpress.org/apis/handbook/xml-rpc/

// See also
// https://codex.wordpress.org/WordPress_APIs

import PUBLISH_TYPE_CONSTANTS from "../util";
import wordpressApiClient from "./wordpress-api-client";

const wordpressApi = wordpressApiClient(PUBLISH_TYPE_CONSTANTS.API_TYPE_WORDPRESS);
const result2 = wordpressApi.getPosts(10);
// @ts-ignore
result2.then(function (reslove: any, reject: any) {
    if(reject){
        console.log("wordpress getPosts error=>", reject);
        return;
    }
    console.log("wordpress getPosts=>", reslove);
});