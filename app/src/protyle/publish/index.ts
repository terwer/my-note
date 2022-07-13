import {fetchPost} from "../../util/fetch";
import {lockFile} from "../../dialog/processSystem";
import {hideMessage, showMessage} from "../../dialog/message";
import {PrintToPDFOptions} from "electron";
import PUBLISH_TYPE_CONSTANTS, {getApiParams} from "./util";
import metaWeblogApiClient from "./metaweblog/metaweblog-api-client";
import wordpressApiClient from "./wordpress/wordpress-api-client";

// publishMdContent
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
export const publishHTMLContent = (id: string, type: string, meta: any) => {
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
    console.log("doPublish apiParams=>", apiParams);

    // 设置自定义属性
    const postidKey = apiParams.postidKey;
    const customAttr = {
        "custom-slug": "",
        "custom-vuepress-slug": "",
        [postidKey]: "99999",
    };

    const wordpressApi = wordpressApiClient(PUBLISH_TYPE_CONSTANTS.API_TYPE_WORDPRESS);
    const result2 = wordpressApi.getPosts(10);
    // @ts-ignore
    result2.then(function (reslove: any, reject: any) {
        console.log("wordpress getPosts=>", reslove);
    });

    const metaWeblogApi = metaWeblogApiClient(PUBLISH_TYPE_CONSTANTS.API_TYPE_WORDPRESS);
    const result = metaWeblogApi.getRecentPosts(10);
    result.then(function (posts) {
        console.log("metaweblog get recent posts=>", posts);
    });

    fetchPost("/api/attr/setBlockAttrs", {
        "id": id,
        "attrs": customAttr
    }, (response) => {
        const newmeta = response;
        console.log("doPublish customAttr=>", customAttr);
        // console.log("doPublish content=>", content);
    });
};