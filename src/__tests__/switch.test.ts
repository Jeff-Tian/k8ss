import os from 'os';
import path from 'path';

test('switch between clusters won\'t affect existing other files', async () => {
    jest.mock('fs');

    const fs = require('fs');
    const mockFiles = {
        [path.resolve(os.homedir(), '.kube/config')]: 'config',
        [path.resolve(os.homedir(), '.kube/file1')]: 'file1',
        [path.resolve(os.homedir(), 'k8s-config/cluster1/config')]: 'cluster1',
        [path.resolve(os.homedir(), 'k8s-config/cluster2/config')]: 'cluster2'
    };
    fs.__setMockFiles(mockFiles);

    const configFilePath = path.resolve(os.homedir(), '.kube/config');
    const getConfig = () => fs.readFileSync(configFilePath);

    const { switchTo } = require('../switch');

    console.log('configFilePath = ', configFilePath);
    const config = getConfig();
    console.log('config = ', config);
    expect(config).toEqual('config');

    switchTo({ cluster: 'cluster1', namespace: 'name' })

    expect(getConfig()).toEqual('cluster1');
})
