export const ConfirmInterpellateSubject: string =
  'EclaireurPublic – Interpellation pour la transparence des données publiques';

export function replaceTemplateValues(templatehtml: string, variables: Record<string, string>) {
  let html = templatehtml;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    // Function replacement so `$&`-style patterns in user input aren't interpreted.
    html = html.replace(regex, () => escapeHtml(value));
  }
  return html;
}

export function getCommunityTitle(communityType: string) {
  return communityType === 'Commune' ? 'Maire' : 'Président.e';
}

export function getFullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`;
}

// Template values are plain text (names, emails, URLs): escape them rather than allowing a
// subset of HTML, so user input can never inject markup or links into outgoing emails.
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
