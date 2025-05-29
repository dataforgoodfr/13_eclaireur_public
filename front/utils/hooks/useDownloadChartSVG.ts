import downloadSVGUtils from '../downloader/downloadSVG';
import { useDownloadSVG } from './useDownloadSVG';

type UseDownloadChartSVGOptions = { title: string };

export function useDownloadChartSVG(options?: UseDownloadChartSVGOptions) {
  const { ref, downloadSVG } = useDownloadSVG();

  function handleDownloadChartSVG(...params: Parameters<typeof downloadSVG>) {
    const currentSVG = ref.current?.cloneNode(true) as SVGSVGElement | undefined;

    if (currentSVG == null) {
      throw new Error('SVG ref is not defined' + ref);
    }

    const svg = getContainerWithTopMargin(currentSVG);

    const { title } = options ?? {};

    if (title !== undefined) {
      addTitleToSVG(svg, title);
    }

    addCopyRight(svg);

    downloadSVGUtils(svg, ...params);
  }

  return {
    ref,
    downloadChartSVG: handleDownloadChartSVG,
  };
}

const svgNS = 'http://www.w3.org/2000/svg';

function createTextElement(content: string) {
  const textElement = document.createElementNS(svgNS, 'text');
  const textNode = document.createTextNode(content);

  textElement.appendChild(textNode);
  textElement.setAttribute('fill', 'black');

  return textElement;
}

const textLineHeight = 12;
const gap = 10;

function getContainerWithTopMargin(svgElement: SVGSVGElement) {
  const svgContainer = document.createElementNS(svgNS, 'svg');

  const currentHeight = svgElement.getAttribute('height');
  const currentWidth = svgElement.getAttribute('width');
  if (currentHeight == null || currentWidth == null) {
    throw new Error('The SVG height or width attibute is null or undefined');
  }

  const margin = textLineHeight + 2 * gap;
  const heightWithTitleMargin = parseInt(currentHeight) + 2 * margin;

  svgContainer.setAttribute('height', heightWithTitleMargin.toString());
  svgContainer.setAttribute('width', currentWidth.toString());
  svgElement.setAttribute('y', margin.toString());

  svgContainer.appendChild(svgElement);

  return svgContainer;
}

function addTitleToSVG(svgElement: SVGSVGElement, title: string) {
  const textElement = createTextElement(title);
  textElement.setAttribute('x', gap.toString());
  textElement.setAttribute('y', (textLineHeight + gap).toString());

  svgElement.appendChild(textElement);
}

const COPY_RIGHT_LABEL = '© Eclaireur Public';

function addCopyRight(svgElement: SVGSVGElement) {
  const textElement = createTextElement(COPY_RIGHT_LABEL);

  const currentWidth = svgElement.getAttribute('width');
  if (currentWidth == null) {
    throw new Error('The SVG width attibute is null or undefined');
  }

  const currentHeight = svgElement.getAttribute('height');
  if (currentHeight == null) {
    throw new Error('The SVG height attibute is null or undefined');
  }

  textElement.setAttribute('x', (parseInt(currentWidth) - gap).toString());
  textElement.setAttribute('y', (parseInt(currentHeight) - textLineHeight).toString());
  textElement.setAttribute('text-anchor', 'end');

  svgElement.appendChild(textElement);
}
