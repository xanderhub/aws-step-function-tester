import {
    CreateFunctionCommandInput,
    CreateFunctionCommandOutput,
    DeleteFunctionCommandInput,
    DeleteFunctionCommandOutput,
    GetFunctionCommandInput,
    GetFunctionCommandOutput,
    PutFunctionConcurrencyCommandInput,
    PutFunctionConcurrencyCommandOutput,
    UpdateFunctionCodeCommandInput,
    UpdateFunctionCodeCommandOutput
} from "@aws-sdk/client-lambda";

export type LambdaCommandInput =
    GetFunctionCommandInput
    & CreateFunctionCommandInput
    & DeleteFunctionCommandInput
    & PutFunctionConcurrencyCommandInput
    & UpdateFunctionCodeCommandInput;

export type LambdaCommandOutput =
    GetFunctionCommandOutput
    & CreateFunctionCommandOutput
    & DeleteFunctionCommandOutput
    & PutFunctionConcurrencyCommandOutput
    & UpdateFunctionCodeCommandOutput;
