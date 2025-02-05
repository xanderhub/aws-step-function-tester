const {getLogger} = require("./logger");
const {greet} = require("./helper-module");

const logger = getLogger();

exports.handler = async (event) => {

    logger.info('Lambda function invoked', { event });

    try {
        // Your logic here
        const result = greet(' world');
        logger.info('Lambda function executed successfully', { result });
        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (error) {
        logger.error('Error executing Lambda function', { error });
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
