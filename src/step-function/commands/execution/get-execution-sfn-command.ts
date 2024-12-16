import {SfnCommandRunner} from "../sfn-command-runner";
import {DescribeExecutionCommand} from "@aws-sdk/client-sfn";
import {DescribeExecutionInput} from "@aws-sdk/client-sfn/dist-types/models/models_0";
import {ExecutionCommandOutput} from "../../../types/sfn";

export class GetExecutionSfnCommand extends SfnCommandRunner<ExecutionCommandOutput> {
    public withExecutionArn(arn: string) {
        this.input.executionArn = arn;
        return this;
    }

    protected execute(): Promise<ExecutionCommandOutput> {
        return this._sfnClient.send(new DescribeExecutionCommand(this.input as DescribeExecutionInput));
    }
}
