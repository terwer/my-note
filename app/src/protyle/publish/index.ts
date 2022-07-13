import {fetchPost} from "../../util/fetch";
import {lockFile} from "../../dialog/processSystem";
import {hideMessage, showMessage} from "../../dialog/message";
import {PrintToPDFOptions} from "electron";
import PUBLISH_TYPE_CONSTANTS, {getApiParams} from "./util";
import wordpress_compatible from "./wordpress/lib/wordpress-compatible"

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

    wordpressApi_getPosts();

    fetchPost("/api/attr/setBlockAttrs", {
        "id": id,
        "attrs": customAttr
    }, (response) => {
        const newmeta = response;
        console.log("doPublish customAttr=>", customAttr);
        // console.log("doPublish content=>", content);
    });
};

async function wordpressApi_getPosts() {
    const client = wordpress_compatible.createClient({
        url: "http://localhost:8000/xmlrpc.php",
        username: "terwer",
        password: "123456"
    });

    console.log("starting...")
    const filter = {
        // post_type:"", // post,page 文章类型
        // post_status:"", // publish 文章状态
        number: 10,// 获取的文章数量，此例中显示的是10篇文章
        offset:0,// 从默认顺序里的第几篇文章开始获取，默认是0，就是从头开始，如果要从第二篇，就可以将此参数修改成为1，这个参数适用于文章分列，或者首篇文章不同于其他文章显示
        orderby: "date", //排序规则，此例为按照时间顺序，默认也是时间顺序
        // s:"java",
        order: "desc" // 'ASC'升序，'DESC' 降序
    }
    const fields = ["id", "title", "name", "date"]
    client.getPosts(filter, fields, function (error: any, posts: any) {
        if (error) {
            console.log("An error occurred:", error)
            return
        }
        console.log("Found " + posts.length + " posts!");
        console.log(posts)
    });
}

async function metaweblogApi() {

}