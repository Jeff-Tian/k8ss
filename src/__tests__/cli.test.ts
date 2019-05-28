import coffee from 'coffee';
import path from 'path';

test('cli starts', async () => {
  await coffee.fork('../index.ts', ['cluster', 'namespace'], {
    env: {
      TS_NODE_PROJECT: path.resolve(__dirname, './fixtures/tsconfig.json'),
    },
    execArgv: ['--require', require.resolve('ts-node/register/type-check')],
    cwd: path.resolve(__dirname, '../'),
  });
});
