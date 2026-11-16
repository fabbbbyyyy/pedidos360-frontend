import { describe, expect, it, vi } from 'vitest';
import { createAnalyticsApi } from './analyticsApi';

describe('analytics API', () => {
  it('consulta el reporte de analytics', async () => {
    const http = { get: vi.fn().mockResolvedValue({ minuteMetrics: [], statusMetrics: [] }) };
    const api = createAnalyticsApi(http);

    await api.get();

    expect(http.get).toHaveBeenCalledWith('/api/report/analytics');
  });
});
