import { Argv } from 'yargs';
import fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import rimraf from 'rimraf';
import shelljs from 'shelljs';

require('yargs').command(
  'switch',
  'switch clusters and namespace',
  (yargs: Argv) => {
    yargs
      .option('cluster', {
        describe: 'cluster name to switch',
        default: 'k8s-non-prod-hangzhou',
      })
      .option('namespace', {
        describe: 'namespace to switch',
        default: 'dev',
      });
  },
  (args: any) => {
    console.log('switching to ', args.cluster, args.namespace, '...');
    const { cluster, namespace } = args;

    const source = path.resolve(os.homedir(), 'k8s-config');
    const sourceConfig = path.resolve(source, cluster, 'config');
    console.log('will copy ', sourceConfig);

    if (!fs.existsSync(sourceConfig)) {
      console.error('没有找到目标文件：', sourceConfig);
      process.exit(1);
    }

    const kubeFolder = path.resolve(os.homedir(), '.kube');
    const kubeBackupFolder = path.resolve(os.homedir(), '.kube.bak');

    if (fs.existsSync(kubeFolder)) {
      if (fs.existsSync(kubeBackupFolder)) {
        rimraf.sync(kubeBackupFolder);
        console.log('deleted ', kubeBackupFolder);
      }

      fs.renameSync(kubeFolder, kubeBackupFolder);
      console.log('backed up ~/.kube to ~/.kube.bak');
    }

    fs.mkdirSync(kubeFolder, { recursive: true });
    console.log('created ', kubeFolder);

    const targetConfig = path.resolve(kubeFolder, 'config');
    fs.copyFileSync(sourceConfig, targetConfig);
    console.log('copied from ', sourceConfig, ' to ', targetConfig);

    console.log('will switching context...', namespace);
    const output = shelljs.exec(
      'kubectl config set-context $(kubectl config current-context)' + ' --namespace=' + namespace,
    );
    console.log('switched result: ');
    console.log(output.stdout);

    if (output.stderr) {
      console.error(output.stderr);
      process.exit(1);
    }
  },
).argv;
