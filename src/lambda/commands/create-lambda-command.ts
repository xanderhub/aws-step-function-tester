import {LambdaCommandRunner} from "../lambda-command-runner";
import {CreateFunctionCommand, CreateFunctionRequest, Environment, Runtime} from "@aws-sdk/client-lambda";
import {FunctionCode} from "@aws-sdk/client-lambda/dist-types/models/models_0";
import {LambdaCommandOutput} from "../../types/lambda";

export class CreateLambdaCommand extends LambdaCommandRunner {

    public withRuntime(runtime: Runtime | undefined) {
        this.input.Runtime = runtime;
        return this;
    }

    public withRole(role: string | undefined) {
        this.input.Role = role;
        return this;
    }

    public withHandler(handler: string | undefined) {
        this.input.Handler = handler;
        return this;
    }

    public withDescription(description: string) {
        this.input.Description = description;
        return this;
    }

    public withTimeout(timeout: number | undefined) {
        this.input.Timeout = timeout;
        return this;
    }

    public withMemorySize(memorySize: number | undefined) {
        this.input.MemorySize = memorySize;
        return this;
    }

    public withEnvironment(environment: Environment | undefined) {
        this.input.Environment = environment;
        return this;
    }

    public withCode(code: FunctionCode) {
        this.input.Code = code;
        return this;
    }

    protected execute(): Promise<LambdaCommandOutput> {
        return this._lambdaClient.send(new CreateFunctionCommand(this.input as CreateFunctionRequest));
    }
}
