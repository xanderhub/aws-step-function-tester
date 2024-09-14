import {CreateFunctionCommand, GetFunctionCommand, LambdaClient, GetFunctionCommandOutput} from "@aws-sdk/client-lambda";
import axios from "axios";

async function copyLambda() {

    const lambdaClient = new LambdaClient();
    const oldFunctionConfig: GetFunctionCommandOutput = await lambdaClient.send(
        new GetFunctionCommand({FunctionName: "dev-lambda-hybrid-recording-audio"}));

    const response = await axios.get(oldFunctionConfig.Code?.Location as string, {responseType: 'arraybuffer'});
    const lambdaCode = response.data;

//ts-ignore
// await downloadLambdaCode(oldFunctionConfig.Code?.Location as string, 'lambdaCode.zip');
// Create a new Lambda function with the same configuration

    const newFunctionConfig = await lambdaClient.send(
        new CreateFunctionCommand({
            FunctionName: "dev-lambda-hybrid-recording-audio-under-test",
            Runtime: oldFunctionConfig?.Configuration?.Runtime,
            Role: oldFunctionConfig?.Configuration?.Role,
            Handler: oldFunctionConfig?.Configuration?.Handler,
            Code: {ZipFile: lambdaCode},
            Description: oldFunctionConfig?.Configuration?.Description,
            Timeout: oldFunctionConfig?.Configuration?.Timeout,
            MemorySize: oldFunctionConfig?.Configuration?.MemorySize,
            Environment: oldFunctionConfig?.Configuration?.Environment
        }));

    console.log("Function created");
}
