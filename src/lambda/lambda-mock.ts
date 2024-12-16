import {FunctionCode} from "@aws-sdk/client-lambda/dist-types/models/models_0";
import {UpdateLambdaConcurrencyCommand} from "./commands/update-lambda-concurrency-command";
import {UpdateLambdaCodeCommand} from "./commands/update-lambda-code-command";
import {readFile} from "fs/promises";
import path from "path";
import {UpdateLambdaConfigurationCommand} from "./commands/update-lambda-configuration-command";
import {LambdaClient, LastUpdateStatus} from "@aws-sdk/client-lambda";
import {DeleteLambdaConcurrencyCommand} from "./commands/delete-lambda-concurrency-command";
import {PathLike} from "node:fs";
import {GetLambdaCommand} from "./commands/get-lambda-command";
import {retryAsync} from "ts-retry";
import {config} from "../config/lambda-config";
import {LambdaCommandOutput} from "../types/lambda";
import {LambdaMockManager} from "./lambda-mock-manager";

export class LambdaMock {
    private readonly initialMockState: LambdaCommandOutput;

    constructor(
        private readonly lambdaClient: LambdaClient = new LambdaClient({}),
        private readonly mockLambda: LambdaCommandOutput) {
        this.initialMockState = LambdaMock.deepCopy(mockLambda);
    };

    get name(): string {
        return this.mockLambda.FunctionName as string;
    }

    private static deepCopy(mockLambda: LambdaCommandOutput): LambdaCommandOutput {
        return JSON.parse(JSON.stringify(mockLambda));
    }

    private async buildUpdateLambdaCodeCommand(sourceCodePath: PathLike): Promise<UpdateLambdaCodeCommand> {
        const code: FunctionCode = {
            ZipFile: await readFile(sourceCodePath)
        };

        return new UpdateLambdaCodeCommand(this.lambdaClient)
            .withName(this.mockLambda.FunctionName)
            .withCode(code);
    }

    private async validateLambdaUpdated(operation: () => Promise<LambdaCommandOutput>): Promise<LambdaCommandOutput> {
        const result = await operation();
        await retryAsync(async () => {
                const lambda = await new GetLambdaCommand()
                    .withName(this.mockLambda.FunctionName)
                    .runOnce();

                if (lambda?.Configuration?.LastUpdateStatus !== LastUpdateStatus.Successful) {
                    throw new Error(`Lambda "${this.name}" hasn't been updated yet`);
                }
            }
            , {delay: config.validationTimeInterval, maxTry: config.validationMaxTry});
        return result;
    }

    public async throttle(): Promise<LambdaCommandOutput> {
        console.log(`Setting lambda "${this.name}" to throttle`);
        return this.validateLambdaUpdated(() =>
            new UpdateLambdaConcurrencyCommand(this.lambdaClient)
                .withName(this.name)
                .withConcurrency(config.minimalConcurrency)
                .runWithRetry()
        );
    }

    public async timeout(): Promise<LambdaCommandOutput> {
        const updateCodeCommand =
            await this.buildUpdateLambdaCodeCommand(path.join(config.mocks.sourcePath, config.mocks.timeout.source));

        const updateConfigCommand = new UpdateLambdaConfigurationCommand(this.lambdaClient)
            .withName(this.mockLambda.FunctionName)
            .withTimeout(config.minimalTimeout)
            .withHandler(config.mocks.timeout.handler);

        console.log(`Setting lambda "${this.name}" to timeout`);
        return this.validateLambdaUpdated(() =>
            updateCodeCommand.runWithRetry().then(() => updateConfigCommand.runWithRetry()));
    }

    public async memoryOverload(): Promise<LambdaCommandOutput> {
        const updateCodeCommand =
            await this.buildUpdateLambdaCodeCommand(path.join(config.mocks.sourcePath, config.mocks.memoryOverload.source));

        const updateConfigCommand = new UpdateLambdaConfigurationCommand(this.lambdaClient)
            .withName(this.mockLambda.FunctionName)
            .withHandler(config.mocks.memoryOverload.handler);

        console.log(`Setting lambda "${this.name}" to run out of memory`);
        return this.validateLambdaUpdated(() =>
            updateCodeCommand.runWithRetry().then(() => updateConfigCommand.runWithRetry()));
    }

    public async genericError(): Promise<LambdaCommandOutput> {
        const updateCodeCommand =
            await this.buildUpdateLambdaCodeCommand(path.join(config.mocks.sourcePath, config.mocks.genericError.source));

        const updateConfigCommand = new UpdateLambdaConfigurationCommand(this.lambdaClient)
            .withName(this.mockLambda.FunctionName)
            .withHandler(config.mocks.genericError.handler);

        console.log(`Setting lambda "${this.name}" to fail with generic error`);
        return this.validateLambdaUpdated(() =>
            updateCodeCommand.runWithRetry().then(() => updateConfigCommand.runWithRetry()));
    }

    public async custom(sourceCodePath: PathLike, handler: string): Promise<LambdaCommandOutput> {
        const updateCodeCommand =
            await this.buildUpdateLambdaCodeCommand(sourceCodePath);

        const updateConfigCommand = new UpdateLambdaConfigurationCommand(this.lambdaClient)
            .withName(this.mockLambda.FunctionName)
            .withHandler(handler);

        console.log(`Setting lambda "${this.name}" to have custom logic`);
        return this.validateLambdaUpdated(() =>
            updateCodeCommand.runWithRetry().then(() => updateConfigCommand.runWithRetry()));
    }

    public async reset(): Promise<LambdaCommandOutput> {
        const updateCodeCommand = new UpdateLambdaCodeCommand(this.lambdaClient)
            .withName(this.mockLambda.FunctionName)
            .withCode(await LambdaMockManager.getLambdaCode(this.initialMockState.Code?.Location as string));

        const updateConfigCommand = new UpdateLambdaConfigurationCommand(this.lambdaClient)
            .withName(this.mockLambda.FunctionName)
            .withTimeout(this.initialMockState.Timeout)
            .withHandler(this.initialMockState.Handler);

        const deleteConcurrencyCommand = new DeleteLambdaConcurrencyCommand(this.lambdaClient)
            .withName(this.mockLambda.FunctionName);

        console.log(`Resetting lambda "${this.name}" to it's original state`);
        return this.validateLambdaUpdated(() =>
            updateCodeCommand.runWithRetry()
                .then(() => updateConfigCommand.runWithRetry()
                    .then(() => deleteConcurrencyCommand.runWithRetry())));
    }
}
