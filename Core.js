const Sleep = require("sleep");

const SmsCode = require("./YMSmsCode");
const CDDH = require("./CDDH");
const cddh = new CDDH();
const smsCode = new SmsCode();

const config = require("./config");

const inviteCode = config.inviteCode;
const lifeCount = config.lifeCount;


const retryCount = config.retry.count;
const retryDelta = config.retry.time;

class Core {
    async task() {
        let token = await smsCode.login();
        let userInfo = await smsCode.queryUserInfoByToken(token);
        let infoList = userInfo.split("|");
        console.log("用户:" + infoList[1] + ",余额:" + infoList[4]);
        let phone = await smsCode.getMobileNumber(token);
        console.log("获得手机号码:", phone);

        let count = 0;
        let success = 0;
        while(count<lifeCount){
            count++;
            let singleTaskRet = await this.singleTask(phone, token, inviteCode);
            if(singleTaskRet == true){
                success++;
            }
            
        }
        console.log("成功绑定"+success+"张复活卡");

        
    }

    async singleTask(phone, token, inviteCode) {
        const that = this;
        // 发送验证码
        let requestSmsCodeResult = await cddh.requestSmsCode(phone);
        // 获取验证码
        let code = null;
        let retryTimeCount = 0;
        while (code == null && retryTimeCount < retryCount) {
            Sleep.sleep(retryDelta);
            retryTimeCount++;
            console.log("第" + retryTimeCount + "次获取验证码");
            code = await smsCode.fetchCodeAndRealease(phone, token);
        }
        // 重试完之后仍为获取到验证码，拉黑该号码
        if (code == null) {
            console.log("获取验证码失败,拉黑该号码");
            let ignoreResult = await smsCode.ignoreMobile(phone, token);
            console.log(ignoreResult);
            console.log("本次获取失败，进行下一次尝试");
            return false;
        }
        console.log("code:", code);
        let codeNum = that.getCode(code);
        let sessionToken = await cddh.login(phone, codeNum);
        let inviteResult = await cddh.invite(phone, sessionToken, inviteCode);
        if(inviteResult == "success"){
            return true;
        }
        else return false;
    }

    getCode(codeStr) {
        const codeReg = /^.*冲顶大会.*您的验证码为：.*([0-9]{4}).*$/;
        let matchRet = codeStr.match(codeReg);
        if (matchRet && matchRet[1]) {
            return matchRet[1];
        }
        return null;
    }
}

module.exports = Core;