import {SFNClient} from "@aws-sdk/client-sfn";
import {retryAsync} from "ts-retry";
import {config} from "../../config/sfn-config";
import {SfnCommandInput} from "../../types/sfn";

export abstract class SfnCommandRunner<T> {
    constructor(
        protected readonly _sfnClient: SFNClient = new SFNClient(),
        protected input: SfnCommandInput = {} as SfnCommandInput) {
    }

    public runWithRetry(): Promise<T> {
        return retryAsync(() => this.execute(), {delay: config.commandTimeInterval, maxTry: config.commandMaxTry});
    }

    public runOnce(): Promise<T> {
        return this.execute();
    }

    protected abstract execute(): Promise<T>
}

