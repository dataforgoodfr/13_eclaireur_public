import { replaceTemplateValues } from '#utils/emails/emailRendering';
import fs from 'fs';
import path from 'path';

// fs can only be called from server-side code so this file must be used by server-side components only

export function renderEmailTemplate(templateName: string, variables: Record<string, string>) {
  // replaceTemplateValues escapes every value. Values must not be substituted before this
  // call, otherwise raw user input lands in the HTML and nothing is left to escape.
  return replaceTemplateValues(getEmailTemplate(templateName), variables);
}

export function getEmailTemplate(templateName: string) {
  const filePath = path.join(process.cwd(), 'email-templates', `${templateName}.html`);
  const htmlTemplate = fs.readFileSync(filePath, 'utf8');
  return htmlTemplate;
}
