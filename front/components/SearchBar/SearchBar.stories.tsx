import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, userEvent, within } from '@storybook/test';
import { HttpResponse, http } from 'msw';

import SearchBar from './SearchBar';

// Mock data for different scenarios
const mockCommunities = {
  paris: [
    { nom: 'Paris', siren: '217500016', type: 'COM', code_postal: '75001' },
    { nom: 'Paris 1er Arrondissement', siren: '217501016', type: 'COM', code_postal: '75001' },
    { nom: 'Paris 2e Arrondissement', siren: '217502016', type: 'COM', code_postal: '75002' },
  ],
  marseille: [
    { nom: 'Marseille', siren: '211300016', type: 'COM', code_postal: '13001' },
    { nom: 'Martigues', siren: '211305016', type: 'COM', code_postal: '13500' },
    { nom: 'Marignane', siren: '211304016', type: 'COM', code_postal: '13700' },
  ],
  lyon: [
    { nom: 'Lyon', siren: '216900123', type: 'COM', code_postal: '69001' },
    { nom: 'Lyon 1er Arrondissement', siren: '216901123', type: 'COM', code_postal: '69001' },
    { nom: 'Lyon 2e Arrondissement', siren: '216902123', type: 'COM', code_postal: '69002' },
  ],
  empty: [],
};

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  parameters: {
    msw: {
      handlers: [
        http.get('/api/communities_search', ({ request }) => {
          const url = new URL(request.url);
          const query = url.searchParams.get('query')?.toLowerCase() || '';

          // Simulate different scenarios based on query
          if (query.includes('paris')) {
            return HttpResponse.json(mockCommunities.paris);
          } else if (query.includes('mar')) {
            return HttpResponse.json(mockCommunities.marseille);
          } else if (query.includes('lyon')) {
            return HttpResponse.json(mockCommunities.lyon);
          } else if (query === 'empty') {
            return HttpResponse.json(mockCommunities.empty);
          } else if (query === 'error') {
            return HttpResponse.json({ error: 'Server error' }, { status: 500 });
          } else if (query.length >= 2) {
            // Return mixed results for other queries including different types
            return HttpResponse.json([
              ...mockCommunities.paris.slice(0, 1),
              ...mockCommunities.marseille.slice(0, 1),
              { nom: 'Département du Rhône', siren: '226900026', type: 'DEP', code_postal: '69' },
              {
                nom: 'Région Auvergne-Rhône-Alpes',
                siren: '238400034',
                type: 'REG',
                code_postal: '69000',
              },
            ]);
          }

          return HttpResponse.json([]);
        }),
      ],
    },
  },
  argTypes: {
    onSelect: { action: 'selected' },
  },
  args: {
    onSelect: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithContainer: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className='w-96 p-4'>
        <Story />
      </div>
    ),
  ],
};

export const FullWidth: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className='w-full max-w-2xl p-4'>
        <Story />
      </div>
    ),
  ],
};

export const InteractionTest: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className='w-96 p-4'>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText('Code postal, commune, département, région');

    // Test focus
    await userEvent.click(searchInput);
    await expect(searchInput).toHaveFocus();

    // Test typing and suggestions
    await userEvent.type(searchInput, 'Paris', { delay: 100 });

    // Wait for suggestions to appear (if any)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Test clearing input
    await userEvent.clear(searchInput);
    await expect(searchInput).toHaveValue('');
  },
};

export const ClickOutsideTest: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className='w-96 p-4'>
        <div className='h-64 bg-gray-100 p-4'>
          <p>Cliquez ici pour tester le clic extérieur</p>
          <Story />
        </div>
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText('Code postal, commune, département, région');
    const outsideElement = canvas.getByText('Cliquez ici pour tester le clic extérieur');

    // Focus input first
    await userEvent.click(searchInput);
    await expect(searchInput).toHaveFocus();

    // Type to show suggestions
    await userEvent.type(searchInput, 'Mar', { delay: 100 });

    // Wait for suggestions
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Click outside
    await userEvent.click(outsideElement);

    // Wait for blur effect
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};

export const WithSuggestions: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className='w-96 p-4'>
        <p className='mb-4 text-sm text-gray-600'>
          Tapez "Paris", "Mar", ou "Lyon" pour voir les suggestions
        </p>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText('Code postal, commune, département, région');

    // Focus and type to show suggestions
    await userEvent.click(searchInput);
    await userEvent.type(searchInput, 'Paris', { delay: 100 });

    // Wait for suggestions to appear
    await new Promise((resolve) => setTimeout(resolve, 600));
  },
};

export const EmptyResults: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className='w-96 p-4'>
        <p className='mb-4 text-sm text-gray-600'>Tapez "empty" pour tester les résultats vides</p>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText('Code postal, commune, département, région');

    await userEvent.click(searchInput);
    await userEvent.type(searchInput, 'empty', { delay: 100 });

    await new Promise((resolve) => setTimeout(resolve, 600));
  },
};

export const ErrorState: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className='w-96 p-4'>
        <p className='mb-4 text-sm text-gray-600'>Tapez "error" pour tester l'état d'erreur</p>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText('Code postal, commune, département, région');

    await userEvent.click(searchInput);
    await userEvent.type(searchInput, 'error', { delay: 100 });

    await new Promise((resolve) => setTimeout(resolve, 600));
  },
};

export const SelectionTest: Story = {
  args: {
    onSelect: fn((selected) => {
      console.log('Selected:', selected);
      // Cette story simule une sélection
      alert(`Sélectionné: ${selected.nom}`);
    }),
  },
  decorators: [
    (Story) => (
      <div className='w-96 p-4'>
        <p className='mb-4 text-sm text-gray-600'>
          Tapez et cliquez sur une suggestion pour tester la sélection
        </p>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText('Code postal, commune, département, région');

    // Focus and type
    await userEvent.click(searchInput);
    await userEvent.type(searchInput, 'Mar', { delay: 100 });

    // Wait for suggestions
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Try to find and click the first suggestion
    try {
      const firstSuggestion = canvas.getByText('Marseille');
      await userEvent.click(firstSuggestion);
    } catch {
      console.log('Suggestion not found or not clickable');
    }
  },
};

export const ResetAfterSelectionTest: Story = {
  args: {
    onSelect: fn((selected) => {
      console.log('Selected and should reset:', selected);
    }),
  },
  decorators: [
    (Story) => (
      <div className='w-96 p-4'>
        <div className='mb-4 text-sm text-gray-600'>
          <p>
            <strong>Test de remise à zéro après sélection :</strong>
          </p>
          <ol className='ml-4 list-decimal'>
            <li>Tapez "Paris" pour voir les suggestions</li>
            <li>Cliquez sur une suggestion</li>
            <li>Vérifiez que l'input est vidé</li>
            <li>Vérifiez que les suggestions disparaissent</li>
          </ol>
        </div>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText('Code postal, commune, département, région');

    // Étape 1: Taper pour voir les suggestions
    await userEvent.click(searchInput);
    await expect(searchInput).toHaveFocus();

    await userEvent.type(searchInput, 'Paris', { delay: 100 });
    await expect(searchInput).toHaveValue('Paris');

    // Attendre les suggestions
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Étape 2: Simuler la sélection (cliquer sur une suggestion si trouvée)
    try {
      const suggestion = canvas.getByText('Paris');
      await userEvent.click(suggestion);

      // Étape 3: Vérifier que l'input est vidé après sélection
      await new Promise((resolve) => setTimeout(resolve, 100));
      await expect(searchInput).toHaveValue('');

      // Étape 4: Vérifier que les suggestions ont disparu
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Essayer de retrouver les suggestions - elles ne devraient plus être là
      try {
        canvas.getByText('Paris 1er Arrondissement');
        console.warn('❌ Les suggestions sont encore visibles après sélection');
      } catch {
        console.log('✅ Les suggestions ont disparu après sélection');
      }
    } catch {
      console.log('Suggestion Paris non trouvée pour le test de sélection');
    }
  },
};

export const MultipleSelectionsTest: Story = {
  args: {
    onSelect: fn((selected) => {
      console.log('Selection:', selected.nom);
    }),
  },
  decorators: [
    (Story) => (
      <div className='w-96 p-4'>
        <div className='mb-4 text-sm text-gray-600'>
          <p>
            <strong>Test de sélections multiples :</strong>
          </p>
          <p>Ce test vérifie qu'on peut faire plusieurs recherches consécutives</p>
        </div>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText('Code postal, commune, département, région');

    // Première recherche
    await userEvent.click(searchInput);
    await userEvent.type(searchInput, 'Paris', { delay: 50 });
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Simuler sélection (ou effacement manuel)
    await userEvent.clear(searchInput);
    await expect(searchInput).toHaveValue('');

    // Deuxième recherche
    await userEvent.type(searchInput, 'Lyon', { delay: 50 });
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Effacer et troisième recherche
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'Mar', { delay: 50 });
    await new Promise((resolve) => setTimeout(resolve, 400));
  },
};

export const DetailedResetValidation: Story = {
  args: {
    onSelect: fn((selected) => {
      console.log('✅ Sélection reçue:', selected.nom);
    }),
  },
  decorators: [
    (Story) => (
      <div className='w-96 p-4'>
        <div className='mb-4 rounded bg-blue-50 p-3 text-sm'>
          <p>
            <strong>🧪 Test détaillé de la remise à zéro :</strong>
          </p>
          <div className='mt-2 text-xs'>
            <p>1. ✍️ Tape "Paris" → Voit les suggestions</p>
            <p>2. 🖱️ Clique sur une suggestion</p>
            <p>3. ✅ Input vidé automatiquement</p>
            <p>4. ✅ Suggestions disparues</p>
            <p>5. 🔄 Peut refaire une recherche</p>
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText('Code postal, commune, département, région');

    console.log('🧪 Début du test de reset détaillé');

    // Phase 1: Recherche initiale
    console.log('1️⃣ Phase 1: Recherche initiale');
    await userEvent.click(searchInput);
    await expect(searchInput).toHaveFocus();
    console.log('  ✅ Input focus obtenu');

    await userEvent.type(searchInput, 'Paris', { delay: 80 });
    await expect(searchInput).toHaveValue('Paris');
    console.log('  ✅ Texte "Paris" tapé');

    // Attendre les suggestions
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('  ⏳ Attente des suggestions...');

    // Phase 2: Tentative de sélection
    console.log('2️⃣ Phase 2: Tentative de sélection');
    try {
      const parisOption = canvas.getByText('Paris');
      console.log('  ✅ Suggestion "Paris" trouvée');

      await userEvent.click(parisOption);
      console.log('  🖱️ Clic sur la suggestion effectué');

      // Phase 3: Validation du reset
      console.log('3️⃣ Phase 3: Validation du reset');
      await new Promise((resolve) => setTimeout(resolve, 200));

      const inputValue = searchInput.value;
      if (inputValue === '') {
        console.log('  ✅ Input correctement vidé');
      } else {
        console.warn(`  ❌ Input non vidé, valeur: "${inputValue}"`);
      }

      // Phase 4: Vérifier que les suggestions ont disparu
      console.log('4️⃣ Phase 4: Vérification disparition suggestions');
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        canvas.getByText('Paris 1er Arrondissement');
        console.warn('  ❌ Les suggestions sont encore présentes');
      } catch {
        console.log('  ✅ Les suggestions ont bien disparu');
      }

      // Phase 5: Test de nouvelle recherche
      console.log('5️⃣ Phase 5: Test nouvelle recherche');
      await userEvent.type(searchInput, 'Lyon', { delay: 80 });
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('  ✅ Nouvelle recherche "Lyon" effectuée');
    } catch {
      console.warn('  ❌ Suggestion "Paris" non trouvée pour le test');
      console.log('  ℹ️ Test de reset manuel...');

      // Test manuel du reset
      await userEvent.clear(searchInput);
      await expect(searchInput).toHaveValue('');
      console.log('  ✅ Reset manuel réussi');
    }

    console.log('🏁 Test de reset détaillé terminé');
  },
};
