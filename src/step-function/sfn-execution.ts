import {ExecutionStatus, HistoryEvent, SFNClient} from "@aws-sdk/client-sfn";
import {GetExecutionSfnCommand} from "./commands/execution/get-execution-sfn-command";
import {GetExecutionHistorySfnCommand} from "./commands/execution/get-execution-history-sfn-command";
import {ExecutionCommandOutput} from "../types/sfn";


export class SfnExecution {
    private readonly _executionArn: string;
    private readonly _startDate: Date;
    private _status?: ExecutionStatus;
    private _input?: string;
    private _output?: string;
    private _error?: string;
    private _executionHistory: HistoryEvent[] = [];

    get input(): string | undefined {
        return this._input;
    }

    get output(): string | undefined {
        return this._output;
    }

    get executionArn(): string {
        return this._executionArn;
    }

    get startDate(): Date {
        return this._startDate;
    }

    get status(): ExecutionStatus | undefined {
        return this._status;
    }

    get error(): string | undefined {
        return this._error;
    }

    private updateExecution(execution: ExecutionCommandOutput): void {
        this._status = execution.status;
        this._error = execution.error;
        this._input = execution.input;
        this._output = execution.output;
    }

    public isCompleted(): boolean {
        return (this.status == ExecutionStatus.FAILED
            || this.status == ExecutionStatus.SUCCEEDED
            || this.status == ExecutionStatus.TIMED_OUT
            || this.status == ExecutionStatus.ABORTED);
    }

    constructor(startExecution: ExecutionCommandOutput,
                private readonly _sfnClient: SFNClient = new SFNClient({})) {
        this._executionArn = startExecution.executionArn!
        this._startDate = startExecution.startDate!
    }

    public async getExecution(): Promise<SfnExecution> {
        if (!this.isCompleted()) {
            const result = await new GetExecutionSfnCommand(this._sfnClient)
                .withExecutionArn(this._executionArn)
                .runOnce();

            this.updateExecution(result);
        }
        return this;
    }

    public async getExecutionHistory(): Promise<HistoryEvent[]> {
        if (this.isCompleted() && this._executionHistory.length == 0) {
            let nextToken: string | undefined = undefined;

            do {
                const response: ExecutionCommandOutput = await new GetExecutionHistorySfnCommand(this._sfnClient)
                    .withExecutionArn(this.executionArn)
                    .withNextToken(nextToken)
                    .runOnce();

                this._executionHistory!.push(...(response.events || []));
                nextToken = response.nextToken;
            } while (nextToken);
        }

        return this._executionHistory;
    }
}
