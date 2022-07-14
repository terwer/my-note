import {Dialog} from "../dialog";

const showMsg = (msg: string, type: string) => {
    let title = "❀ " + window.siyuan.languages.infoTip;
    if ("alert" === type) {
        title = "⚠️ " + window.siyuan.languages.warningTip;
    }
    if ("error" === type) {
        title = "❎ " + window.siyuan.languages.errorTip;
    }
    if ("success" === type) {
        title = "✅ " + window.siyuan.languages.successTip;
    }
    const msgDialog = new Dialog({
        title: title,
        content: `<div class="b3-dialog__content">
` + msg + `
</div>
<div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel">${window.siyuan.languages.confirm}</button>
</div>`,
        width: "520px",
    });
    const btnsElement = msgDialog.element.querySelectorAll(".b3-button");
    btnsElement[0].addEventListener("click", () => {
        msgDialog.destroy();
    });
};

/**
 * 信息弹窗
 * @param msg 信息信息
 */
const infoMsg = (msg: string) => {
    showMsg(msg, undefined);
};

/**
 * 警告弹窗
 * @param msg 警告信息
 */
const alertMsg = (msg: string) => {
    showMsg(msg, "alert");
};

/**
 * 错误弹窗
 * @param msg 错误信息
 */
const errorMsg = (msg: string) => {
    showMsg(msg, "error");
};

/**
 * 正确弹窗
 * @param msg 正确信息
 */
const successMsg = (msg: string) => {
    showMsg(msg, "success");
};

/**
 * 确认弹窗
 * @param msg 确认信息
 */
const confirmMsg = (msg: string) => {
    const msgDialog = new Dialog({
        title: "🔑 " + window.siyuan.languages.key,
        content: `<div class="b3-dialog__content">
` + msg + `
</div>
<div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel">${window.siyuan.languages.cancel}</button><div class="fn__space"></div>
    <button class="b3-button b3-button--text">${window.siyuan.languages.confirm}</button>
</div>`,
        width: "520px",
    });
    const btnsElement = msgDialog.element.querySelectorAll(".b3-button");
    btnsElement[0].addEventListener("click", () => {
        msgDialog.destroy();
    });
    btnsElement[1].addEventListener("click", () => {
        console.log("clicked");
    });
};

/**
 * 输入信息确认
 * @param title 标题
 * @param callback 回调，会返回输入的数据
 */
const inputMsg = (title: string, callback: any) => {
    const inputDialog = new Dialog({
        title: "🔑️" + title,
        content: `<div class="b3-dialog__content">
    <textarea class="b3-text-field fn__block" placeholder="${window.siyuan.languages.keyPlaceholder}"></textarea>
</div>
<div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel">${window.siyuan.languages.cancel}</button><div class="fn__space"></div>
    <button class="b3-button b3-button--text">${window.siyuan.languages.confirm}</button>
</div>`,
        width: "520px",
    });
    const textAreaElement = inputDialog.element.querySelector("textarea");
    textAreaElement.focus();
    const btnsElement = inputDialog.element.querySelectorAll(".b3-button");
    btnsElement[0].addEventListener("click", () => {
        inputDialog.destroy();
    });
    btnsElement[1].addEventListener("click", () => {
        if (callback) {
            callback(textAreaElement.value);
        }
    });
};

/**
 * 文章与平台绑定
 * @param title 标题
 * @param callback 回调，会返回输入的数据
 */
// eslint-disable-next-line @typescript-eslint/ban-types
const bindPlatformMsg = (title: string, callback: Function) => {
    const inputDialog = new Dialog({
        title: "🔑️" + title,
        content: `<div class="b3-dialog__content">
    <textarea class="b3-text-field fn__block" placeholder="${window.siyuan.languages.keyPlaceholder}"></textarea>
</div>
<div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel">${window.siyuan.languages.cancel}</button><div class="fn__space"></div>
    <button class="b3-button b3-button--text">${window.siyuan.languages.confirm}</button>
</div>`,
        width: "520px",
    });
    const textAreaElement = inputDialog.element.querySelector("textarea");
    textAreaElement.focus();
    const btnsElement = inputDialog.element.querySelectorAll(".b3-button");
    btnsElement[0].addEventListener("click", () => {
        inputDialog.destroy();
    });
    btnsElement[1].addEventListener("click", () => {
        if (callback) {
            callback(textAreaElement.value);
        }
    });
};

const msg = {
    infoMsg,
    alertMsg,
    errorMsg,
    successMsg,
    confirmMsg,
    inputMsg,
    bindPlatformMsg
};
export default msg;