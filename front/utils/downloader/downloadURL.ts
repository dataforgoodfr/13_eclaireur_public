import { Extension } from './types';

export function downloadURL(
  url: URL | string,
  options?: { fileName: string; extension: Extension },
) {
  const link = document.createElement('a');
  link.setAttribute('href', url.toString());
  if (options) link.setAttribute('download', `${options.fileName}.${options.extension}`);

  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
