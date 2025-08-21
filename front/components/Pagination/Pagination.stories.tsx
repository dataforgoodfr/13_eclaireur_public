import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant de pagination avec style personnalisé. Le paramètre maxVisiblePages inclut les flèches dans le compte total (ex: 5 = 2 flèches + 3 numéros).',
      },
    },
  },
  argTypes: {
    totalPage: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'Nombre total de pages',
    },
    activePage: {
      control: { type: 'number', min: 1 },
      description: 'Page actuellement active',
    },
    maxVisiblePages: {
      control: { type: 'number', min: 3, max: 10 },
      description: 'Nombre maximum d\'éléments visibles incluant les flèches (défaut: 5 = 2 flèches + 3 numéros)',
    },
    onPageChange: {
      action: 'page changed',
      description: 'Callback appelé lors du changement de page',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle state
const PaginationWithState = (args: { totalPage: number; activePage: number; maxVisiblePages?: number }) => {
  const [currentPage, setCurrentPage] = useState(args.activePage);

  return (
    <div className="p-4">
      <div className="mb-4 text-center">
        <p className="text-sm text-muted">Page actuelle: {currentPage} / {args.totalPage}</p>
        {args.maxVisiblePages && (
          <p className="text-xs text-muted">Max pages visibles: {args.maxVisiblePages}</p>
        )}
      </div>
      <Pagination
        totalPage={args.totalPage}
        activePage={currentPage}
        onPageChange={setCurrentPage}
        maxVisiblePages={args.maxVisiblePages}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    totalPage: 10,
    activePage: 1,
  },
  render: (args) => <PaginationWithState {...args} />,
};

export const FewPages: Story = {
  args: {
    totalPage: 5,
    activePage: 3,
  },
  render: (args) => <PaginationWithState {...args} />,
};

export const ManyPages: Story = {
  args: {
    totalPage: 50,
    activePage: 25,
    maxVisiblePages: 5,
  },
  render: (args) => <PaginationWithState {...args} />,
};

export const FirstPage: Story = {
  args: {
    totalPage: 20,
    activePage: 1,
  },
  render: (args) => <PaginationWithState {...args} />,
};

export const LastPage: Story = {
  args: {
    totalPage: 20,
    activePage: 20,
  },
  render: (args) => <PaginationWithState {...args} />,
};

export const SinglePage: Story = {
  args: {
    totalPage: 1,
    activePage: 1,
  },
  render: (args) => <PaginationWithState {...args} />,
};

export const LargeDataset: Story = {
  args: {
    totalPage: 150,
    activePage: 75,
  },
  render: (args) => <PaginationWithState {...args} />,
};

// Story spéciale pour tester le comportement mobile
export const MobileView: Story = {
  args: {
    totalPage: 30,
    activePage: 15,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Vue mobile avec navigation par flèches et indicateur de page (15 / 30). Les flèches permettent de naviguer par pas de 5 pages.',
      },
    },
  },
  render: (args) => (
    <div className="w-full max-w-sm p-4">
      <div className="mb-4 text-center">
        <p className="text-sm text-muted">Vue mobile - Navigation par pas de 5</p>
      </div>
      <PaginationWithState {...args} />
    </div>
  ),
};

// Story pour démontrer les cas d'usage réels avec des données
export const RealWorldExample: Story = {
  args: {
    totalPage: 25,
    activePage: 8,
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.activePage);

    // Simulation de données paginées
    const itemsPerPage = 10;
    const totalItems = args.totalPage * itemsPerPage;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">Résultats de recherche</h3>
          <p className="text-sm text-muted mb-4">
            Affichage de {startItem} à {endItem} sur {totalItems} résultats
          </p>

          {/* Simulation d'une liste de résultats */}
          <div className="space-y-3">
            {Array.from({ length: itemsPerPage }, (_, i) => (
              <div key={i} className="p-3 bg-secondary/20 rounded-md">
                <div className="font-medium">Élément #{startItem + i}</div>
                <div className="text-sm text-muted">Description de l'élément</div>
              </div>
            ))}
          </div>
        </div>

        <Pagination
          totalPage={args.totalPage}
          activePage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  },
};

// Story pour tester le paramètre maxVisiblePages
export const MaxVisiblePagesTest: Story = {
  args: {
    totalPage: 20,
    activePage: 10,
    maxVisiblePages: 3,
  },
  render: (args) => (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">3 éléments max (2 flèches + 1 numéro)</h3>
        <PaginationWithState totalPage={20} activePage={10} maxVisiblePages={3} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">5 éléments max (2 flèches + 3 numéros) - défaut</h3>
        <PaginationWithState totalPage={20} activePage={10} maxVisiblePages={5} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">7 éléments max (2 flèches + 5 numéros)</h3>
        <PaginationWithState totalPage={20} activePage={10} maxVisiblePages={7} />
      </div>
    </div>
  ),
};

// Story pour tester le glissement des numéros
export const SlidingNumbers: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(8);

    return (
      <div className="p-6">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold mb-4">Test du glissement des numéros</h3>
          <p className="text-sm text-muted mb-2">
            Naviguez pour voir les numéros "glisser" avec la page active au centre
          </p>
          <p className="text-sm text-muted">
            Page actuelle: {currentPage} / 20 (Max éléments: 5 = 2 flèches + 3 numéros)
          </p>
        </div>

        <Pagination
          totalPage={20}
          activePage={currentPage}
          onPageChange={setCurrentPage}
          maxVisiblePages={5}
        />

        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setCurrentPage(1)}
            className="px-3 py-1 bg-gray-100 rounded text-sm"
          >
            Aller à 1
          </button>
          <button
            onClick={() => setCurrentPage(5)}
            className="px-3 py-1 bg-gray-100 rounded text-sm"
          >
            Aller à 5
          </button>
          <button
            onClick={() => setCurrentPage(10)}
            className="px-3 py-1 bg-gray-100 rounded text-sm"
          >
            Aller à 10
          </button>
          <button
            onClick={() => setCurrentPage(15)}
            className="px-3 py-1 bg-gray-100 rounded text-sm"
          >
            Aller à 15
          </button>
          <button
            onClick={() => setCurrentPage(20)}
            className="px-3 py-1 bg-gray-100 rounded text-sm"
          >
            Aller à 20
          </button>
        </div>
      </div>
    );
  },
};

// Story pour tester les cas limites
export const EdgeCases: Story = {
  render: () => {
    const [scenario, setScenario] = useState(0);
    const scenarios = [
      { totalPage: 2, activePage: 1, maxVisiblePages: 5, description: "Seulement 2 pages" },
      { totalPage: 3, activePage: 2, maxVisiblePages: 5, description: "3 pages, milieu sélectionné" },
      { totalPage: 4, activePage: 1, maxVisiblePages: 3, description: "4 pages, max 3 visibles" },
      { totalPage: 100, activePage: 1, maxVisiblePages: 5, description: "100 pages, première page" },
      { totalPage: 100, activePage: 100, maxVisiblePages: 5, description: "100 pages, dernière page" },
      { totalPage: 7, activePage: 4, maxVisiblePages: 5, description: "7 pages, milieu sélectionné" },
    ];

    const currentScenario = scenarios[scenario];

    return (
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Test des cas limites</h3>
          <select
            value={scenario}
            onChange={(e) => setScenario(Number(e.target.value))}
            className="p-2 border rounded-md mb-4"
          >
            {scenarios.map((s, i) => (
              <option key={i} value={i}>{s.description}</option>
            ))}
          </select>
        </div>

        <div className="mb-4 text-center">
          <p className="text-sm text-muted">{currentScenario.description}</p>
        </div>

        <PaginationWithState
          totalPage={currentScenario.totalPage}
          activePage={currentScenario.activePage}
          maxVisiblePages={currentScenario.maxVisiblePages}
        />
      </div>
    );
  },
};