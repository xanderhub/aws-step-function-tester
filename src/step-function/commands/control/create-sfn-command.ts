import {SfnCommandRunner} from "../sfn-command-runner";
import {CreateStateMachineCommand, CreateStateMachineInput, StateMachineType} from "@aws-sdk/client-sfn";
import {ControlCommandOutput} from "../../../types/sfn";
import {LoggingConfiguration} from "@aws-sdk/client-sfn/dist-types/models/models_0";

export class CreateSfnCommand extends SfnCommandRunner<ControlCommandOutput> {

    public withType(type: StateMachineType | undefined) {
        this.input.type = type;
        return this;
    }

    public withDefinition(definition: string | undefined) {
        this.input.definition = definition;
        return this;
    }

    public withLoggingConfiguration(logConfig: LoggingConfiguration | undefined) {
        this.input.loggingConfiguration = logConfig;
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

    protected execute(): Promise<ControlCommandOutput> {
        return this._sfnClient.send(new CreateStateMachineCommand(this.input as CreateStateMachineInput));
    }
}
