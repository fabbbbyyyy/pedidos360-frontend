const BASE = '/api/report/analytics';

export const createAnalyticsApi = (http) => ({
  get: () => http.get(BASE),
});
