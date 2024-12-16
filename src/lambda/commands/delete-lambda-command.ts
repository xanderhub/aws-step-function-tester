import {LambdaCommandRunner} from "../lambda-command-runner";
import {DeleteFunctionCommand, DeleteFunctionRequest} from "@aws-sdk/client-lambda";
import {LambdaCommandOutput} from "../../types/lambda";

export class DeleteLambdaCommand extends LambdaCommandRunner {

    protected execute(): Promise<LambdaCommandOutput> {
        return this._lambdaClient.send(new DeleteFunctionCommand(this.input as DeleteFunctionRequest));
    }
}
