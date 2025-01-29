import {JsonObject} from "../types/io";
import {config} from "../config/sfn-config";

export class SfnState {
    private readonly _definition: JsonObject;
    private readonly _initialDefinition: JsonObject;

    private static deepCopy(sfn: JsonObject): JsonObject {
        return JSON.parse(JSON.stringify(sfn));
    }

    private findStep(definition: JsonObject, stepName: string): JsonObject | string {
        if (definition?.hasOwnProperty(stepName)) {
            return definition[stepName];
        }
        for (let i in definition) {
            if (typeof definition[i] === 'object') {
                let result: JsonObject | string = this.findStep(definition[i], stepName);
                if (result) {
                    return result;
                }
            }
        }
        return undefined;
    }

    constructor(definition: JsonObject) {
        this._initialDefinition = SfnState.deepCopy(definition);
        this._definition = definition;
    };

    get definition(): string {
        return JSON.stringify(this._definition);
    }

    get initialDefinition(): string {
        return JSON.stringify(this._initialDefinition);
    }

    public updateLambdaStep(stepName: string, lambdaName: string): void {
        const lambdaStep: JsonObject = this.findStep(this._definition!.States, stepName) as JsonObject;
        if (!lambdaStep)
            throw new Error(`Step "${stepName}" can't be found in step function definition`);

        let functionName: string = this.findStep(lambdaStep, 'FunctionName') as string;
        if (!functionName)
            throw new Error(`Step "${stepName}" doesn't have a lambda function defined`);

        functionName.split(':')
            .map((namePart: string, index: number) => index === config.lambdaNameIndex ? lambdaName : namePart)
            .join(':');
    }

    public updateGenericStep(stepName: string, stepDefinition: JsonObject): void {
        let originalStepDefinition: JsonObject = this.findStep(this._definition!.States, stepName) as JsonObject;
        if (!originalStepDefinition)
            throw new Error(`Step "${stepName}" can't be found in step function definition`);

        Object.assign(originalStepDefinition, stepDefinition);
    }
}
