import axios from "axios";
import {LambdaClient} from "@aws-sdk/client-lambda";
import {GetLambdaCommand} from "./commands/get-lambda-command";
import {CreateLambdaCommand} from "./commands/create-lambda-command";
import {LambdaMock} from "./lambda-mock";
import {DeleteLambdaCommand} from "./commands/delete-lambda-command";
import {FunctionCode, FunctionCodeLocation} from "@aws-sdk/client-lambda/dist-types/models/models_0";
import {config} from "../config/lambda-config";
import {LambdaCommandOutput} from "../types/lambda";

export class LambdaMockManager {
    private static readonly lambdaClient: LambdaClient = new LambdaClient({});

    private static getLambda(lambdaName: string): Promise<LambdaCommandOutput> {
        return new GetLambdaCommand(LambdaMockManager.lambdaClient).withName(lambdaName).runOnce();
    }

    //TODO: move to utils class / module
    public static async getLambdaCode(codeLocation: string): Promise<FunctionCode> {
        const lambdaCode = await axios.get(codeLocation, {responseType: 'arraybuffer'});
        return { ZipFile: lambdaCode.data };
    }

    private static async mockExists(lambdaName: string): Promise<boolean> {
        return LambdaMockManager.getLambda(lambdaName + config.mockNameSuffix)
            .then(() => true)
            .catch(() => false);
    }

    public static async createLambdaMock(lambdaName: string): Promise<LambdaMock> {
        if(await LambdaMockManager.mockExists(lambdaName)) {
            console.log(`Mock of lambda "${lambdaName}" already exists, clearing...`);
            await LambdaMockManager.deleteMock(lambdaName);
        }

        const sourceLambda = await LambdaMockManager.getLambda(lambdaName);
        const newLambda = await new CreateLambdaCommand(LambdaMockManager.lambdaClient)
            .withName(lambdaName + config.mockNameSuffix)
            .withDescription("Mock of " + lambdaName)
            .withRuntime(sourceLambda?.Configuration?.Runtime)
            .withHandler(sourceLambda?.Configuration?.Handler)
            .withRole(sourceLambda?.Configuration?.Role)
            .withCode(await LambdaMockManager.getLambdaCode(sourceLambda.Code?.Location as string))
            .withTimeout(sourceLambda?.Configuration?.Timeout)
            .withMemorySize(sourceLambda?.Configuration?.MemorySize)
            .withEnvironment(sourceLambda?.Configuration?.Environment)
            .runWithRetry();

        newLambda.Code = sourceLambda.Code as FunctionCodeLocation;

        console.log(`Lambda function ${newLambda.FunctionName} created`);
        return new LambdaMock(LambdaMockManager.lambdaClient, newLambda);
    }

    public static async deleteMock(lambdaName: string): Promise<LambdaCommandOutput> {
        return new DeleteLambdaCommand(LambdaMockManager.lambdaClient)
            .withName(lambdaName + config.mockNameSuffix)
            .runWithRetry();
    }
}

export const createLambdaMock = LambdaMockManager.createLambdaMock;


