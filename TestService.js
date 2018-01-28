let count = 0;
console.log("开始测试");
async function getNum() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            count = count + 1;
            console.log("counts:", count);
            resolve(count);
        }, 1000);
    });
}

async function test() {
    while (count < 9) {
        count = await getNum();
        console.log("count:", count);
    }
    if(count < 10){
        console.log("count still small then 10");
    }
}

let result = test();
Promise.resolve(result).then(suc=>console.log(suc),err=>console.log(err));
