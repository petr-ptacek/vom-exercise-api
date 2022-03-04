import { getCookies } from './../utils';

export type RequestMethod = 'GET' | 'POST' | 'PUT';

export type RequestOptions = {
  url: string,
  method: RequestMethod,
  data?: unknown
};

function createRequestHeaders(): Headers {
  const headers = new Headers();
  const cookies = getCookies();

  headers.append('Content-Type', 'application/json');
  if ( cookies.has('csrftoken') ) {
    headers.append('X-CSRFToken', cookies.get('csrftoken') ?? '');
  }

  return headers;
}

export class HTTPController {
  static makeRequest(options: RequestOptions): Promise<Response> {
    return window.fetch(
      options.url,
      {
        method: options.method,
        headers: createRequestHeaders(),
        body: options.data ? JSON.stringify(options.data) : undefined
      }
    );
  }

  static hasResponseJSONBody(response: Response): boolean {
    const contentType = response.headers.get('content-type');
    return !!(contentType && contentType.includes('application/json'));
  }

  static async parseResponseBodyJSON<T = unknown>(response: Response): Promise<T | undefined> {
    return HTTPController.hasResponseJSONBody(response) ?
      await response.json() :
      undefined;
  }

  static async get(url: string): Promise<Response> {
    return HTTPController.makeRequest({
      method: 'GET',
      url
    });
  }

  static async post(url: string, data = {}): Promise<Response> {
    return await HTTPController.makeRequest({
      method: 'POST',
      url,
      data
    });
  }

  static async put(url: string, data = {}): Promise<Response> {
    return await HTTPController.makeRequest({
      method: 'PUT',
      url,
      data
    });
  }
}
