import {LambdaCommandRunner} from "../lambda-command-runner";
import {DeleteFunctionConcurrencyCommand, DeleteFunctionConcurrencyRequest} from "@aws-sdk/client-lambda";
import {LambdaCommandOutput} from "../../types/lambda";

export class DeleteLambdaConcurrencyCommand extends LambdaCommandRunner {
    protected execute(): Promise<LambdaCommandOutput> {
        return this._lambdaClient.send(new DeleteFunctionConcurrencyCommand(this.input as DeleteFunctionConcurrencyRequest));
    }
}
