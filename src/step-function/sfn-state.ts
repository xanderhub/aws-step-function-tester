import {JsonObject} from "../types/io";
import {config} from "../config/sfn-config";

export class SfnState {
    private readonly _definition: JsonObject;
    private readonly _initialDefinition: JsonObject;

    private static deepCopy(sfn: JsonObject): JsonObject {
        return JSON.parse(JSON.stringify(sfn));
    }

    private findJsonAttribute(json: JsonObject, attributeName: string): JsonObject {
        if (json?.hasOwnProperty(attributeName)) {
            return typeof json[attributeName] === 'object' ? json[attributeName] : json;
        }
        for (let attribute in json) {
            if (typeof json[attribute] === 'object') {
                let result: JsonObject = this.findJsonAttribute(json[attribute], attributeName);
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
        const lambdaStep: JsonObject = this.findJsonAttribute(this._definition!.States, stepName);
        if (!lambdaStep)
            throw new Error(`Step "${stepName}" can't be found in step function definition`);

        let functionDetails: JsonObject = this.findJsonAttribute(lambdaStep, 'FunctionName');
        if (!functionDetails)
            throw new Error(`Step "${stepName}" doesn't have a lambda function defined`);

        if (functionDetails.FunctionName.indexOf(':') === -1) {
            functionDetails.FunctionName = lambdaName;
            return;
        }

        functionDetails.FunctionName = functionDetails.FunctionName.split(':')
            .map((namePart: string, index: number) => index === config.lambdaNameIndex ? lambdaName : namePart)
            .join(':');
    }

    public updateGenericStep(stepName: string, stepDefinition: JsonObject): void {
        let originalStepDefinition: JsonObject = this.findJsonAttribute(this._definition!.States, stepName) as JsonObject;
        if (!originalStepDefinition)
            throw new Error(`Step "${stepName}" can't be found in step function definition`);

        Object.assign(originalStepDefinition, stepDefinition);
    }
}
