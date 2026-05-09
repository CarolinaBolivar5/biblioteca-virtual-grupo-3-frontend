const API_URL = 'https://biblioteca-virtual-grupo-3.onrender.com';
const baseUrl = (import.meta.env.VITE_API_URL || API_URL).replace(/\/$/, '');

export const buildApiUrl = (path) => {
    if (/^https?:\/\//i.test(path)) return path;
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

export async function request(path, options = {}) {
    const headers = {
        ...options.headers,
    };

    if (options.body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(buildApiUrl(path), {
        ...options,
        headers,
    });
    const contentType = response.headers.get('content-type') ?? '';
    const data = contentType.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
        const message =
            typeof data === 'object' && data !== null
                ? data.message || data.error || 'Error en la respuesta del servidor'
                : data || 'Error en la respuesta del servidor';
        throw new Error(message);
    }

    return data;
}
