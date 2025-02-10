import {SFNClient} from "@aws-sdk/client-sfn";
import {GetSfnCommand} from "./commands/control/get-sfn-command";
import {CreateSfnCommand} from "./commands/control/create-sfn-command";
import {SfnInstance} from "./sfn-instance";
import {DeleteSfnCommand} from "./commands/control/delete-sfn-command";
import {config} from "../config/sfn-config";
import {ControlCommandOutput} from "../types/sfn";

export class SfnManager {
    private static readonly snfClient = new SFNClient();

    private static getStepFunction(snfArn: string): Promise<ControlCommandOutput> {
        return new GetSfnCommand(this.snfClient).withArn(snfArn).runOnce();
    }

    public static copyExists(snfArn: string): Promise<boolean> {
        return this.getStepFunction(snfArn)
            .then(() => true)
            .catch(() => false);
    }

    public static async createCopyStepFunction(sfnArn: string): Promise<SfnInstance> {
        if (await SfnManager.copyExists(sfnArn + config.copySfnNameSuffix)) {
            console.log("Copy of the step function already exists, deleting...");
            await SfnManager.deleteCopyStepFunction(sfnArn + config.copySfnNameSuffix);
        }

        const sourceSfn = await SfnManager.getStepFunction(sfnArn);
        const createSfnResult = await new CreateSfnCommand()
            .withType(sourceSfn.type)
            .withName(sourceSfn.name + config.copySfnNameSuffix)
            .withDefinition(sourceSfn.definition)
            .withLoggingConfiguration(sourceSfn.loggingConfiguration)
            .withRole(sourceSfn.roleArn)
            .withType(sourceSfn.type)
            .runWithRetry();

        const newSfn = await SfnManager.getStepFunction(createSfnResult.stateMachineArn!);

        console.log(`Step function ${newSfn.name} created`);
        return new SfnInstance(newSfn, SfnManager.snfClient);
    }

    public static async deleteCopyStepFunction(sfnArn: string): Promise<ControlCommandOutput> {
        return new DeleteSfnCommand(SfnManager.snfClient)
            .withArn(sfnArn)
            .runWithRetry();
    }
}

export const createCopyStepFunction = SfnManager.createCopyStepFunction;
export const deleteCopyStepFunction = SfnManager.deleteCopyStepFunction;
