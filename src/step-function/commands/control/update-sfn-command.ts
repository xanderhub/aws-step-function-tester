import {SfnCommandRunner} from "../sfn-command-runner";
import {UpdateStateMachineCommand, UpdateStateMachineInput} from "@aws-sdk/client-sfn";
import {ControlCommandOutput} from "../../../types/sfn";

export class UpdateSfnCommand extends SfnCommandRunner<ControlCommandOutput> {
    public withArn(arn: string | undefined) {
        this.input.stateMachineArn = arn;
        return this;
    }

    public withDefinition(definition: string | undefined) {
        this.input.definition = definition;
        return this;
    }

    protected execute(): Promise<ControlCommandOutput> {
        return this._sfnClient.send(new UpdateStateMachineCommand(this.input as UpdateStateMachineInput));
    }
}
