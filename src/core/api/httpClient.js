import { ApiError } from './ApiError';

const STATUS_MESSAGES = {
  0: 'No se pudo conectar con el servidor.',
  400: 'Los datos enviados no son válidos.',
  401: 'Tu sesión expiró o no es válida.',
  403: 'No tienes permiso para realizar esta acción.',
  404: 'No se encontró el recurso.',
  409: 'La operación entra en conflicto con el estado actual (por ejemplo, stock insuficiente).',
};

const parse = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

// El helper success() del backend puede responder el objeto directo o envuelto en { data }.
// Si cambia el formato, se ajusta SOLO acá.
const unwrap = (json) =>
  json && typeof json === 'object' && !Array.isArray(json) && 'data' in json ? json.data : json;

function extractMessage(json) {
  if (typeof json === 'string' && json) return json;
  const candidate = json?.message ?? json?.error;
  return typeof candidate === 'string' ? candidate : null;
}

export function createHttpClient({ baseUrl, getToken }) {
  async function request(method, path, body) {
    const token = await getToken();
    const hasBody = body !== undefined;

    let response;
    try {
      response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(hasBody && { 'Content-Type': 'application/json' }),
        },
        body: hasBody ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw new ApiError(STATUS_MESSAGES[0], 0);
    }

    const text = await response.text();
    const json = text ? parse(text) : null;

    if (!response.ok) {
      throw new ApiError(
        extractMessage(json) ?? STATUS_MESSAGES[response.status] ?? `Error ${response.status}`,
        response.status,
        json,
      );
    }
    return unwrap(json);
  }

  return {
    get: (path) => request('GET', path),
    post: (path, body = {}) => request('POST', path, body),
    put: (path, body = {}) => request('PUT', path, body),
    delete: (path) => request('DELETE', path),
  };
}
