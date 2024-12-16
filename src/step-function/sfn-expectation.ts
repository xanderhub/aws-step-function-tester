import {SfnExecution} from "./sfn-execution";
import {ExecutionStatus} from "@aws-sdk/client-sfn";
import {retryAsync} from "ts-retry";
import {config} from "../config/sfn-config";

export class SfnExpectation {
    private static _currentExpectation: SfnExpectation;

    private static get currentExpectation(): SfnExpectation {
        return this._currentExpectation;
    }

    static get currentExecutionArn(): string | undefined {
        return this._currentExpectation?.execution?.executionArn;
    }

    constructor(private readonly execution: SfnExecution) {
        SfnExpectation._currentExpectation = this;
    }

    public static expect(execution: SfnExecution): SfnExpectation {
        if (!execution.executionArn) {
            throw new Error(`Can't expect anything from the step function that hasn't been defined or executed.`);
        }
        if (SfnExpectation.currentExecutionArn === execution.executionArn) {
            return SfnExpectation.currentExpectation;
        }
        return new SfnExpectation(execution);
    }

    public async toFail(): Promise<void> {
        await this.waitUntilExecutionCompleted();
        await this.assertExecutionStatus(ExecutionStatus.FAILED)
    }

    public async toFailWithin(timeoutMs: number): Promise<void> {
        await this.waitUntilExecutionCompleted(timeoutMs);
        await this.assertExecutionStatus(ExecutionStatus.FAILED);
    }

    public async toSuccess(): Promise<void> {
        await this.waitUntilExecutionCompleted();
        await this.assertExecutionStatus(ExecutionStatus.SUCCEEDED)
    }

    public async toSuccessWithin(timeoutMs: number): Promise<void> {
        await this.waitUntilExecutionCompleted(timeoutMs);
        await this.assertExecutionStatus(ExecutionStatus.SUCCEEDED);
    }

    public async toExecuteStep(stepName: string): Promise<void> {
        await this.waitUntilExecutionCompleted();
        await this.assertStepExecution(stepName);
    }

    public async toExecuteStepWithin(stepName: string, timeoutMs: number): Promise<void> {
        await this.waitUntilExecutionCompleted(timeoutMs);
        await this.assertStepExecution(stepName);
    }

    private async assertStepExecution(stepName: string): Promise<void> {
        console.log(`Expecting step "${stepName}" to be executed`);
        const step = await this.execution.getExecutionHistory()
            .then(events => events.find(event =>
                event.stateEnteredEventDetails?.name === stepName));

        if (!step) {
            throw new Error(`Expected step "${stepName}" hasn't been executed`);
        }
    }

    private async assertExecutionStatus(expectedStatus: ExecutionStatus): Promise<void> {
        console.log(`Expecting step function to have status ${expectedStatus}`);
        if (this.execution.status !== expectedStatus) {
            throw new Error(`Expected execution status: ${expectedStatus}, but got: ${this.execution.status}`);
        }
    }

    private async waitUntilExecutionCompleted(timeoutMs?: number): Promise<void> {
        if (this.execution.isCompleted()) {
            return;
        }
        console.log(`Waiting for step function to finish...`);
        await retryAsync(() => this.tryGetCompletedExecution(),
            {
                delay: config.expectTimeInterval,
                maxTry: timeoutMs ? Math.ceil(timeoutMs / config.expectTimeInterval) : config.expectMaxTry
            });
    }

    private async tryGetCompletedExecution(): Promise<SfnExecution> {
        const execution = await this.execution.getExecution();
        if (!execution.isCompleted()) {
            throw new Error(`Execution hasn't been complete yet`);
        }

        return execution;
    }
}

export const expect = SfnExpectation.expect;
