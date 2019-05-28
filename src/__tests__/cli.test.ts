import coffee from 'coffee';
import path from 'path';

test('cli starts', async () => {
  await coffee
    .fork('src/index.ts', ['switch', '--cluster=hello', '--namespace=world'], {
      env: {
        TS_NODE_PROJECT: path.resolve(__dirname, '../../tsconfig.json'),
      },
      execArgv: ['--require', require.resolve('ts-node/register/type-check')],
      cwd: path.resolve(__dirname, '../../'),
    })
    .expect('stdout', /^switching to  hello world .../)
    .expect('stderr', '没有找到目标文件： /Users/jefftian/k8s-config/hello/config\n')
    .expect('code', 1)
    .end();
});
