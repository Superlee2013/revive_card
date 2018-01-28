const rp = require('request-promise');

const Config = require("./config");
const User = Config.user;
const YIMA = Config.yima;

const defaultItemId = YIMA.itemId;

class SmsCode {

    async login() {
        const url = "http://api.51ym.me/UserInterface.aspx?action=login&username=" + User.username + "&password=" + User.password;
        let response = await rp(url);
        if (response.indexOf("|") == -1) {
            throw new Error("登录失败");
        }
        return response.split("|")[1];

    }

    async getMobileNumber(token, itemId) {
        itemId = itemId || defaultItemId;
        const url = "http://api.51ym.me/UserInterface.aspx?action=getmobile&itemid=" + itemId + "&token=" + token;
        let response = await rp(url);
        if (response.indexOf("|") == -1) {
            throw new Error("获取手机号码失败");
        }
        return response.split("|")[1];
    }

    async releaseAllMobile(token) {
        const url = "http://api.51ym.me/UserInterface.aspx?action=releaseall&token=" + token;

    }

    async ignoreMobile(mobileNum, token,itemId) {
        itemId = itemId || defaultItemId;
        const url = "http://api.51ym.me/UserInterface.aspx?action=addignore&mobile=" + mobileNum + "&itemid=" + itemId + "&token=" + token;
        let response = await rp(url);
        if ("success" == response) {
            return "拉黑成功";
        }
        return "拉黑失败";

    }

    async queryUserInfoByToken(token) {
        const url = "http://api.51ym.me/UserInterface.aspx?action=getaccountinfo&token=" + token;
        let response = await rp(url);
        return response;
    }

    async queryUserInfo() {
        let token = await this.login();
        let userInfo = await this.queryUserInfoByToken(token);
        let infoList = userInfo.split("|");
        console.log("用户:" + infoList[1] + ",余额:" + infoList[4]);
        return token;
    }

    async fetchCodeAndRealease(mobileNum, token, itemId) {
        itemId = itemId || defaultItemId;
        const url = "http://api.51ym.me/UserInterface.aspx?action=getsms&mobile=" + mobileNum + "&itemid=" + itemId + "&token=" + token + "&release=1";
        let response = await rp(url);

        if (response.indexOf("3001") != -1) {
            console.log("尚未收到短信");
            return null;
        }

        if (response.indexOf("|") == -1) {
            console.log("获取验证码失败");
            return null;
        }
        let code = response.split("|")[1];
        console.log("成功获取验证码", code);
        return code;

    }
}

module.exports = SmsCode;