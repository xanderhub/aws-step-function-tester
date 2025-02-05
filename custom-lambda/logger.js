const { Logger } = require('@aws-lambda-powertools/logger');

const logger = new Logger({
    jsonReplacerFn: (key, value) => {
        if (key === 'sampling_rate' || key === 'service') {
            return undefined;
        }
        return value;
    }
});

function getLogger(attributes) {
    if(attributes === undefined) {
        return logger;
    }

    return new Logger({
        jsonReplacerFn: (key, value) => {
            if (key === 'sampling_rate' || key === 'service') {
                return undefined;
            }
            return value;
        },
        persistentKeys: attributes
    });
}

module.exports = {
    getLogger
};
