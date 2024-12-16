import {SfnCommandRunner} from "../sfn-command-runner";
import {DeleteStateMachineCommand} from "@aws-sdk/client-sfn";
import {DeleteStateMachineCommandInput} from "@aws-sdk/client-sfn/dist-types/commands/DeleteStateMachineCommand";
import {ControlCommandOutput} from "../../../types/sfn";

export class DeleteSfnCommand extends SfnCommandRunner<ControlCommandOutput> {
    public withArn(arn: string) {
        this.input.stateMachineArn = arn;
        return this;
    }

    protected execute(): Promise<ControlCommandOutput> {
        return this._sfnClient.send(new DeleteStateMachineCommand(this.input as DeleteStateMachineCommandInput));
    }
}
