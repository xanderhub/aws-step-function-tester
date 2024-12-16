import {SFNClient} from "@aws-sdk/client-sfn";
import {LambdaMock} from "../lambda/lambda-mock";
import {UpdateSfnCommand} from "./commands/control/update-sfn-command";
import {SfnState} from "./sfn-state";
import console from "console";
import {ExecuteSfnCommand} from "./commands/execution/execute-sfn-command";
import {SfnExecution} from "./sfn-execution";
import {ControlCommandOutput} from "../types/sfn";
import {JsonObject} from "../types/io";

export class SfnInstance {
    private readonly _sfnState: SfnState;
    private readonly _arn: string;
    private readonly _name: string;

    get arn(): string {
        return this._arn;
    }

    get name(): string {
        return this._name;
    }

    constructor(sfnInstance: ControlCommandOutput,
                private readonly _sfnClient: SFNClient = new SFNClient({})) {
        this._sfnState = new SfnState(JSON.parse(sfnInstance.definition!));
        this._arn = sfnInstance.stateMachineArn!;
        this._name = sfnInstance.name!;
    };

    public async reset(): Promise<ControlCommandOutput> {
        console.log(`Resetting step function "${this._name}" to it's original definition`);
        return new UpdateSfnCommand(this._sfnClient)
            .withArn(this._arn)
            .withDefinition(this._sfnState.initialDefinition)
            .runWithRetry();
    }

    public async mockLambdaStep(stepName: string, lambdaMock: LambdaMock): Promise<ControlCommandOutput> {
        this._sfnState.updateLambdaStep(stepName, lambdaMock.name);

        console.log(`Updating lambda step "${stepName}" with ${lambdaMock.name}`);
        return new UpdateSfnCommand(this._sfnClient)
            .withArn(this._arn)
            .withDefinition(this._sfnState.definition)
            .runWithRetry();
    }

    public async mockGenericStep(stepName: string, stepDefinition: JsonObject): Promise<ControlCommandOutput> {
        this._sfnState.updateGenericStep(stepName, stepDefinition);

        console.log(`Updating step "${stepName}" with custom definition`);
        return new UpdateSfnCommand(this._sfnClient)
            .withArn(this._arn)
            .withDefinition(this._sfnState.definition)
            .runWithRetry();
    }

    public async execute(input?: string): Promise<SfnExecution> {
        const execution: SfnExecution = await new ExecuteSfnCommand(this._sfnClient)
            .withArn(this._arn)
            .withInput(input)
            .runOnce();
        console.log(`Executing step function "${this._name}" | Execution ID: ${execution.executionArn?.split(":").pop()}`);
        return execution;
    }
}
