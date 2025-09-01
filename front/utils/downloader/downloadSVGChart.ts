import html2canvas from 'html2canvas';

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

export async function downloadSVGChart(
  chartContainer: HTMLElement | null,
  header: Header,
  options?: Options,
) {
  if (chartContainer === null) {
    throw new Error('The SVG element does not exist.');
  }

  const {
    fileName = DEFAULT_OPTIONS.fileName,
    extension = DEFAULT_OPTIONS.extension,
    size = { width: chartContainer.clientWidth, height: chartContainer.clientHeight },
  } = options ?? DEFAULT_OPTIONS;

  const clonedChartContainer = chartContainer.cloneNode(true) as HTMLElement;
  clonedChartContainer.setAttribute('width', `${size.width}`);
  clonedChartContainer.setAttribute('height', `${size.height}`);
  const svgToDownload = await createSvg(clonedChartContainer, header, size);

  if (extension === 'png') {
    const chartCanvas = await createChartCanvas(svgToDownload);
    const chartDataUrl = chartCanvas.toDataURL('image/jpeg');
    downloadURL(chartDataUrl, { fileName, extension });
  } else {
    downloadURL(convertSVGElementToURL(svgToDownload), { fileName, extension });
  }
}

async function createSvg(chartContainer: HTMLElement, header: Header, size: Size) {
  const margin = 15;
  const headerHeight = 90;
  const logoHeight = 19;
  const { width, height } = size;
  const svgHeight = headerHeight + height + logoHeight + margin * 2;

  applyStylesToForeignObject(chartContainer);

  const svgToDownload = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgToDownload.setAttribute('width', `${width + margin}`);
  svgToDownload.setAttribute('height', `${svgHeight}`);

  const communityNameSvg = createHeaderText(header.communityName, { fontSize: '24', y: '30' });
  const chartTitleSvg = createHeaderText(header.chartTitle, { fontSize: '20', y: '70' });

  const chartSvg = chartContainer.getElementsByTagName('svg')[0];
  chartSvg.setAttribute('x', `${margin / 2}`);
  chartSvg.setAttribute('y', `${headerHeight}`);
  addLegendToChart(chartContainer, height, chartSvg);

  const logoSvg = await createLogoSvg(width, margin, headerHeight, height, logoHeight);

  svgToDownload.appendChild(communityNameSvg);
  svgToDownload.appendChild(chartTitleSvg);
  svgToDownload.appendChild(chartSvg);
  svgToDownload.appendChild(logoSvg);

  return svgToDownload;
}

async function createChartCanvas(svgToDownload: SVGSVGElement) {
  const svgContainer = document.createElement('div');
  svgContainer.setAttribute('width', `${svgToDownload.getAttribute('width')}px`);
  svgContainer.setAttribute('height', `${svgToDownload.getAttribute('height')}px`);

  svgContainer.appendChild(svgToDownload);
  document.body.appendChild(svgContainer);
  const chartCanvas = await html2canvas(svgContainer, {
    width: parseInt(svgToDownload.getAttribute('width')!),
    height: parseInt(svgToDownload.getAttribute('height')!),
  });
  document.body.removeChild(svgContainer);
  return chartCanvas;
}

function createHeaderText(text: string, styleAttributes: { fontSize: string; y: string }) {
  const chartTitleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  chartTitleSvg.setAttribute('font-size', styleAttributes.fontSize);
  chartTitleSvg.setAttribute('font-family', 'sans-serif');
  chartTitleSvg.setAttribute('fill', '#303f8d');
  chartTitleSvg.setAttribute('x', '15');
  chartTitleSvg.setAttribute('y', styleAttributes.y);
  chartTitleSvg.textContent = text;
  return chartTitleSvg;
}

function addLegendToChart(chartContainer: HTMLElement, height: number, chartSvg: SVGSVGElement) {
  const legend = chartContainer.getElementsByClassName('recharts-legend-wrapper')[0];
  if (legend) {
    document.body.appendChild(legend);
    applyStyleToAllChildren(legend);
    document.body.removeChild(legend);

    const svgLegendContainer = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject',
    );
    svgLegendContainer.setAttribute('width', '100%');
    svgLegendContainer.setAttribute('height', '64');
    svgLegendContainer.setAttribute('y', `${height - 70}`);
    svgLegendContainer.appendChild(legend.children[0]);
    chartSvg.appendChild(svgLegendContainer);
  }
}

async function createLogoSvg(
  width: number,
  margin: number,
  headerHeight: number,
  height: number,
  logoHeight: number,
) {
  const logoWidth = 195;
  const logoX = width + margin - logoWidth - 10;
  const logoY = headerHeight + height + margin;
  const logo = await fetch(`${window.location.origin}/eclaireur/eclaireur-footeur.svg`);
  const logoTempContainer = document.createElement('div');
  logoTempContainer.innerHTML = await logo.text();
  const logoSvg = logoTempContainer.children[0];
  logoSvg.setAttribute('width', `${logoWidth}`);
  logoSvg.setAttribute('height', `${logoHeight}`);
  logoSvg.setAttribute('x', `${logoX}`);
  logoSvg.setAttribute('y', `${logoY}`);
  return logoSvg;
}

function applyStylesToForeignObject(chartContainer: HTMLElement) {
  document.body.appendChild(chartContainer);
  const foreignObjects = chartContainer.querySelectorAll('foreignObject');
  foreignObjects.forEach((object) => {
    object.setAttribute('y', `${parseInt(object.getAttribute('y') ?? '0') + 50}`);
    object.querySelector('button')?.remove();
    if (object.children[0]?.children[0]) {
      applyStyleToAllChildren(object.children[0]);
      object.children[0].children[0].innerHTML = object.children[0].children[0].textContent.replace(
        ' ',
        '<br/>',
      );
    }
  });
  document.body.removeChild(chartContainer);
}

function applyStyleToAllChildren(element: Element) {
  for (let i = 0; i < element?.children.length; i++) {
    const child = element.children[i];
    const cssText = getStyles(child);
    child.setAttribute('style', cssText);
    applyStyleToAllChildren(child);
  }
}

function getStyles(element: Element) {
  const computedStyle = window.getComputedStyle(element);
  let cssText = '';
  for (let i = 0; i < computedStyle.length; i++) {
    const prop = computedStyle[i];
    const value = computedStyle.getPropertyValue(prop);
    cssText += `${prop}: ${value}; `;
  }
  return cssText;
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
