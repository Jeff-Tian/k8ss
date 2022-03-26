import axios from 'axios';
import qs from 'qs';
import { exec } from 'child_process';

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

export const login = async () => {
  console.log('getting user code and device code...');
  const codes = await getUserCodeAndDeviceCode();
  console.log('codes = ', codes);
  await openBrowser(codes);
};
