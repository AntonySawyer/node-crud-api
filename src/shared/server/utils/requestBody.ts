import { IncomingMessage } from 'http';

export const getRequestBody = async <TBody>(request: IncomingMessage): Promise<TBody | null> => {
  const buffers: Uint8Array[] = [];

  // TODO
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of request) {
    buffers.push(chunk);
  }

  const rawBody = Buffer.concat(buffers);

  if (rawBody.length === 0) {
    return null;
  }

  const body = JSON.parse(rawBody.toString());

  return body;
};
