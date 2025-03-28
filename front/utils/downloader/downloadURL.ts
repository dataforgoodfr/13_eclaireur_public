import { Extension } from './types';

export function downloadURL(url: URL | string, fileName: string, extension: Extension) {
  const link = document.createElement('a');
  link.setAttribute('href', url.toString());
  link.setAttribute('download', `${fileName}.${extension}`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
