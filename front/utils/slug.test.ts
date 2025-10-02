/**
 * Unit tests for SEO URL slug generation utilities
 *
 * These tests match the Python validation script test cases:
 * scripts/visualize_seo_slugs.py
 */
import { describe, expect, it } from 'vitest';

import {
  type CommunityType,
  createCommunitySlug,
  createCommunityUrl,
  extractNameFromSlug,
  extractSirenFromSlug,
  getTypePrefix,
  isValidSlug,
  parseCommunityType,
  slugify,
} from './slug';

describe('slugify', () => {
  describe('OpenSpec url-routing specification compliance', () => {
    it('should handle accented characters in French cities', () => {
      expect(slugify('Saint-Étienne-du-Rouvray')).toBe('saint-etienne-du-rouvray');
    });

    it('should remove apostrophes and special characters', () => {
      expect(slugify("L'Haÿ-les-Roses")).toBe('lhay-les-roses');
    });

    it('should preserve hyphens in names', () => {
      expect(slugify('Aix-en-Provence')).toBe('aix-en-provence');
    });

    it('should handle circumflex accents', () => {
      expect(slugify('Île-de-France')).toBe('ile-de-france');
    });

    it('should handle ordinal indicators', () => {
      expect(slugify('Paris 15e Arrondissement')).toBe('paris-15e-arrondissement');
    });

    it('should handle simple names', () => {
      expect(slugify('Paris')).toBe('paris');
    });

    it('should handle département names with accents', () => {
      expect(slugify('Haute-Savoie')).toBe('haute-savoie');
    });
  });

  describe('French special characters', () => {
    it('should remove acute accents (é)', () => {
      expect(slugify('Orléans')).toBe('orleans');
    });

    it('should remove grave accents (è, à)', () => {
      expect(slugify('Ières')).toBe('ieres');
    });

    it('should remove circumflex accents (ê, â, î, ô, û)', () => {
      expect(slugify('Château-Gontier')).toBe('chateau-gontier');
      expect(slugify('Drôme')).toBe('drome');
    });

    it('should remove diaeresis (ë, ï, ü, ÿ)', () => {
      expect(slugify('Noël')).toBe('noel');
      expect(slugify('Saint-Barthélemy')).toBe('saint-barthelemy');
    });

    it('should remove cedilla (ç)', () => {
      expect(slugify('Besançon')).toBe('besancon');
    });

    it('should handle multiple special characters', () => {
      expect(slugify('Provins-et-Château')).toBe('provins-et-chateau');
    });
  });

  describe('apostrophe handling', () => {
    it('should remove straight apostrophes', () => {
      expect(slugify("L'Isle-Adam")).toBe('lisle-adam');
    });

    it('should remove curly apostrophes', () => {
      expect(slugify("L'Haÿ-les-Roses")).toBe('lhay-les-roses');
    });

    it('should handle multiple apostrophes', () => {
      expect(slugify("L'Isle-d'Abeau")).toBe('lisle-dabeau');
    });
  });

  describe('whitespace and hyphen normalization', () => {
    it('should replace spaces with hyphens', () => {
      expect(slugify('Saint Denis')).toBe('saint-denis');
    });

    it('should replace multiple spaces with single hyphen', () => {
      expect(slugify('Saint  Denis')).toBe('saint-denis');
    });

    it('should collapse multiple consecutive hyphens', () => {
      expect(slugify('Saint--Denis')).toBe('saint-denis');
    });

    it('should trim leading hyphens', () => {
      expect(slugify('-Paris')).toBe('paris');
    });

    it('should trim trailing hyphens', () => {
      expect(slugify('Paris-')).toBe('paris');
    });

    it('should handle mixed spaces and hyphens', () => {
      expect(slugify('Saint - Denis')).toBe('saint-denis');
    });
  });

  describe('non-alphanumeric character removal', () => {
    it('should remove special characters', () => {
      expect(slugify('Saint-Denis (93)')).toBe('saint-denis-93');
    });

    it('should remove punctuation', () => {
      expect(slugify('Saint-Denis, Île-de-France')).toBe('saint-denis-ile-de-france');
    });

    it('should preserve numbers', () => {
      expect(slugify('Paris 15e')).toBe('paris-15e');
    });

    it('should handle parentheses', () => {
      expect(slugify('Saint-Denis (Réunion)')).toBe('saint-denis-reunion');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(slugify('')).toBe('');
    });

    it('should handle strings with only special characters', () => {
      expect(slugify('---')).toBe('');
    });

    it('should handle very long names', () => {
      const longName = 'Saint-Laurent-de-la-Cabrerisse-et-la-Chapelle';
      expect(slugify(longName)).toBe('saint-laurent-de-la-cabrerisse-et-la-chapelle');
    });

    it('should handle lowercase input', () => {
      expect(slugify('paris')).toBe('paris');
    });

    it('should handle uppercase input', () => {
      expect(slugify('PARIS')).toBe('paris');
    });

    it('should handle mixed case', () => {
      expect(slugify('PaRiS')).toBe('paris');
    });
  });
});

describe('getTypePrefix', () => {
  it('should map COM to commune', () => {
    expect(getTypePrefix('COM')).toBe('commune');
  });

  it('should map REG to region', () => {
    expect(getTypePrefix('REG')).toBe('region');
  });

  it('should map DEP to departement', () => {
    expect(getTypePrefix('DEP')).toBe('departement');
  });

  it('should map MET to metropole', () => {
    expect(getTypePrefix('MET')).toBe('metropole');
  });

  it('should map CTU to ctu', () => {
    expect(getTypePrefix('CTU')).toBe('ctu');
  });

  it('should map CA to ca', () => {
    expect(getTypePrefix('CA')).toBe('ca');
  });

  it('should map CC to cc', () => {
    expect(getTypePrefix('CC')).toBe('cc');
  });

  it('should map EPT to ept', () => {
    expect(getTypePrefix('EPT')).toBe('ept');
  });
});

describe('createCommunitySlug', () => {
  it('should create slug for Paris commune', () => {
    expect(createCommunitySlug('Paris', 'COM', '213105554')).toBe('commune/paris-213105554');
  });

  it('should create slug for Île-de-France region', () => {
    expect(createCommunitySlug('Île-de-France', 'REG', '111546651')).toBe(
      'region/ile-de-france-111546651',
    );
  });

  it('should create slug for Haute-Savoie département', () => {
    expect(createCommunitySlug('Haute-Savoie', 'DEP', '227400017')).toBe(
      'departement/haute-savoie-227400017',
    );
  });

  it('should create slug for city with special characters', () => {
    expect(createCommunitySlug('Saint-Étienne-du-Rouvray', 'COM', '217600710')).toBe(
      'commune/saint-etienne-du-rouvray-217600710',
    );
  });

  it('should create slug for city with apostrophe', () => {
    expect(createCommunitySlug("L'Haÿ-les-Roses", 'COM', '219400821')).toBe(
      'commune/lhay-les-roses-219400821',
    );
  });

  it('should create slug for Métropole de Lyon', () => {
    expect(createCommunitySlug('Métropole de Lyon', 'MET', '200046977')).toBe(
      'metropole/metropole-de-lyon-200046977',
    );
  });

  it('should handle duplicate city names with different SIRENs', () => {
    const slug1 = createCommunitySlug('Saint-Denis', 'COM', '217604201');
    const slug2 = createCommunitySlug('Saint-Denis', 'COM', '219300060');
    const slug3 = createCommunitySlug('Saint-Denis', 'COM', '293100555');

    // All should have same base slug but different SIRENs
    expect(slug1).toBe('commune/saint-denis-217604201');
    expect(slug2).toBe('commune/saint-denis-219300060');
    expect(slug3).toBe('commune/saint-denis-293100555');
    expect(slug1).not.toBe(slug2);
    expect(slug2).not.toBe(slug3);
  });
});

describe('createCommunityUrl', () => {
  it('should create URL with leading slash', () => {
    expect(createCommunityUrl('Paris', 'COM', '213105554')).toBe('/commune/paris-213105554');
  });

  it('should create URL for region', () => {
    expect(createCommunityUrl('Île-de-France', 'REG', '111546651')).toBe(
      '/region/ile-de-france-111546651',
    );
  });

  it('should create URL for département', () => {
    expect(createCommunityUrl('Haute-Savoie', 'DEP', '227400017')).toBe(
      '/departement/haute-savoie-227400017',
    );
  });
});

describe('extractSirenFromSlug', () => {
  it('should extract SIREN from simple slug', () => {
    expect(extractSirenFromSlug('paris-213105554')).toBe('213105554');
  });

  it('should extract SIREN from long slug with multiple hyphens', () => {
    expect(extractSirenFromSlug('saint-etienne-du-rouvray-217600710')).toBe('217600710');
  });

  it('should extract SIREN from slug with apostrophe-derived name', () => {
    expect(extractSirenFromSlug('lhay-les-roses-219400821')).toBe('219400821');
  });

  it('should return null for invalid slug without SIREN', () => {
    expect(extractSirenFromSlug('paris')).toBeNull();
  });

  it('should return null for slug with short number', () => {
    expect(extractSirenFromSlug('paris-123')).toBeNull();
  });

  it('should return null for slug with long number', () => {
    expect(extractSirenFromSlug('paris-1234567890')).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(extractSirenFromSlug('')).toBeNull();
  });

  it('should only extract last 9 digits if multiple numbers', () => {
    expect(extractSirenFromSlug('paris-15e-213105554')).toBe('213105554');
  });
});

describe('extractNameFromSlug', () => {
  it('should extract name from simple slug', () => {
    expect(extractNameFromSlug('paris-213105554')).toBe('paris');
  });

  it('should extract name from long slug', () => {
    expect(extractNameFromSlug('saint-etienne-du-rouvray-217600710')).toBe(
      'saint-etienne-du-rouvray',
    );
  });

  it('should extract name from slug with numbers in name', () => {
    expect(extractNameFromSlug('paris-15e-213105554')).toBe('paris-15e');
  });

  it('should return null for invalid slug', () => {
    expect(extractNameFromSlug('paris')).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(extractNameFromSlug('')).toBeNull();
  });
});

describe('parseCommunityType', () => {
  it('should parse commune to COM', () => {
    expect(parseCommunityType('commune')).toBe('COM');
  });

  it('should parse region to REG', () => {
    expect(parseCommunityType('region')).toBe('REG');
  });

  it('should parse departement to DEP', () => {
    expect(parseCommunityType('departement')).toBe('DEP');
  });

  it('should parse metropole to MET', () => {
    expect(parseCommunityType('metropole')).toBe('MET');
  });

  it('should parse ctu to CTU', () => {
    expect(parseCommunityType('ctu')).toBe('CTU');
  });

  it('should parse ca to CA', () => {
    expect(parseCommunityType('ca')).toBe('CA');
  });

  it('should parse cc to CC', () => {
    expect(parseCommunityType('cc')).toBe('CC');
  });

  it('should parse ept to EPT', () => {
    expect(parseCommunityType('ept')).toBe('EPT');
  });

  it('should return null for invalid type', () => {
    expect(parseCommunityType('invalid')).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(parseCommunityType('')).toBeNull();
  });

  it('should be case-sensitive', () => {
    expect(parseCommunityType('COMMUNE')).toBeNull();
  });
});

describe('isValidSlug', () => {
  it('should validate simple valid slug', () => {
    expect(isValidSlug('paris-213105554')).toBe(true);
  });

  it('should validate long valid slug', () => {
    expect(isValidSlug('saint-etienne-du-rouvray-217600710')).toBe(true);
  });

  it('should validate slug with numbers in name', () => {
    expect(isValidSlug('paris-15e-213105554')).toBe(true);
  });

  it('should reject slug without SIREN', () => {
    expect(isValidSlug('paris')).toBe(false);
  });

  it('should reject slug with short SIREN', () => {
    expect(isValidSlug('paris-12345')).toBe(false);
  });

  it('should reject slug with long SIREN', () => {
    expect(isValidSlug('paris-12345678901')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isValidSlug('')).toBe(false);
  });

  it('should reject slug with non-numeric SIREN', () => {
    expect(isValidSlug('paris-abcdefghi')).toBe(false);
  });

  it('should reject slug without hyphen before SIREN', () => {
    expect(isValidSlug('paris213105554')).toBe(false);
  });
});

describe('integration tests', () => {
  describe('round-trip conversion', () => {
    const testCases: Array<[string, CommunityType, string]> = [
      ['Paris', 'COM', '213105554'],
      ['Marseille', 'COM', '213055309'],
      ['Lyon', 'COM', '216901231'],
      ['Île-de-France', 'REG', '111546651'],
      ['Haute-Savoie', 'DEP', '227400017'],
      ['Métropole de Lyon', 'MET', '200046977'],
      ['Saint-Étienne-du-Rouvray', 'COM', '217600710'],
      ["L'Haÿ-les-Roses", 'COM', '219400821'],
    ];

    testCases.forEach(([name, type, siren]) => {
      it(`should round-trip ${name} (${type})`, () => {
        // Create slug
        const slug = createCommunitySlug(name, type, siren);

        // Extract components
        const slugPart = slug.split('/')[1];
        const extractedSiren = extractSirenFromSlug(slugPart);
        const extractedName = extractNameFromSlug(slugPart);
        const typePrefix = slug.split('/')[0];
        const extractedType = parseCommunityType(typePrefix);

        // Verify extraction
        expect(extractedSiren).toBe(siren);
        expect(extractedType).toBe(type);
        expect(isValidSlug(slugPart)).toBe(true);
        expect(extractedName).toBe(slugify(name));
      });
    });
  });

  describe('URL generation examples from sample data', () => {
    it('should generate correct URL for major cities', () => {
      const examples = [
        {
          name: 'Paris',
          type: 'COM' as const,
          siren: '213105554',
          expected: '/commune/paris-213105554',
        },
        {
          name: 'Marseille',
          type: 'COM' as const,
          siren: '213055309',
          expected: '/commune/marseille-213055309',
        },
        {
          name: 'Lyon',
          type: 'COM' as const,
          siren: '216901231',
          expected: '/commune/lyon-216901231',
        },
        {
          name: 'Toulouse',
          type: 'COM' as const,
          siren: '213105935',
          expected: '/commune/toulouse-213105935',
        },
      ];

      examples.forEach(({ name, type, siren, expected }) => {
        expect(createCommunityUrl(name, type, siren)).toBe(expected);
      });
    });

    it('should generate correct URL for regions', () => {
      const examples = [
        {
          name: 'Île-de-France',
          type: 'REG' as const,
          siren: '111546651',
          expected: '/region/ile-de-france-111546651',
        },
        {
          name: 'Auvergne-Rhône-Alpes',
          type: 'REG' as const,
          siren: '248400816',
          expected: '/region/auvergne-rhone-alpes-248400816',
        },
      ];

      examples.forEach(({ name, type, siren, expected }) => {
        expect(createCommunityUrl(name, type, siren)).toBe(expected);
      });
    });

    it('should generate correct URL for special character cities', () => {
      const examples = [
        {
          name: 'Saint-Étienne-du-Rouvray',
          type: 'COM' as const,
          siren: '217600710',
          expected: '/commune/saint-etienne-du-rouvray-217600710',
        },
        {
          name: "L'Haÿ-les-Roses",
          type: 'COM' as const,
          siren: '219400821',
          expected: '/commune/lhay-les-roses-219400821',
        },
        {
          name: 'Aix-en-Provence',
          type: 'COM' as const,
          siren: '211300056',
          expected: '/commune/aix-en-provence-211300056',
        },
      ];

      examples.forEach(({ name, type, siren, expected }) => {
        expect(createCommunityUrl(name, type, siren)).toBe(expected);
      });
    });
  });
});
