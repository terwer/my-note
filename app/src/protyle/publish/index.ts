import {fetchPost} from "../../util/fetch";
import {lockFile} from "../../dialog/processSystem";
import {hideMessage, showMessage} from "../../dialog/message";
import {PrintToPDFOptions} from "electron";
import PUBLISH_TYPE_CONSTANTS, {getApiParams} from "./util";
import metaWeblogApiClient from "./metaweblog/metaweblog-api-client";
import wordpressApiClient from "./wordpress/wordpress-api-client";
import msg from "../../util/msg";

// publishMdContent
// eslint-disable-next-line @typescript-eslint/ban-types
export const publishMdContent = (id: string, type: string, meta: any, callback: Function) => {
    const msgId = showMessage("publishing...", -1);
    fetchPost("/api/export/exportMdContent", {
        id,
    }, response => {
        // @ts-ignore
        hideMessage(msgId);
        const content = response.data.content;
        if (callback) {
            callback(meta, content);
        } else {
            // console.log("publishMdContent meta=>", meta);
            // console.log("publishMdContent md=>", content);
            doPublish(id, type, meta, content);
        }
    });
};

// publishHTMLContent
// eslint-disable-next-line @typescript-eslint/ban-types
export const publishHTMLContent = (id: string, type: string, meta: Function) => {
    publishMdContent(id, type, meta, function (meta: any, content: any) {
        const html = content;
        // console.log("publishHTMLContent meta=>", meta);
        // console.log("publishHTMLContent md=>", content);
        doPublish(id, type, meta, content);
    });
};

const doPublish = (id: string, type: string, meta: any, content: any) => {
    console.log("doPublish meta before=>", meta);

    const apiParams = getApiParams(type);
    console.log("doPublish apiParams=>", {
        "API_URL": apiParams.API_URL,
        "appKey": apiParams.appKey,
        "username": apiParams.username,
        "apiParams.postidKey": apiParams.postidKey
    });

    // 设置自定义属性
    const postidKey = apiParams.postidKey;
    const customAttr = {
        "custom-slug": "",
        "custom-vuepress-slug": "",
        [postidKey]: "99999",
    };

    // const wordpressApi = wordpressApiClient(PUBLISH_TYPE_CONSTANTS.API_TYPE_WORDPRESS);
    // const result2 = wordpressApi.getPosts(10);
    // // @ts-ignore
    // result2.then(function (reslove: any, reject: any) {
    //     console.log("wordpress getPosts=>", reslove);
    // });

    const metaWeblogApi = metaWeblogApiClient(PUBLISH_TYPE_CONSTANTS.API_TYPE_CNBLPGS);
    const result = metaWeblogApi.getRecentPosts(10);
    result.then(function (posts) {
        console.log("metaweblog get recent posts=>", posts);
        msg.alertMsg(window.siyuan.languages.successMsg);
    }).catch(function (e: any) {
        console.error(e);
        msg.alertMsg(window.siyuan.languages.errorMsg);
    });

    // fetchPost("/api/attr/setBlockAttrs", {
    //     "id": id,
    //     "attrs": customAttr
    // }, (response) => {
    //     const newmeta = response;
    //     console.log("doPublish customAttr=>", customAttr);
    //     // console.log("doPublish content=>", content);
    // });
};