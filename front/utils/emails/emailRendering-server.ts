import fs from 'fs'; 
import path from "path";
import { replaceTemplateValues } from '#utils/emails/emailRendering';

// fs can only be called from server-side code so this file must be used by server-side components only

export function renderEmailTemplate(templateName: string, variables: Record<string, string>) {
  let html = getEmailTemplate(templateName);

  // Replace {{variable}} with the provided values
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    html = html.replace(regex, value);
  }

  return replaceTemplateValues(html,variables);
}

export function getEmailTemplate(templateName: string) {
  const filePath = path.join(process.cwd(), 'email-templates', `${templateName}.html`);
  let htmlTemplate = fs.readFileSync(filePath, 'utf8');
  return htmlTemplate;
}