import axios from 'axios';

import { ENV_CONFIG } from '../config-global';
import { clearAccessToken, saveAccessToken, showAlertPop, store } from '../store';

import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { NextLabResponse } from '../types/response';

const EXCEL_DOWNLOAD_API_PREFIX = '/cmmn/excl-dnld/';
const GLOBAL_ERROR_CODES = new Set([
  'ERR_10002',
  'ERR_10003',
  'ERR_10004',
  'nxl-core-status-erro-102',
  'nxl-core-status-erro-104',
]);

const axiosInstance = (() => {
  const config: AxiosRequestConfig = {
    baseURL: ENV_CONFIG.APP_API_BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    timeout: 60 * 1000, // 60 seconds timeout
  };

  const instance: AxiosInstance = axios.create(config);

  const adminReq = async (reqConfig: InternalAxiosRequestConfig) => {
    // TODO: 공통 로딩 처리

    const { token } = store.getState();

    // 새로고침 대비해서 store에서 가져와서 세팅
    if (!reqConfig.headers.authorization) {
      if (token.accessToken) {
        reqConfig.headers.authorization = token.accessToken;
      }
    }

    return reqConfig;
  };

  const adminRes = (res: AxiosResponse<NextLabResponse<any>>) => {
    // 새로운 Access Token 받음
    if (res.headers.authorization) {
      const newAccessToken = res.headers.authorization;
      instance.defaults.headers.authorization = `${newAccessToken}`;
      store.dispatch(saveAccessToken(newAccessToken));
    }

    // isSuccess를 내려주지 않는 API(NAB 고객AI 등)는 정상 응답으로 통과시킨다.
    if (res.data.isSuccess === false) {
      const code = res.data.code || '';

      if (res.config.url?.startsWith(EXCEL_DOWNLOAD_API_PREFIX) && !GLOBAL_ERROR_CODES.has(code)) {
        return res;
      }

      // 예상치 못한 서버오류
      if (res.data.code === 'ERR_00001' || res.data.code === 'nxl-core-status-erro-102') {
        store.dispatch(
          showAlertPop({
            title: `서버오류 ${res.data.code}`,
            content: res.data.message || '서버에 오류가 발생하였습니다.',
          })
        );
      }
      // Access, Refresh Token이 모두 만료 됨. store의 만료된 access token 삭제
      else if (res.data.code === 'ERR_10002' || res.data.code === 'nxl-core-status-erro-102') {
        store.dispatch(clearAccessToken());
        delete instance.defaults.headers.authorization;

        store.dispatch(
          showAlertPop({
            title: `로그인 세션 만료 ${res.data.code}`,
            content: '로그인 세션이 만료되었습니다. 재로그인 해주세요.',
            closeCallback: () => {
              // 만료되면 로그인 페이지로 이동
              window.location.href = '/';
            },
          })
        );
      }
      // 로그인을 안하고 API에 접근시 발생
      else if (res.data.code === 'ERR_10003' || res.data.code === 'nxl-core-status-erro-104') {
        store.dispatch(
          showAlertPop({
            title: `로그인 오류 ${res.data.code}`,
            content: '로그인 처리 중 오류가 발생하였습니다. 재로그인 해주세요.',
            closeCallback: () => {
              window.location.href = '/';
            },
          })
        );
      }
      // API 접근 권한 오류
      else if (res.data.code === 'ERR_10004' || res.data.code === 'nxl-core-status-erro-104') {
        store.dispatch(
          showAlertPop({
            title: `접근 권한 안내 ${res.data.code}`,
            content: '서비스를 호출할 수 있는 권한이 존재하지 않습니다.',
          })
        );
      }
      // cos용 에러 처리 -- cos에서만 에러팝업이 뜨도록 처리함
      else if (res.config.url?.startsWith('/cos/adm/')) {
        store.dispatch(
          showAlertPop({
            title: `서버오류 ${(res && res.data && res.data.code) || ''}`,
            content: res?.data?.message ?? '서버에서 오류가 발생했습니다.',
            preLine: true,
          })
        );
      }
      // 기타 오류들 (각자 처리)
      else {
        console.error(res.data);
        throw new Error(res.data.message);
      }
    }

    return res;
  };

  const adminError = async (error: AxiosError) => {
    console.error(error);
    return Promise.reject(error);
    // return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  };

  instance.interceptors.request.use(adminReq, adminError);
  instance.interceptors.response.use(adminRes, adminError);

  return instance;
})();

export default axiosInstance;
