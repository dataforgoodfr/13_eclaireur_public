import sanitizeHtml from 'sanitize-html';

export const ConfirmInterpellateSubject: string =
  'EclaireurPublic – Interpellation pour la transparence des données publiques';

export function replaceTemplateValues(templatehtml: string, variables: Record<string, string>) {
  let html = templatehtml;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    html = html.replace(regex, sanitize(value));
  }
  return html;
}

export function getCommunityTitle(communityType: string) {
  return communityType === 'Commune' ? 'Maire' : 'Président.e';
}

export function getFullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`;
}

function sanitize(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['p', 'i', 'em', 'strong', 'a']),
    allowedAttributes: {
      a: ['href'],
    },
  });
}
