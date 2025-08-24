import axios, { AxiosRequestConfig } from "axios";
export const BE_HOST = "";
const axiosInstance = axios.create({});
axiosInstance.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    const workspaceId = localStorage.getItem("workspaceId");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (workspaceId) {
      config.headers["Workspaceid"] = workspaceId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      const authToken = localStorage.getItem("authToken");
      return new Promise((resolve, reject) => {
        axios
          .post(
            BE_HOST + "/api/v1/token/refresh/",
            {
              token: refreshToken,
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          )
          .then(({ data }) => {
            localStorage.setItem("authToken", data.access);
            axiosInstance.defaults.headers["Authorization"] =
              "Bearer " + data.token;
            originalRequest.headers["Authorization"] = "Bearer " + data.token;
            processQueue(null, data.token);
            resolve(axiosInstance(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            localStorage.removeItem("authToken");
            window.location.href = "/login";
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);
export function callBE(path: string, config?: AxiosRequestConfig) {
  return axiosInstance.request({
    url: BE_HOST + path,
    ...config,
  });
}

export default axiosInstance;
