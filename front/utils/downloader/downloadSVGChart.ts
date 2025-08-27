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

type Header = {
  communityName: string;
  chartTitle: string;
};

const DEFAULT_FILE_NAME = 'default_file_name';
const DEFAULT_EXTENSTION: Extension = 'svg';

const DEFAULT_OPTIONS = {
  fileName: DEFAULT_FILE_NAME,
  extension: DEFAULT_EXTENSTION,
  size: undefined,
} satisfies Options;

export default async function downloadSVGChart(
  svg: SVGSVGElement | null,
  header: Header,
  options?: Options,
) {
  if (svg === null) {
    throw new Error('The SVG element does not exist.');
  }

  const bbox = svg.getBBox();

  const {
    fileName = DEFAULT_OPTIONS.fileName,
    extension = DEFAULT_OPTIONS.extension,
    size = { width: bbox.width, height: bbox.height },
  } = options ?? DEFAULT_OPTIONS;

  if (extension === 'png') {
    const canvas = await createCanvas(svg, header);
    const blob = await canvas.convertToBlob();
    const imageUrl = await toDataURL(blob);

    downloadURL(imageUrl, { fileName, extension });
  } else {
    const imageUrl = await createSvg(svg, header, size);

    downloadURL(imageUrl, { fileName, extension });
  }
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

async function createSvg(svg: SVGSVGElement, header: Header, size: Size) {
  const chartImageURL = convertSVGElementToURL(svg);
  const margin = 15;
  const headerHeight = 90;
  const logoHeight = 19;

  const { width, height } = size;
  const svgHeight = headerHeight + height + logoHeight + margin * 2;

  const svgToDownload = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgToDownload.setAttribute('width', `${width + margin}`);
  svgToDownload.setAttribute('height', `${svgHeight}`);

  const communityNameSvg = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  communityNameSvg.setAttribute('font-size', '24');
  communityNameSvg.setAttribute('font-family', 'sans-serif');
  communityNameSvg.setAttribute('fill', '#303f8d');
  communityNameSvg.setAttribute('x', '15');
  communityNameSvg.setAttribute('y', '30');
  communityNameSvg.textContent = header.communityName;

  const chartTitleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  chartTitleSvg.setAttribute('font-size', '20');
  chartTitleSvg.setAttribute('font-family', 'sans-serif');
  chartTitleSvg.setAttribute('fill', '#303f8d');
  chartTitleSvg.setAttribute('x', '15');
  chartTitleSvg.setAttribute('y', '70');
  chartTitleSvg.textContent = header.chartTitle;

  const chartSvg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  chartSvg.setAttribute('width', `${width}`);
  chartSvg.setAttribute('height', `${height}`);
  chartSvg.setAttribute('x', `${margin / 2}`);
  chartSvg.setAttribute('y', `${headerHeight}`);
  chartSvg.setAttribute('href', chartImageURL);

  const logoWidth = 195;
  const logoX = width + margin - logoWidth - 10;
  const logoY = headerHeight + height + margin;
  const logoSvg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  logoSvg.setAttribute('width', `${logoWidth}`);
  logoSvg.setAttribute('height', `${logoHeight}`);
  logoSvg.setAttribute('x', `${logoX}`);
  logoSvg.setAttribute('y', `${logoY}`);
  logoSvg.setAttribute('href', `${window.location.origin}/eclaireur/eclaireur-footeur.svg`);

  svgToDownload.appendChild(communityNameSvg);
  svgToDownload.appendChild(chartTitleSvg);
  svgToDownload.appendChild(chartSvg);
  svgToDownload.appendChild(logoSvg);

  return convertSVGElementToURL(svgToDownload);
}

async function createCanvas(svg: SVGSVGElement, header: Header) {
  const imageURL = convertSVGElementToURL(svg);
  const margin = 15;
  const headerHeight = 90;
  const chartImage = new Image(svg.width.baseVal.value, svg.height.baseVal.value);
  chartImage.src = imageURL;
  const logoImage = new Image(195, 19);
  logoImage.src = '/eclaireur/eclaireur-footeur.svg';
  const canvasHeight = headerHeight + chartImage.height + logoImage.height + margin * 2;
  const canvasWidth = chartImage.width + margin;
  const canvas = new OffscreenCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#303f8d';
    ctx.font = '24px sans-serif';
    ctx.fillText(header.communityName, 15, 35);
    ctx.font = '20px sans-serif';
    ctx.fillText(header.chartTitle, 15, 70);

    ctx.drawImage(chartImage, margin / 2, headerHeight + 5, chartImage.width, chartImage.height);

    const logoX = canvasWidth - logoImage.width - 10;
    const logoY = headerHeight + chartImage.height + margin;
    ctx.drawImage(logoImage, logoX, logoY, logoImage.width, logoImage.height);
  }

  return canvas;
}

const toDataURL = async (data: Blob) =>
  new Promise<string>((ok) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => ok(reader.result as string));
    reader.readAsDataURL(data);
  });
