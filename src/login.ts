import axios from 'axios';
import qs from 'qs';
import { exec } from 'child_process';
import * as util from 'util';

const getUserCodeAndDeviceCode = async () => {
  try {
    const { data } = await axios({
      method: 'post',
      url: 'https://keycloak.jiwai.win/auth/realms/UniHeart/protocol/openid-connect/auth/device',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        client_id: 'demoapp',
      }),
    });

    return data;
  } catch (ex) {
    console.error(ex);
    throw ex;
  }
};

const openBrowser = async ({ verification_uri, user_code }: Record<string, string>) => {
  console.log('请打开浏览器并浏览至： ', verification_uri, ' , 然后在打开的页面中输入 ', user_code);

  exec(`start ${verification_uri}`);
};

const pollToken = async ({ device_code }: Record<string, string>): Promise<Record<string, string>> => {
  try {
    let { data } = await axios({
      method: 'post',
      url: 'https://keycloak.jiwai.win/auth/realms/UniHeart/protocol/openid-connect/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        client_id: 'demoapp',
        device_code,
      }),
    });
    console.log('本次查询令牌的结果是： ', data);

    return data;
  } catch (ex) {
    if (ex.response && ex.response.status === 400) {
      if (ex.response?.data?.error === 'authorization_pending') {
        console.log('等待 5 秒，再查……');
        await sleep(5);
        return await pollToken({ device_code });
      }

      if (ex.response?.data?.error === 'slow_down') {
        console.error('查询无效，因为 ', ex.response?.data?.error_description, '\n 传入的参数是： ', { device_code });

        throw new Error(
          '查询无效，因为 ' +
            ex.response?.data?.error_description +
            '\n 传入的参数是： ' +
            JSON.stringify({ device_code }),
        );
      }

      if (ex.response?.data?.error === 'invalid_grant') {
        console.error('查询无效，因为 ', ex.response?.data?.error_description, '\n 传入的参数是： ', { device_code });

        throw new Error(
          '查询无效，因为 ' +
            ex.response?.data?.error_description +
            '\n 传入的参数是： ' +
            JSON.stringify({ device_code }),
        );
      }

      if (ex.response?.data?.error === 'expired_token') {
        console.error('超时了！本次登录失败，请重新发起登录！\n传入的参数是： ', { device_code });

        throw new Error(`超时了！本次登录失败，请重新发起登录！
传入的参数： ${JSON.stringify({ device_code })}`);
      }
    }

    console.error(ex.response?.data);
    throw ex;
  }
};

const sleep = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

export const login = async () => {
  console.log('getting user code and device code...');
  const codes = await getUserCodeAndDeviceCode();
  console.log('codes = ', codes);
  await openBrowser(codes);
  console.log('\n\n\n\n等待输入授权码……');
  await sleep(8);
  console.log('开始查询登录结果……');
  const res = await pollToken(codes);
  console.log('最终轮询结果是： ', res);
  console.log('登录成功！');
};
