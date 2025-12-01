import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '../redux/store';
import { setTokens, logout } from '../redux/slices/authSlice';
import Config from 'react-native-config';
import { showToastable } from 'react-native-toastable';
import { getGlobalConnection, subscribeToNetInfo } from '../utils/netInfo';
import { endpoints } from '../utils/endpoints';

// const API_BASE_URL = Config.API_BASE_URL;
// const API_BASE_URL = "https://kisaniurja-dev-api.appskeeper.in/";
const API_BASE_URL = 'https://kisaniurja-dev-api.appskeeper.in/';
class ApiClient {
  private client: AxiosInstance;
  private isRefreshing: boolean;
  private failedQueue: any[];
  private offlineQueue: Array<() => void>;
  private isConnected: boolean;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
    });

    this.isRefreshing = false;
    this.failedQueue = [];
    this.offlineQueue = [];
    this.isConnected = getGlobalConnection();

    // Subscribe to network changes
    subscribeToNetInfo(connected => {
      this.isConnected = connected;
      if (connected && this.offlineQueue.length > 0) {
        //console.log('🔄 Internet restored, retrying queued requests...');
        const queued = [...this.offlineQueue];
        this.offlineQueue = [];
        queued.forEach(cb => cb());
      }
    });

    this.setupInterceptors();
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(prom => {
      if (error) prom.reject(error);
      else prom.resolve(token);
    });
    this.failedQueue = [];
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        const data = response.data;
        if (data?.errors?.length) {
          showToastable({
            message: data.errors[0].constraints?.matches || 'Invalid input',
            status: 'danger',
          });
        } else if (data?.message) {
          // showToastable({ message: data.message, status: "success" });
        }
        return response;
      },
      async error => {
        const originalRequest = error.config;
        const { status } = error.response || {};

        // 📴 Offline handling
        if (!this.isConnected) {
          //console.log('📴 No internet, queuing request...');
          return new Promise((resolve, reject) => {
            this.offlineQueue.push(() =>
              this.client(originalRequest).then(resolve).catch(reject),
            );
          });
        }

        // ⚠️ Handle 401/400 (Unauthorized or token expired)
        if (status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue while refreshing
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve: (token: string) => {
                  originalRequest.headers['Authorization'] = `Bearer ${token}`;
                  resolve(this.client(originalRequest));
                },
                reject,
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          const { refreshToken, accessToken } = store.getState().auth;
          if (!refreshToken) {
            //console.log('❌ No refresh token — logging out');
            // store.dispatch(logout());
            return Promise.reject(error);
          }
          try {
            const response = await axios.post(
              `${API_BASE_URL}${endpoints.auth.refreshToken}`,
              {}, // empty body
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${refreshToken}`,
                  language: store.getState().language.current || 'en',
                },
                timeout: 10000,
              },
            );

            // Handle successful response
            //console.log('Token refreshed successfully:', response.data);

            const tokens = response.data?.data?.tokens;
            const newAccessToken = tokens?.accessToken;
            const newRefreshToken = tokens?.refreshToken || refreshToken;

            if (!newAccessToken)
              throw new Error('No access token in refresh response');

            // ✅ Save tokens to Redux
            store.dispatch(
              setTokens({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              }),
            );

            // ✅ Process pending queue
            this.processQueue(null, newAccessToken);

            // ✅ Retry original request with new token
            originalRequest.headers['Authorization'] =
              `Bearer ${newAccessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            // store.dispatch(logout());
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // 🚨 Other API errors
        if (error.response?.data?.message) {
          showToastable({
            message: error.response.data.message,
            status: 'danger',
          });
        }

        return Promise.reject(error);
      },
    );
  }

  // ------------------------
  // API methods
  // ------------------------

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config).then(res => res.data);
  }

  post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config).then(res => res.data);
  }

  put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config).then(res => res.data);
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config).then(res => res.data);
  }

  patch<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.patch(url, data, config).then(res => res.data);
  }

  patch2<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const { accessToken } = store.getState().auth;
    const { current: language } = store.getState().language;

    const headers: Record<string, string> = {
      ...(config?.headers || {}),
      language: language || 'en',
    };

    if (accessToken && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const finalConfig = { ...config, headers };

    //console.log('🚀 PATCH URL:', url);
    //console.log('🚀 PATCH HEADERS:', finalConfig.headers);
    //console.log('🚀 PATCH DATA:', JSON.stringify(data, null, 2));

    return this.client.patch(url, data, finalConfig).then(res => res.data);
  }

  // ------------------------
  // Enhanced custom helpers
  // ------------------------

  get2<T>(
    url: string,
    config?: AxiosRequestConfig,
    payload?: Record<string, any>,
  ): Promise<T> {
    const { accessToken } = store.getState().auth;
    const { current: language } = store.getState().language;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(config?.headers || {}),
      language: language || 'en',
    };

    if (accessToken && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const finalConfig: AxiosRequestConfig = {
      ...config,
      headers,
      params: payload || config?.params || {},
    };

    //console.log('🚀 GET HEADERS:', finalConfig.headers);
    //console.log('🚀 GET PARAMS:', finalConfig.params);

    return this.client.get(url, finalConfig).then(res => res.data);
  }

  post2<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const { accessToken } = store.getState().auth;
    const { current: language } = store.getState().language;

    const headers: Record<string, string> = {
      ...(config?.headers || {}),
      language: language || 'en',
    };

    if (accessToken && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const finalConfig = { ...config, headers };

    //console.log('🚀 POST URL:', url);
    //console.log('🚀 POST HEADERS:', finalConfig.headers);
    //console.log('🚀 POST DATA:', JSON.stringify(data, null, 2));

    return this.client.post(url, data, finalConfig).then(res => res.data);
  }

  delete2<T>(
    url: string,
    config?: AxiosRequestConfig,
    customHeaders?: Record<string, string>,
  ): Promise<T> {
    const { accessToken } = store.getState().auth;
    const { current: language } = store.getState().language;

    const headers: Record<string, string> = {
      ...(config?.headers || {}),
      language: language || 'en',
      ...(customHeaders || {}),
    };

    if (accessToken && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const finalConfig: AxiosRequestConfig = { ...config, headers };

    //console.log('🚀 DELETE URL:', url);
    //console.log('🚀 DELETE HEADERS:', finalConfig.headers);

    return this.client.delete(url, finalConfig).then(res => res.data);
  }
}

export default new ApiClient(API_BASE_URL);
