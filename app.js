const Core = require("./Core");
const core = new Core();

let result = core.task();
Promise.resolve(result).then(success => console.log(success), err => console.log(err));