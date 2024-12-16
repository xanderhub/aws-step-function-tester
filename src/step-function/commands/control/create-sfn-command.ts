import {SfnCommandRunner} from "../sfn-command-runner";
import {CreateStateMachineCommand, CreateStateMachineInput, StateMachineType} from "@aws-sdk/client-sfn";
import {ControlCommandOutput} from "../../../types/sfn";

export class CreateSfnCommand extends SfnCommandRunner<ControlCommandOutput> {
    public withDefinition(definition: string | undefined) {
        this.input.definition = definition;
        return this;
    }

    public withName(name: string) {
        this.input.name = name;
        return this;
    }

    public withRole(role: string | undefined) {
        this.input.roleArn = role;
        return this;
    }

    public withType(type: StateMachineType | undefined) {
        this.input.type = type;
        return this;
    }

    protected execute(): Promise<ControlCommandOutput> {
        return this._sfnClient.send(new CreateStateMachineCommand(this.input as CreateStateMachineInput));
    }
}
