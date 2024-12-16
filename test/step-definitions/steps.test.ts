import * as assert from "assert";
import {Given, Then, When} from '@cucumber/cucumber';
import {
    createCopyStepFunction,
    createLambdaMock,
    deleteCopyStepFunction,
    expect,
    LambdaMock,
    SfnExecution,
    SfnInstance
} from "../../index";

let lambdaMock: LambdaMock;
let stepFunction: SfnInstance;

Given('Lambda mock is reset', {timeout: 240000}, async function () {
    if (lambdaMock) {
        await lambdaMock.reset();
    }
});

Given('Step function {word} copied as new step function', {timeout: 240000}, async function (sfnName: string) {
    const sfnArn = "arn:aws:states:us-west-2:730335479582:stateMachine:" + sfnName;
    stepFunction = await createCopyStepFunction(sfnArn);
    assert.ok(stepFunction?.name === sfnName + "-copy");
});

Given('Lambda mock created as a copy of {word} lambda', {timeout: 120000}, async function (lambdaName: string) {
    lambdaMock = await createLambdaMock(lambdaName);
    assert.ok(lambdaMock?.name === lambdaName + "-mock");
});

Given('Step {string} replaced with mocked lambda', {timeout: 3600000}, async function (lambdaName: string) {
    await stepFunction.mockLambdaStep(lambdaName, lambdaMock);
});

When('lambda mock is set to simulate timeout', {timeout: 120000}, async function () {
    await lambdaMock.timeout();
});

When('lambda mock is set to simulate throttling', {timeout: 120000}, async function () {
    await lambdaMock.throttle();
});

When('lambda mock is set to simulate generic error', {timeout: 120000}, async function () {
    // await lambdaMock.genericError();
    await lambdaMock.custom("src/lambda/source/generic-error.zip", "generic-error.genericError");
});


When('lambda mock is set to simulate memory overload', {timeout: 120000}, async function () {
    await lambdaMock.memoryOverload();
});

When('S3 mock is set to simulate failure', {timeout: 240000}, async function () {
    await stepFunction.mockGenericStep("GetObject",
        {
            "Type": "Task",
            "Parameters": {
                "Bucket.$": "$.Bucket",
                "Key": "non-existing-key"
            },
            "Resource": "arn:aws:states:::aws-sdk:s3:getObject",
            "Next": "Success"
        })
});

Then('Step function finishes successfully', {timeout: 240000}, async function () {
    const execution: SfnExecution = await stepFunction.execute();
    await expect(execution).toSuccess();
    await expect(execution).toExecuteStep("GetObject");
    await expect(execution).toExecuteStep("Success");
});

Then('Step function fails after {string} step', {timeout: 240000}, async function (stepName: string) {
    const execution: SfnExecution = await stepFunction.execute();
    await expect(execution).toFail();
    await expect(execution).toExecuteStep(stepName);
    await expect(execution).toExecuteStep("Fail");
});


Given('Step function restored to original state', {timeout: 240000}, async function () {
    await stepFunction.reset();
});

Given('Step function copy deleted', {timeout: 240000}, async function () {
    await deleteCopyStepFunction(stepFunction.arn);
});
