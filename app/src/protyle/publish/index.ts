import {fetchPost} from "../../util/fetch";
import {lockFile} from "../../dialog/processSystem";
import {hideMessage, showMessage} from "../../dialog/message";
import {PrintToPDFOptions} from "electron";
import {getApiParams} from "./util";

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
            console.log("publishMdContent meta=>", meta);
            // console.log("publishMdContent md=>", content);
            doPublish(id, type, meta, content);
        }
    });
};

// publishHTMLContent
export const publishHTMLContent = (id: string, type: string, meta: any) => {
    publishMdContent(id, type, meta, function (meta: any, content: any) {
        const html = content;
        console.log("publishHTMLContent meta=>", meta);
        // console.log("publishHTMLContent md=>", content);
        doPublish(id, type, meta, content);
    });
};

const doPublish = (id: string, type: string, meta: any, content: any) => {
    console.log("doPublish meta before=>", meta);

    // 设置自定义属性
    const customAttr = {
        "custom-slug": "my-post",
        "custom-conf-post-id": "0",
        "custom-jvue-post-id": "0",
        "custom-cnblogs-post-id": "0",
        "custom-vuepress-slug": "my-post"
    };
    fetchPost("/api/attr/setBlockAttrs", {
        "id": id,
        "attrs": customAttr
    }, (response) => {
        const newmeta = response;
        console.log("doPublish customAttr=>", customAttr);
        // console.log("doPublish content=>", content);

        const apiParams = getApiParams(type);
        console.log("doPublish apiParams=>", apiParams);


    });
};