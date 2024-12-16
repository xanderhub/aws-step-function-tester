import {LambdaCommandRunner} from "../lambda-command-runner";
import {GetFunctionCommand, GetFunctionRequest} from "@aws-sdk/client-lambda";
import {LambdaCommandOutput} from "../../types/lambda";

export class GetLambdaCommand extends LambdaCommandRunner {

    protected execute(): Promise<LambdaCommandOutput> {
        return this._lambdaClient.send(new GetFunctionCommand(this.input as GetFunctionRequest));
    }
}
