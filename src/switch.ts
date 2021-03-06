import { execSync } from 'child_process';
import fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import rimraf from 'rimraf';

export const switchTo = (args: any) => {
    console.log(`switching to --cluster=${args.cluster} --namespace=${args.namespace}...`);
    const { cluster, namespace } = args;

    if (cluster) {
        const source = path.resolve(os.homedir(), 'k8s-config');
        const sourceConfig = path.resolve(source, cluster, 'config');
        console.log('will copy ', sourceConfig);

        if (!fs.existsSync(sourceConfig)) {
            const errorMessage = '没有找到目标文件：' + sourceConfig
            console.error(errorMessage);

            if (require.main !== module) {
                throw new Error(errorMessage);
            } else {
                process.exit(1);
            }
        }

        const kubeFolder = path.resolve(os.homedir(), '.kube');
        const kubeBackupFolder = path.resolve(os.homedir(), '.kube.bak');

        if (fs.existsSync(kubeFolder)) {
            if (fs.existsSync(kubeBackupFolder)) {
                rimraf.sync(kubeBackupFolder);
                console.log('deleted ', kubeBackupFolder);

                fs.mkdirSync(kubeBackupFolder, { recursive: true });
            } else {
                fs.mkdirSync(kubeBackupFolder, { recursive: true });
            }

            const oldConfig = path.resolve(kubeFolder, 'config');
            if (fs.existsSync(oldConfig)) {
                fs.renameSync(oldConfig, path.resolve(kubeBackupFolder, 'config'));
            }
        }

        try {
            fs.mkdirSync(kubeFolder, { recursive: true });
            console.log('created ', kubeFolder);
        } catch (ex) {
            console.error(`creating ${kubeFolder} error, but it doesn't matter. `, ex);
            console.log('will continue next steps...');
        }

        const targetConfig = path.resolve(kubeFolder, 'config');
        fs.copyFileSync(sourceConfig, targetConfig);
        console.log('copied from ', sourceConfig, ' to ', targetConfig);
        console.log('file = ', fs.readFileSync(targetConfig));
    }

    console.log('will switching context...', namespace);
    try {
        let currentContext = '';
        currentContext = execSync('kubectl config current-context').toString('utf-8');

        console.log('current context = ', currentContext);

        const output = execSync(
            'kubectl config set-context ' + currentContext.replace('\n', '') + ' --namespace=' + namespace,
        );
        console.log('switched result: ');
        console.log(output.toString('utf-8'));
    } catch (ex) {
        console.error(`switching to --cluster=${args.cluster} --namespace=${args.namespace} failed! `, ex);

        if (require.main === module) {
            process.exit(1);
        } else {
            throw ex;
        }
    }
};