import {LambdaCommandRunner} from "../lambda-command-runner";
import {UpdateFunctionConfigurationCommand, UpdateFunctionConfigurationCommandInput} from "@aws-sdk/client-lambda";
import 'ts-retry'
import {LambdaCommandOutput} from "../../types/lambda";

export class UpdateLambdaConfigurationCommand extends LambdaCommandRunner {
    public withHandler(handler: string | undefined) {
        this.input.Handler = handler;
        return this;
    }

    public withTimeout(timeout: number | undefined) {
        this.input.Timeout = timeout;
        return this;
    }

    protected execute(): Promise<LambdaCommandOutput> {
        return this._lambdaClient.send(
            new UpdateFunctionConfigurationCommand(this.input as UpdateFunctionConfigurationCommandInput));
    }
}
