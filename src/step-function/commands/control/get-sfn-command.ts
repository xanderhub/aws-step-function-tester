import {SfnCommandRunner} from "../sfn-command-runner";
import {DescribeStateMachineCommand} from "@aws-sdk/client-sfn";
import {DescribeStateMachineInput} from "@aws-sdk/client-sfn/dist-types/models/models_0";
import {ControlCommandOutput} from "../../../types/sfn";

export class GetSfnCommand extends SfnCommandRunner<ControlCommandOutput> {
    public withArn(arn: string) {
        this.input.stateMachineArn = arn;
        return this;
    }

    protected execute(): Promise<ControlCommandOutput> {
        return this._sfnClient.send(new DescribeStateMachineCommand(this.input as DescribeStateMachineInput));
    }
}
