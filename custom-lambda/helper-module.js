const {getLogger} = require("./logger");

const logger = getLogger({module: "helper-module"});

function greet(name) {
    logger.info(`Greeting ${name}`);
    return `Hello, ${name}!`;
}

module.exports = {
    greet,
};
