import coffee from 'coffee';
import path from 'path';

test('cli starts', async () => {
  await coffee
    .fork('src/index.ts', ['cluster', 'namespace'], {
      env: {
        TS_NODE_PROJECT: path.resolve(__dirname, '../../tsconfig.json'),
      },
      execArgv: ['--require', require.resolve('ts-node/register/type-check')],
      cwd: path.resolve(__dirname, '../../'),
    })
    .expect('stdout', /^switching.../)
    .expect('stderr', '')
    .expect('code', 0)
    .end();
});
