export const config = {
    commandTimeInterval: 1000,
    commandMaxTry: 5,
    minimalTimeout: 1,
    minimalConcurrency: 0,
    mocks: {
        sourcePath: "node_modules/aws-step-function-tester/dist/src/lambda/source",
        timeout: {
            source: "delay.zip",
            handler: "delay.delay"
        },
        memoryOverload: {
            source: "memory-overload.zip",
            handler: "memory-overload.memoryOverload"
        },
        genericError: {
            source: "generic-error.zip",
            handler: "generic-error.genericError"
        }
    },
    mockNameSuffix: "-mock",
    validationTimeInterval: 2000,
    validationMaxTry: 20
};
