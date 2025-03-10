import { getEnvironmentVariable } from './getEnvironmentVariable';

export function getServerBaseURL() {
  return getEnvironmentVariable('BASE_URL');
}

export function getClientBaseURL() {
  return window.location.href;
}
