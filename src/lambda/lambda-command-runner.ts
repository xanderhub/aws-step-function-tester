import {LambdaClient} from "@aws-sdk/client-lambda";
import {retryAsync} from "ts-retry";
import {config} from "../config/lambda-config";
import {LambdaCommandInput, LambdaCommandOutput} from "../types/lambda";

export abstract class LambdaCommandRunner {

    constructor(
        protected readonly _lambdaClient: LambdaClient = new LambdaClient({}),
        protected input: LambdaCommandInput = {} as LambdaCommandInput) {
    }

    public withName(name: string | undefined) {
        this.input.FunctionName = name;
        return this;
    }

    public runWithRetry(): Promise<LambdaCommandOutput> {
        return retryAsync(() => this.execute(), {delay: config.commandTimeInterval, maxTry: config.commandMaxTry});
    }

    public runOnce(): Promise<LambdaCommandOutput> {
        return this.execute();
    }

    protected abstract execute(): Promise<LambdaCommandOutput>
}

