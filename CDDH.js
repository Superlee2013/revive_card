const request = require("request");

class CDDH {
    async requestSmsCode(phone) {
        const url = "http://api.api.chongdingdahui.com/user/requestSmsCode";
        const that = this;
        console.log("请求登录手机为: " + phone);
        return new Promise((resolve, reject) => {
            request({
                url: url,
                method: 'POST',
                json: true,
                body: {
                    "phone": phone
                }
            }, function (err, response, body) {
                if (err) reject(err);
                console.log(body);
                resolve(body);
            })
        })
    }

    async login(phone, code) {
        const url = "http://api.api.chongdingdahui.com/user/login";
        const that = this;
        return new Promise((resolve, reject) => {
            request({
                url: url,
                method: 'POST',
                json: true,
                body: {
                    "phone": phone,
                    "code": code
                }
            }, function (err, response, body) {
                if (err) reject(err);
                if (body.code == 0 && body.data.user) {
                    let sessionId = body.data.user.sessionToken;
                    resolve(sessionId);
                }
                reject("无数据返回");
            })
        })
    }

    async invite(phone, sessionToken, inviteCode) {
        // 64 已用过   7 token无效
        const url = "http://api.api.chongdingdahui.com/user/bindInviteCode";
        const that = this;
        return new Promise((resolve, reject) => {
            request({
                url: url,
                headers: {
                    'X-Live-Session-Token': sessionToken
                },
                method: 'POST',
                json: true,
                body: {
                    "phone": phone,
                    "sessionToken": sessionToken,
                    "inviteCode": inviteCode
                }
            }, function (err, response, body) {
                if (err) reject(err);
                console.log(body);
                if (body.code == 0) {
                    console.log("邀请码绑定成功");
                    resolve("success");
                } else {
                    console.log("邀请码绑定失败");
                    resolve("error");
                }

            })
        })
    }


}

module.exports = CDDH;