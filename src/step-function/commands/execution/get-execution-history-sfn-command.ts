import {SfnCommandRunner} from "../sfn-command-runner";
import {GetExecutionHistoryCommand} from "@aws-sdk/client-sfn";
import {GetExecutionHistoryInput} from "@aws-sdk/client-sfn/dist-types/models/models_0";
import {ExecutionCommandOutput} from "../../../types/sfn";

export class GetExecutionHistorySfnCommand extends SfnCommandRunner<ExecutionCommandOutput> {
    public withExecutionArn(arn: string) {
        this.input.executionArn = arn;
        return this;
    }

    public withNextToken(nextToken: string | undefined) {
        this.input.nextToken = nextToken;
        return this;
    }

    protected execute(): Promise<ExecutionCommandOutput> {
        return this._sfnClient.send(new GetExecutionHistoryCommand(this.input as GetExecutionHistoryInput));
    }
}
