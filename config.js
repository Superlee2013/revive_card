exports.inviteCode = "19951194"; // 个人邀请码，默认为作者自己的>_<

exports.lifeCount = 5; // 买多少条吧

// 接码平台登录信息
exports.user = {
    "username": "xxxxxx", // 用户名
    "password": "xxxxxx"  // 密码
}

// 接码平台相应配置
exports.yima = {
    "itemId": "13235" // 项目id
}

// 获取验证码时的重试设置，包括重试次数和间隔时间
exports.retry = {
    count: 20,  // 重试次数
    time: 5     // 间隔时间
}