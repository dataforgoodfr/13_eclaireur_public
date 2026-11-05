import { describe, expect, it } from 'vitest';

import { replaceTemplateValues } from './emailRendering';

describe('replaceTemplateValues', () => {
  it('replaces placeholders, tolerating inner whitespace', () => {
    expect(replaceTemplateValues('Bonjour {{ firstname }} !', { firstname: 'Camille' })).toBe(
      'Bonjour Camille !',
    );
  });

  it('escapes HTML in user-provided values', () => {
    const html = replaceTemplateValues('<p>{{fullName}}</p>', {
      fullName: '<a href="https://evil.example">clic</a><script>x()</script>',
    });

    expect(html).toBe(
      '<p>&lt;a href=&quot;https://evil.example&quot;&gt;clic&lt;/a&gt;&lt;script&gt;x()&lt;/script&gt;</p>',
    );
  });

  it('keeps URLs valid inside a quoted href', () => {
    expect(
      replaceTemplateValues('<a href="{{link}}">ok</a>', { link: 'https://x.fr/c?a=1&b=2' }),
    ).toBe('<a href="https://x.fr/c?a=1&amp;b=2">ok</a>');
  });

  it('does not interpret String.replace patterns in values', () => {
    expect(replaceTemplateValues('{{name}}', { name: "$& O'Brien" })).toBe('$&amp; O&#39;Brien');
  });
});
