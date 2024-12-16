import {LambdaCommandRunner} from "../lambda-command-runner";
import {UpdateFunctionCodeCommand, UpdateFunctionCodeCommandInput} from "@aws-sdk/client-lambda";
import {FunctionCode} from "@aws-sdk/client-lambda/dist-types/models/models_0";
import {LambdaCommandOutput} from "../../types/lambda";

export class UpdateLambdaCodeCommand extends LambdaCommandRunner {
    public withCode(code: FunctionCode | undefined) {
        this.input.ZipFile = code?.ZipFile;
        return this;
    }

    protected execute(): Promise<LambdaCommandOutput> {
        return this._lambdaClient.send(new UpdateFunctionCodeCommand(this.input as UpdateFunctionCodeCommandInput));
    }
}
