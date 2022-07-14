import {Constants} from "../constants";
/// #if !BROWSER
import {shell} from "electron";
import {dialog} from "@electron/remote";
/// #endif
import {isBrowser} from "../util/functions";
import {fetchPost} from "../util/fetch";
import {setAccessAuthCode} from "./util";
import {exportLayout} from "../layout/util";
import {exitSiYuan} from "../dialog/processSystem";
import {writeText} from "../protyle/util/compatibility";
import {showMessage} from "../dialog/message";
import {Dialog} from "../dialog";
import msg from "../util/msg";

export const publish = {
    element: undefined as Element,
    genHTML: () => {
        return `
<div class="b3-label">
    ${window.siyuan.languages.publishPlatform}
    <div class="b3-label__text b3-typography">
        ${window.siyuan.languages.publishTip1}
    </div>
</div>
<div class="b3-label">
    <div class="b3-label__text fn__flex" style="padding: 4px 0 4px 4px;">
        <div class="b3-label__text">${window.siyuan.languages.platformCnblogs}</div>
        <span class="fn__space"></span>
        <input id="cnblogsPublishApiUrl" placeholder="Endpoint" class="b3-text-field fn__flex-1 fn__block" value="${window.siyuan.config.terwer.publish.cnblogsPublishApiUrl}"/>
        <span class="fn__space"></span>
        <input id="cnblogsPublishUsername" placeholder="Username" class="b3-text-field fn__flex-1 fn__block" value="${window.siyuan.config.terwer.publish.cnblogsPublishUsername}"/>
        <span class="fn__space"></span>
        <input id="cnblogsPublishPassword" type="password" placeholder="Password/token" class="b3-text-field fn__flex-1 fn__block" value="${window.siyuan.config.terwer.publish.cnblogsPublishPassword}"/>
    </div>
</div>
<div class="b3-label">
    <div class="b3-label__text fn__flex" style="padding: 4px 0 4px 4px;">
        <div class="b3-label__text">${window.siyuan.languages.platformConf}</div>
    </div>
</div>
<div class="b3-label">
    <button id="publishConfim" class="b3-button b3-button--outline fn__block">${window.siyuan.languages.confirm}</button>
</div>
`;
    },
    bindEvent: () => {
        /// #if !BROWSER
        publish.element.querySelectorAll('[data-type="open"]').forEach(item => {
            item.addEventListener("click", () => {
                const url = item.getAttribute("data-url");
                if (url.startsWith("http")) {
                    shell.openExternal(url);
                } else {
                    shell.openPath(url);
                }
            });
        });
        /// #endif

        publish.element.querySelector("#publishConfim").addEventListener("click", () => {
            fetchPost("/api/terwer/setPublish", {
                cnblogsPublishApiUrl: (publish.element.querySelector("#cnblogsPublishApiUrl") as HTMLInputElement).value,
                cnblogsPublishUsername: (publish.element.querySelector("#cnblogsPublishUsername") as HTMLInputElement).value,
                cnblogsPublishPassword: (publish.element.querySelector("#cnblogsPublishPassword") as HTMLInputElement).value
            }, () => {
                // msg.successMsg("success");
            });
        });
    }
};
