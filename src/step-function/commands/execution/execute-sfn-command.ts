import {SfnCommandRunner} from "../sfn-command-runner";
import {StartExecutionCommand} from "@aws-sdk/client-sfn";
import {StartExecutionInput} from "@aws-sdk/client-sfn/dist-types/models/models_0";
import {SfnExecution} from "../../sfn-execution";

export class ExecuteSfnCommand extends SfnCommandRunner<SfnExecution> {
    public withArn(arn: string) {
        this.input.stateMachineArn = arn;
        return this;
    }

    public withInput(input?: string) {
        this.input.input = input;
        return this;
    }

    protected async execute(): Promise<SfnExecution> {
        const result = await this._sfnClient.send(new StartExecutionCommand(this.input as StartExecutionInput));
        return new SfnExecution(result, this._sfnClient);
    }
}
