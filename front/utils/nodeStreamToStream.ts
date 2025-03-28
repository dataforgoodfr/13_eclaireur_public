// Solution from https://www.ericburel.tech/blog/nextjs-stream-files
import { Readable } from 'stream';

// Syntax taken from
// https://github.com/MattMorgis/async-stream-generator
// itself taken from
// https://nextjs.org/docs/app/building-your-application/routing/router-handlers#streaming
// probably itself taken from
// https://nodejs.org/api/stream.html
async function* nodeStreamToIterator(stream: Readable) {
  for await (const chunk of stream) {
    yield new Uint8Array(chunk);
  }
}

function iteratorToStream(iterator: AsyncIterator<Uint8Array>) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

export function nodeStreamToStream(nodeStream: Readable): ReadableStream {
  const data: ReadableStream = iteratorToStream(nodeStreamToIterator(nodeStream));

  return data;
}
