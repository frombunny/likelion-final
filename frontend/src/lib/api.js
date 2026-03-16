import axios from "axios";

const env = import.meta.env;

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const rawApiBase =
  env.VITE_API_BASE_URL || env.VITE_API_BASE || env.VITE_API_URL || "/api";

export const API_BASE_URL = trimTrailingSlash(rawApiBase);

const resolveEndpoint = (envKey, path) => {
  const directUrl = env[envKey];
  if (directUrl) {
    return trimTrailingSlash(directUrl);
  }

  return `${API_BASE_URL}${path}`;
};

export const API_ENDPOINTS = {
  login: resolveEndpoint("VITE_BACKEND_LOGIN_URL", "/users/login"),
  signUp: resolveEndpoint("VITE_BACKEND_SIGNUP_URL", "/users"),
  me: resolveEndpoint("VITE_BACKEND_ME_URL", "/users/me"),
  documents: resolveEndpoint("VITE_BACKEND_DOCUMENTS_URL", "/documents"),
  downloadDocuments: resolveEndpoint("VITE_BACKEND_DOCUMENTS_DOWNLOAD_URL", "/documents/download"),
  winners: resolveEndpoint("VITE_BACKEND_WINNERS_URL", "/votes/winners"),
  chats: resolveEndpoint("VITE_BACKEND_CHATS_URL", "/chats"),
};

const resolveOrigin = () => {
  if (/^https?:\/\//.test(API_BASE_URL)) {
    return new URL(API_BASE_URL).origin;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
};

export const BACKEND_ORIGIN = resolveOrigin();

export const resolveAssetUrl = (value) => {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//.test(value)) {
    return value;
  }

  const origin = BACKEND_ORIGIN || (typeof window !== "undefined" ? window.location.origin : "");
  return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
};

export const getWsBaseUrl = () => {
  if (env.VITE_BACKEND_WS_URL) {
    return trimTrailingSlash(env.VITE_BACKEND_WS_URL);
  }

  return BACKEND_ORIGIN;
};

export const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
