import { Argv } from 'yargs';

console.info('switching...');

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
    console.log(args.cluster, args.namepsace);
  },
);
