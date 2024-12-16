import {LambdaCommandRunner} from "../lambda-command-runner";
import {PutFunctionConcurrencyCommand, PutFunctionConcurrencyRequest} from "@aws-sdk/client-lambda";
import {LambdaCommandOutput} from "../../types/lambda";

export class UpdateLambdaConcurrencyCommand extends LambdaCommandRunner {
    public withConcurrency(concurrency: number | undefined) {
        this.input.ReservedConcurrentExecutions = concurrency;
        return this;
    }

    protected execute(): Promise<LambdaCommandOutput> {
        return this._lambdaClient.send(new PutFunctionConcurrencyCommand(this.input as PutFunctionConcurrencyRequest));
    }
}
