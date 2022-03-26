import axios from 'axios';
import qs from 'qs';

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

export const login = async () => {
  console.log('getting user code and device code...');
  const codes = await getUserCodeAndDeviceCode();
  console.log('codes = ', codes);
};
