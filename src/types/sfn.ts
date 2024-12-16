import {
    CreateStateMachineInput,
    CreateStateMachineOutput,
    DeleteStateMachineCommandOutput,
    DescribeExecutionOutput,
    DescribeStateMachineOutput,
    StartExecutionOutput
} from "@aws-sdk/client-sfn";
import {
    DescribeExecutionInput,
    DescribeStateMachineInput,
    GetExecutionHistoryInput,
    GetExecutionHistoryOutput,
    StartExecutionInput
} from "@aws-sdk/client-sfn/dist-types/models/models_0";

// Type for handling all the commands that manipulate step functions
export type ControlCommandOutput = Partial<CreateStateMachineOutput>
    & Partial<DeleteStateMachineCommandOutput>
    & Partial<DescribeStateMachineOutput>;

// Type for aggregating all the commands that deal with step function execution and history of execution
export type ExecutionCommandOutput = Partial<StartExecutionOutput>
    & Partial<DescribeExecutionOutput>
    & Partial<GetExecutionHistoryOutput>

export type SfnCommandInput = DescribeStateMachineInput
    & CreateStateMachineInput
    & StartExecutionInput
    & DescribeExecutionInput
    & GetExecutionHistoryInput;
