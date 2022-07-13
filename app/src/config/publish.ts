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
import {confirmDialog} from "../dialog/confirmDialog";

export const publish = {
    element: undefined as Element,
    genHTML: () => {
        return `
<div class="b3-label">
    ${window.siyuan.languages.publishPlatform}
    <div class="b3-label__text b3-typography">
        ${window.siyuan.languages.publishTip1}
    </div>
    <div class="b3-label__text fn__flex" style="padding: 4px 0 4px 4px;">
        ${window.siyuan.languages.publishPlatform}
        <div class="b3-label__text">${window.siyuan.languages.platformCnblogs}</div>
        <span class="fn__space"></span>
        <input id="publishApiUrl" placeholder="Endpoint" class="b3-text-field fn__flex-1 fn__block" value="${window.siyuan.config.terwer.publish.platform.cnblogs.publishApiUrl}"/>
        <span class="fn__space"></span>
        <input id="publishUsername" placeholder="Username" class="b3-text-field fn__flex-1 fn__block" value="${window.siyuan.config.terwer.publish.platform.cnblogs.publishUsername}"/>
        <span class="fn__space"></span>
        <input id="publishPassword" placeholder="Password/token" class="b3-text-field fn__flex-1 fn__block" value="${window.siyuan.config.terwer.publish.platform.cnblogs.publishPassword}"/>
        <span class="fn__space"></span>
        <button id="publishConfim" class="b3-button b3-button--outline">${window.siyuan.languages.confirm}</button>
    </div>
    <div class="b3-label__text fn__flex" style="padding: 4px 0 4px 4px;">
        ${window.siyuan.languages.publishPlatform}
        <div class="b3-label__text">${window.siyuan.languages.platformConf}</div>
    </div>
</div>
`;
    },
    bindEvent: () => {
        if (window.siyuan.config.system.isInsider) {
            publish.element.querySelector("#isInsider").innerHTML = "<span class='ft__secondary'>Insider Preview</span>";
        }
        const tokenElement = publish.element.querySelector("#token") as HTMLInputElement;
        tokenElement.addEventListener("click", () => {
            tokenElement.select();
        });
        const updateElement = publish.element.querySelector("#checkUpdateBtn");
        updateElement.addEventListener("click", () => {
            const svgElement = updateElement.firstElementChild;
            if (svgElement) {
                return;
            }
            updateElement.innerHTML = `<svg class="fn__rotate"><use xlink:href="#iconRefresh"></use></svg>${window.siyuan.languages.checkUpdate}`;
            fetchPost("/api/system/checkUpdate", {showMsg: true}, () => {
                updateElement.innerHTML = `${window.siyuan.languages.checkUpdate}`;
            });
        });
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

        const workspaceDirElement = publish.element.querySelector("#workspaceDir") as HTMLInputElement;
        workspaceDirElement.addEventListener("change", async () => {
            let workspace = workspaceDirElement.value;
            if (workspaceDirElement.value === "0") {
                const localPath = await dialog.showOpenDialog({
                    defaultPath: window.siyuan.config.system.homeDir,
                    properties: ["openDirectory", "createDirectory"],
                });
                if (localPath.filePaths.length === 0) {
                    workspaceDirElement.value = window.siyuan.config.system.workspaceDir;
                    return;
                }
                workspace = localPath.filePaths[0];
            }
            fetchPost("/api/system/setWorkspaceDir", {
                path: workspace
            }, () => {
                const searchData = JSON.parse(localStorage.getItem(Constants.LOCAL_SEARCHEDATA) || "{}");
                if (searchData.hPath) {
                    searchData.hPath = "";
                    searchData.idPath = "";
                    localStorage.setItem(Constants.LOCAL_SEARCHEDATA, JSON.stringify(searchData));
                }
                localStorage.removeItem(Constants.LOCAL_DAILYNOTEID);
                localStorage.removeItem(Constants.LOCAL_DOCINFO);
                localStorage.removeItem(Constants.LOCAL_HISTORYNOTEID);
                localStorage.removeItem("pdfjs.history");
                exportLayout(false, () => {
                    exitSiYuan();
                });
            });
        });

        fetchPost("/api/system/listWorkspaceDirs", {}, (response) => {
            let optionsHTML = "";
            response.data.forEach((item: string) => {
                optionsHTML += `<option value="${item}">${item}</option>`;
            });
            workspaceDirElement.innerHTML = optionsHTML + `<option value="0">${window.siyuan.languages.updatePath}</option>`;
            workspaceDirElement.value = window.siyuan.config.system.workspaceDir;
        });
        /// #endif
        publish.element.querySelector("#authCode").addEventListener("click", () => {
            setAccessAuthCode();
        });
        const importKeyElement = publish.element.querySelector("#importKey");
        importKeyElement.addEventListener("click", () => {
            const passwordDialog = new Dialog({
                title: "🔑 " + window.siyuan.languages.key,
                content: `<div class="b3-dialog__content">
    <textarea class="b3-text-field fn__block" placeholder="${window.siyuan.languages.keyPlaceholder}"></textarea>
</div>
<div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel">${window.siyuan.languages.cancel}</button><div class="fn__space"></div>
    <button class="b3-button b3-button--text">${window.siyuan.languages.confirm}</button>
</div>`,
                width: "520px",
            });
            const textAreaElement = passwordDialog.element.querySelector("textarea");
            textAreaElement.focus();
            const btnsElement = passwordDialog.element.querySelectorAll(".b3-button");
            btnsElement[0].addEventListener("click", () => {
                passwordDialog.destroy();
            });
            btnsElement[1].addEventListener("click", () => {
                fetchPost("/api/repo/importRepoKey", {key: textAreaElement.value}, () => {
                    window.siyuan.config.repo.key = textAreaElement.value;
                    importKeyElement.parentElement.classList.add("fn__none");
                    importKeyElement.parentElement.nextElementSibling.classList.remove("fn__none");
                    passwordDialog.destroy();
                });
            });
        });
        publish.element.querySelector("#initKey").addEventListener("click", () => {
            confirmDialog("🔑 " + window.siyuan.languages.genKey, window.siyuan.languages.initRepoKeyTip, () => {
                fetchPost("/api/repo/initRepoKey", {}, (response) => {
                    window.siyuan.config.repo.key = response.data.key;
                    importKeyElement.parentElement.classList.add("fn__none");
                    importKeyElement.parentElement.nextElementSibling.classList.remove("fn__none");
                });
            });
        });
        publish.element.querySelector("#copyKey").addEventListener("click", () => {
            showMessage(window.siyuan.languages.copied);
            writeText(window.siyuan.config.repo.key);
        });
        publish.element.querySelector("#resetRepo").addEventListener("click", () => {
            confirmDialog("⚠️ " + window.siyuan.languages.resetRepo, window.siyuan.languages.resetRepoTip, () => {
                fetchPost("/api/repo/resetRepo", {}, () => {
                    window.siyuan.config.repo.key = "";
                    importKeyElement.parentElement.classList.remove("fn__none");
                    importKeyElement.parentElement.nextElementSibling.classList.add("fn__none");
                });
            });
        });
        const networkServeElement = publish.element.querySelector("#networkServe") as HTMLInputElement;
        networkServeElement.addEventListener("change", () => {
            fetchPost("/api/system/setNetworkServe", {networkServe: networkServeElement.checked}, () => {
                exportLayout(false, () => {
                    exitSiYuan();
                });
            });
        });
        const uploadErrLogElement = publish.element.querySelector("#uploadErrLog") as HTMLInputElement;
        uploadErrLogElement.addEventListener("change", () => {
            fetchPost("/api/system/setUploadErrLog", {uploadErrLog: uploadErrLogElement.checked}, () => {
                exportLayout(false, () => {
                    exitSiYuan();
                });
            });
        });
        publish.element.querySelector("#aboutConfim").addEventListener("click", () => {
            fetchPost("/api/system/setNetworkProxy", {
                scheme: (publish.element.querySelector("#aboutScheme") as HTMLInputElement).value,
                host: (publish.element.querySelector("#aboutHost") as HTMLInputElement).value,
                port: (publish.element.querySelector("#aboutPort") as HTMLInputElement).value
            }, () => {
                exportLayout(false, () => {
                    exitSiYuan();
                });
            });
        });
    }
};
