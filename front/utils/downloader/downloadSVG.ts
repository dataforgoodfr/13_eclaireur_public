import { downloadURL } from './downloadURL';
import { Extension } from './types';

type Size = { width: number; height: number };

type Options = {
  fileName?: string;
  extension?: Extension;
  /**
   * Only useful for png
   */
  size?: Size;
};

const DEFAULT_FILE_NAME = 'default_file_name';
const DEFAULT_EXTENSTION: Extension = 'svg';

const DEFAULT_OPTIONS = {
  fileName: DEFAULT_FILE_NAME,
  extension: DEFAULT_EXTENSTION,
  size: undefined,
} satisfies Options;

export default async function downloadSVG(svg: SVGSVGElement | null, options?: Options) {
  if (svg === null) {
    throw new Error('The SVG element does not exist.');
  }

  const bbox = svg.getBBox();

  const {
    fileName = DEFAULT_OPTIONS.fileName,
    extension = DEFAULT_OPTIONS.extension,
    size = { width: bbox.width, height: bbox.height },
  } = options ?? DEFAULT_OPTIONS;

  let finalURL = convertSVGElementToURL(svg);

  if (extension === 'png') {
    finalURL = await SVGToPNG(finalURL, size);
  }

  downloadURL(finalURL, fileName, extension);
}

function convertSVGElementToURL(svg: SVGSVGElement) {
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);

  // Add name spaces if missing
  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  // Add xml declaration
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  // Convert svg source to URI data scheme.
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);

  return url;
}

async function SVGToPNG(urlSource: string, size: Size) {
  const { width, height } = size;
  const image = new Image(width, height);
  image.src = urlSource;

  const canvas = new OffscreenCanvas(image.width, image.height);
  canvas?.getContext('2d')?.drawImage(image, 0, 0, image.width, image.height);

  const blob = await canvas.convertToBlob();

  const url = window.URL.createObjectURL(blob);

  return url;
}
