import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import type { TreeData } from '../../app/community/[siren]/types/interface';
import Treemap from './Treemap';

// Enhanced Treemap with Value-Based Intelligent Grouping

// Real-world CPV data from user payload - perfect for value-based grouping
const createRealCPVData = (): TreeData => ({
  id: 'root',
  name: 'Marchés Publics CPV',
  value: 0,
  type: 'node',
  children: [
    {
      id: 'cpv_71',
      name: "Services d'architecture, construction, ingénierie",
      value: 49026225,
      type: 'leaf',
      part: 47.2,
    },
    {
      id: 'cpv_45',
      name: 'Travaux de construction',
      value: 34586218.56,
      type: 'leaf',
      part: 33.3,
    },
    {
      id: 'cpv_72',
      name: "Services de technologies de l'information",
      value: 11160654.2,
      type: 'leaf',
      part: 10.7,
    },
    {
      id: 'cpv_77',
      name: 'Services agricoles, sylvicoles, horticoles',
      value: 3164737.6,
      type: 'leaf',
      part: 3.0,
    },
    {
      id: 'cpv_79',
      name: 'Services aux entreprises: droit, marketing, conseil',
      value: 2558000,
      type: 'leaf',
      part: 2.5,
    },
    {
      id: 'cpv_39',
      name: 'Meubles, aménagements, électroménager',
      value: 1240000,
      type: 'leaf',
      part: 1.2,
    },
    {
      id: 'cpv_92',
      name: 'Services récréatifs, culturels et sportifs',
      value: 1104000,
      type: 'leaf',
      part: 1.1,
    },
    {
      id: 'cpv_80',
      name: "Services d'enseignement et de formation",
      value: 767500,
      type: 'leaf',
      part: 0.7,
    },
    {
      id: 'cpv_37',
      name: 'Instruments de musique, articles de sport',
      value: 160000,
      type: 'leaf',
      part: 0.15,
    },
    {
      id: 'cpv_48',
      name: "Logiciels et systèmes d'information",
      value: 75000,
      type: 'leaf',
      part: 0.07,
    },
    {
      id: 'cpv_16',
      name: 'Machines agricoles',
      value: 48000,
      type: 'leaf',
      part: 0.05,
    },
  ],
});

// Enhanced hierarchical data with diverse value ranges for intelligent grouping
const createValueGroupingData = (): TreeData => ({
  id: 'root',
  name: 'Budget Municipal',
  value: 0,
  type: 'node',
  children: [
    {
      id: 'education_group',
      name: 'Éducation',
      value: 0,
      type: 'node',
      children: [
        {
          id: 'education1',
          name: 'Écoles Primaires',
          value: 2800000,
          type: 'leaf',
          part: 28.0,
        },
        {
          id: 'education2',
          name: 'Collèges',
          value: 1900000,
          type: 'leaf',
          part: 19.0,
        },
        {
          id: 'education3',
          name: 'Formation Adultes',
          value: 450000,
          type: 'leaf',
          part: 4.5,
        },
        {
          id: 'education4',
          name: 'Matériel Pédagogique',
          value: 120000,
          type: 'leaf',
          part: 1.2,
        },
      ],
    },
    {
      id: 'infrastructure_group',
      name: 'Infrastructure',
      value: 0,
      type: 'node',
      children: [
        {
          id: 'infra1',
          name: 'Rénovation Routière',
          value: 1500000,
          type: 'leaf',
          part: 15.0,
        },
        {
          id: 'infra2',
          name: 'Éclairage Public',
          value: 800000,
          type: 'leaf',
          part: 8.0,
        },
        {
          id: 'infra3',
          name: 'Signalisation',
          value: 180000,
          type: 'leaf',
          part: 1.8,
        },
        {
          id: 'infra4',
          name: 'Mobilier Urbain',
          value: 85000,
          type: 'leaf',
          part: 0.85,
        },
      ],
    },
    {
      id: 'social_group',
      name: 'Action Sociale',
      value: 0,
      type: 'node',
      children: [
        {
          id: 'social1',
          name: 'Aide aux Familles',
          value: 950000,
          type: 'leaf',
          part: 9.5,
        },
        {
          id: 'social2',
          name: 'Services aux Seniors',
          value: 650000,
          type: 'leaf',
          part: 6.5,
        },
        {
          id: 'social3',
          name: 'Insertion Professionnelle',
          value: 320000,
          type: 'leaf',
          part: 3.2,
        },
        {
          id: 'social4',
          name: "Aide d'Urgence",
          value: 75000,
          type: 'leaf',
          part: 0.75,
        },
      ],
    },
    {
      id: 'culture_group',
      name: 'Culture & Loisirs',
      value: 0,
      type: 'node',
      children: [
        {
          id: 'culture1',
          name: 'Centre Culturel',
          value: 420000,
          type: 'leaf',
          part: 4.2,
        },
        {
          id: 'culture2',
          name: 'Bibliothèques',
          value: 280000,
          type: 'leaf',
          part: 2.8,
        },
        {
          id: 'culture3',
          name: 'Événements Municipaux',
          value: 150000,
          type: 'leaf',
          part: 1.5,
        },
        {
          id: 'culture4',
          name: 'Associations Locales',
          value: 45000,
          type: 'leaf',
          part: 0.45,
        },
      ],
    },
  ],
});

// Large dataset with extreme value variations for advanced grouping
const createLargeMockTreeData = (): TreeData => ({
  id: 'root',
  name: 'Budget Métropolitain',
  value: 0,
  type: 'node',
  children: [
    {
      id: 'major1',
      name: 'Grand Projet Urbain',
      value: 15000000,
      type: 'leaf',
      part: 35.7,
    },
    {
      id: 'major2',
      name: 'Transport Public',
      value: 8500000,
      type: 'leaf',
      part: 20.2,
    },
    {
      id: 'major3',
      name: 'Hôpital Central',
      value: 4200000,
      type: 'leaf',
      part: 10.0,
    },
    {
      id: 'medium1',
      name: 'Réseau Numérique',
      value: 2800000,
      type: 'leaf',
      part: 6.7,
    },
    {
      id: 'medium2',
      name: 'Parc Naturel',
      value: 1900000,
      type: 'leaf',
      part: 4.5,
    },
    {
      id: 'medium3',
      name: 'Centre Sportif',
      value: 1500000,
      type: 'leaf',
      part: 3.6,
    },
    {
      id: 'small1',
      name: 'Rénovation Écoles',
      value: 850000,
      type: 'leaf',
      part: 2.0,
    },
    {
      id: 'small2',
      name: 'Sécurité Routière',
      value: 650000,
      type: 'leaf',
      part: 1.5,
    },
    { id: 'small3', name: 'Aide PME', value: 420000, type: 'leaf', part: 1.0 },
    {
      id: 'micro1',
      name: 'Festivités',
      value: 180000,
      type: 'leaf',
      part: 0.4,
    },
    {
      id: 'micro2',
      name: 'Communication',
      value: 95000,
      type: 'leaf',
      part: 0.2,
    },
    {
      id: 'micro3',
      name: 'Formation Élus',
      value: 45000,
      type: 'leaf',
      part: 0.1,
    },
  ],
});

const meta: Meta<typeof Treemap> = {
  title: 'DataViz/Treemap',
  component: Treemap,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Composant Treemap avancé avec groupement intelligent par valeurs. Combine hiérarchie visuelle et groupement automatique par quantiles avec dégradés de couleurs intelligents.',
      },
    },
  },
  argTypes: {
    colorPalette: {
      control: {
        type: 'radio',
      },
      options: ['mp', 'subventions'],
      description: 'Palette de couleurs à utiliser pour le treemap',
      table: {
        type: { summary: 'mp | subventions' },
        defaultValue: { summary: 'mp' },
      },
    },
    groupMode: {
      control: {
        type: 'radio',
      },
      options: ['none', 'gradient', 'categorical', 'value-based'],
      description:
        'Mode de groupement : none (séquentiel), gradient/categorical (hiérarchique), value-based (groupement par quantiles)',
      table: {
        type: { summary: 'none | gradient | categorical | value-based' },
        defaultValue: { summary: 'none' },
      },
    },
    isZoomActive: {
      control: 'boolean',
      description: "Affiche un message indiquant qu'un filtre est actif",
    },
    showZoomControls: {
      control: 'boolean',
      description: 'Affiche les boutons de contrôle du zoom',
    },
    data: {
      description: 'Données hiérarchiques à afficher dans le treemap',
    },
    handleClick: {
      description: 'Fonction appelée lors du clic sur un élément',
    },
    consolidateSmallItems: {
      control: 'boolean',
      description: 'Active la consolidation automatique des petits éléments',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    consolidationThreshold: {
      control: {
        type: 'range',
        min: 0.5,
        max: 10,
        step: 0.5,
      },
      description: 'Seuil en pourcentage pour regrouper les petits éléments (ex: 2 = 2%)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '2' },
      },
    },
    minItemsToConsolidate: {
      control: {
        type: 'range',
        min: 2,
        max: 10,
        step: 1,
      },
      description: "Nombre minimum d'éléments petits avant consolidation",
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '3' },
      },
    },
  },
  args: {
    isZoomActive: false,
    colorPalette: 'mp',
    groupMode: 'none',
    showZoomControls: false,
    handleClick: (value: number) => {
      console.log('Clicked element with value:', value);
    },
    onZoomIn: () => console.log('Zoom In'),
    onZoomOut: () => console.log('Zoom Out'),
    onZoomReset: () => console.log('Zoom Reset'),
  },
};

export default meta;
type Story = StoryObj<typeof Treemap>;

export const RealCPVData: Story = {
  name: ' Données CPV Réelles - Marchés Publics (Recommandé pour test)',
  args: {
    data: createRealCPVData(),
    colorPalette: 'mp',
    groupMode: 'value-based',
  },
  parameters: {
    docs: {
      description: {
        story:
          " **VOS DONNÉES RÉELLES** : Utilise le payload CPV fourni par l'utilisateur. Variation extrême : 49M€ (Architecture) → 48K€ (Machines agricoles) = ratio 1:1000 ! Le groupement automatique révèle 4 catégories distinctes : Méga-marchés (>30M€), Gros marchés (3-11M€), Marchés moyens (160K-3M€), et Petits marchés (<160K€).",
      },
    },
  },
};

export const ValueBasedGrouping: Story = {
  name: ' Groupement par Valeurs - Subventions (Simulation)',
  args: {
    data: createValueGroupingData(),
    colorPalette: 'subventions',
    groupMode: 'value-based',
  },
  parameters: {
    docs: {
      description: {
        story:
          ' **NOUVEAU** : Groupement intelligent par quantiles avec dégradés de couleurs. Les éléments sont automatiquement regroupés en 4 groupes selon leur valeur (Très Élevé, Élevé, Moyen, Faible) avec des nuances plus foncées pour les valeurs plus importantes. Idéal pour identifier visuellement les priorités budgétaires.',
      },
    },
  },
};

export const LargeDatasetValueGrouping: Story = {
  name: ' Données Étendues - Groupement par Valeurs',
  args: {
    data: createLargeMockTreeData(),
    colorPalette: 'mp',
    groupMode: 'value-based',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Démonstration avec des variations de valeurs extrêmes (de 45K€ à 15M€). Le groupement automatique révèle clairement 4 catégories : Projets Majeurs, Moyens, Petits, et Micro-investissements.',
      },
    },
  },
};

export const HierarchicalGradient: Story = {
  name: ' Mode Hiérarchique - Dégradé',
  args: {
    data: createValueGroupingData(),
    colorPalette: 'mp',
    groupMode: 'gradient',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Groupement par hiérarchie avec dégradé de couleurs au sein de chaque groupe parent. Chaque catégorie (Éducation, Infrastructure, etc.) a sa couleur de base avec des nuances graduelles.',
      },
    },
  },
};

export const HierarchicalCategorical: Story = {
  name: ' Mode Hiérarchique - Catégoriel',
  args: {
    data: createValueGroupingData(),
    colorPalette: 'mp',
    groupMode: 'categorical',
  },
  parameters: {
    docs: {
      description: {
        story:
          "Groupement par hiérarchie avec couleur uniforme par catégorie. Tous les éléments d'une même catégorie partagent la même couleur, idéal pour identifier les domaines budgétaires.",
      },
    },
  },
};

export const SubventionsPalette: Story = {
  name: ' Palette Subventions - Tons Bleus',
  args: {
    data: createValueGroupingData(),
    colorPalette: 'subventions',
    groupMode: 'value-based',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Utilisation de la palette spécialisée pour les subventions avec des tons bleus/violets. Idéale pour la visualisation des données de subventions avec le nouveau système de groupement par valeurs.',
      },
    },
  },
};

export const WithZoomAndLegend: Story = {
  name: ' Avec Contrôles et Légende',
  args: {
    data: createValueGroupingData(),
    colorPalette: 'mp',
    groupMode: 'value-based',
    showZoomControls: true,
    isZoomActive: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interface complète avec contrôles de zoom, indication de filtre actif, et légende des groupes de valeurs. Démontre l'intégration complète des nouvelles fonctionnalités.",
      },
    },
  },
};

// Comparison Stories
export const ValueGroupingComparison: Story = {
  name: ' Comparaison : Groupement par Valeurs vs Traditionnel',
  render: (args) => (
    <div className='space-y-8'>
      <div className='space-y-4'>
        <h3 className='text-xl font-bold text-primary'>
          Nouveau : Groupement Intelligent par Valeurs
        </h3>
        <div className='rounded-lg border-2 border-green-200 bg-green-50 p-4'>
          <Treemap {...args} groupMode='value-based' colorPalette='mp' />
          <p className='mt-2 text-sm text-green-700'>
            Groupement automatique en 4 catégories par quantiles | Dégradés intelligents |
            Identification rapide des priorités
          </p>
        </div>
      </div>
      <div className='space-y-4'>
        <h3 className='text-xl font-bold text-primary'>Traditionnel : Mode Séquentiel</h3>
        <div className='rounded-lg border p-4'>
          <Treemap {...args} groupMode='none' colorPalette='mp' />
          <p className='mt-2 text-sm text-gray-600'>
            Coloration séquentielle simple sans analyse des valeurs
          </p>
        </div>
      </div>
    </div>
  ),
  args: {
    data: createValueGroupingData(),
    isZoomActive: false,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          "Comparaison directe entre le nouveau système de groupement intelligent par valeurs et l'approche traditionnelle. Le groupement par valeurs révèle immédiatement les patterns et priorités.",
      },
    },
  },
};

export const AllGroupingModes: Story = {
  name: ' Comparaison : Tous les Modes de Groupement',
  render: (args) => (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <div className='space-y-2'>
          <h4 className='font-semibold text-primary'>Groupement par Valeurs (Recommandé)</h4>
          <div className='rounded border-2 border-green-200 bg-green-50 p-3'>
            <Treemap {...args} groupMode='value-based' />
          </div>
        </div>
        <div className='space-y-2'>
          <h4 className='font-semibold text-primary'>Hiérarchique - Dégradé</h4>
          <div className='rounded border p-3'>
            <Treemap {...args} groupMode='gradient' />
          </div>
        </div>
        <div className='space-y-2'>
          <h4 className='font-semibold text-primary'>Hiérarchique - Catégoriel</h4>
          <div className='rounded border p-3'>
            <Treemap {...args} groupMode='categorical' />
          </div>
        </div>
        <div className='space-y-2'>
          <h4 className='font-semibold text-primary'>Traditionnel - Séquentiel</h4>
          <div className='rounded border p-3'>
            <Treemap {...args} groupMode='none' />
          </div>
        </div>
      </div>
    </div>
  ),
  args: {
    data: createValueGroupingData(),
    colorPalette: 'mp',
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          "Vue d'ensemble des 4 modes de groupement disponibles. Le mode 'Groupement par Valeurs' est recommandé pour l'analyse budgétaire car il révèle automatiquement les patterns de priorités.",
      },
    },
  },
};

export const PaletteComparison: Story = {
  name: ' Comparaison : Palettes Marchés Publics vs Subventions',
  render: (args) => (
    <div className='space-y-8'>
      <div className='space-y-4'>
        <h3 className='text-xl font-bold text-primary'>Palette Marchés Publics (Tons Verts)</h3>
        <div className='rounded-lg border-2 border-green-200 bg-green-50 p-4'>
          <Treemap {...args} colorPalette='mp' groupMode='value-based' />
          <p className='mt-2 text-sm text-green-700'>
            Palette spécialisée pour les marchés publics | Tons verts cohérents | Lisibilité
            optimale
          </p>
        </div>
      </div>
      <div className='space-y-4'>
        <h3 className='text-xl font-bold text-primary'>Palette Subventions (Tons Bleus/Violets)</h3>
        <div className='rounded-lg border p-4'>
          <Treemap {...args} colorPalette='subventions' groupMode='value-based' />
          <p className='mt-2 text-sm text-gray-600'>
            Palette spécialisée pour les subventions | Tons bleus/violets distinctifs
          </p>
        </div>
      </div>
    </div>
  ),
  args: {
    data: createValueGroupingData(),
    isZoomActive: false,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Comparaison entre les deux palettes spécialisées : Marchés Publics (tons verts) et Subventions (tons bleus/violets), toutes deux utilisant le nouveau système de groupement par valeurs.',
      },
    },
  },
};

export const ExtremeValues: Story = {
  name: ' Cas Extrême : Variations de Valeurs Importantes',
  args: {
    data: createLargeMockTreeData(),
    colorPalette: 'mp',
    groupMode: 'value-based',
    showZoomControls: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Cas de test avec des variations extrêmes (ratio 1:300 entre min et max). Le groupement intelligent révèle 4 catégories distinctes : Méga-projets (>4M€), Grands projets (1.5-4M€), Projets moyens (400K-1.5M€), et Petits projets (<400K€).',
      },
    },
  },
};

export const ConsolidationComparison: Story = {
  name: ' Comparaison : Avec/Sans Consolidation',
  render: (args) => (
    <div className='space-y-8'>
      <div className='space-y-4'>
        <h3 className='text-xl font-bold text-primary'>
          Avec Consolidation (Seuil: 2%, Min: 3 éléments)
        </h3>
        <div className='rounded-lg border-2 border-green-200 bg-green-50 p-4'>
          <Treemap
            {...args}
            consolidateSmallItems={true}
            consolidationThreshold={2}
            minItemsToConsolidate={3}
          />
          <p className='mt-2 text-sm text-green-700'>
            Les petits éléments (&lt;2% du total) sont regroupés en "Autres (X postes)"
          </p>
        </div>
      </div>
      <div className='space-y-4'>
        <h3 className='text-xl font-bold text-primary'>Sans Consolidation</h3>
        <div className='rounded-lg border p-4'>
          <Treemap {...args} consolidateSmallItems={false} />
          <p className='mt-2 text-sm text-gray-600'>
            Tous les éléments sont affichés individuellement, même les très petits
          </p>
        </div>
      </div>
    </div>
  ),
  args: {
    data: createRealCPVData(),
    colorPalette: 'mp',
    groupMode: 'value-based',
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          "Comparaison visuelle entre l'affichage avec et sans consolidation automatique des petits éléments. La consolidation améliore la lisibilité en regroupant les éléments de faible valeur.",
      },
    },
  },
};

// Component for the zoom demo story
function OneLevelZoomDemoComponent(args: TreemapProps) {
  const [maxAmount, setMaxAmount] = React.useState<number | null>(null);
  const [zoomStack, setZoomStack] = React.useState<(number | null)[]>([null]);

  function handleClick(value: number) {
    // Add current zoom level to stack before zooming in
    if (value !== null) {
      setZoomStack((prev) => [...prev, maxAmount]);
      setMaxAmount(value);
    }
  }

  function handleZoomOut() {
    if (zoomStack.length > 1) {
      // Go back one level
      const newStack = [...zoomStack];
      newStack.pop(); // Remove current level
      const targetLevel = newStack[newStack.length - 1]; // Get previous level

      setZoomStack(newStack);
      setMaxAmount(targetLevel);
    }
  }

  // Filter data based on current zoom level
  const filteredData = React.useMemo(() => {
    if (maxAmount === null) return args.data;

    // Simulate filtering by maxAmount (similar to API behavior)
    if (args.data.type === 'node' && args.data.children) {
      const filteredChildren = args.data.children.filter((child) => child.value <= maxAmount);
      return {
        ...args.data,
        children: filteredChildren,
      };
    }
    return args.data;
  }, [maxAmount, args.data]);

  const zoomInfo = `Niveau ${zoomStack.length - 1} | Stack: [${zoomStack
    .map((level) => (level === null ? 'overview' : `${Math.round(level / 1000)}K€`))
    .join(' → ')}]`;

  return (
    <div className='space-y-4'>
      <div className='rounded-lg border-2 border-blue-200 bg-blue-50 p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h4 className='font-semibold text-blue-800'>🔍 Test Zoom Progressif</h4>
          <span className='rounded bg-blue-100 px-2 py-1 font-mono text-sm text-blue-700'>
            {zoomInfo}
          </span>
        </div>

        <Treemap
          {...args}
          data={filteredData}
          isZoomActive={maxAmount !== null}
          handleClick={handleClick}
          onZoomOut={zoomStack.length > 1 ? handleZoomOut : undefined}
        />

        <div className='mt-4 space-y-2 text-sm text-blue-700'>
          <p>
            <strong>Instructions de test :</strong>
          </p>
          <ol className='ml-4 list-decimal space-y-1'>
            <li>🔍 Cliquez sur un élément pour zoomer (icône zoom-in en haut-droite)</li>
            <li>🔄 Utilisez le bouton zoom-out (bas-gauche) pour revenir UN niveau en arrière</li>
            <li>📊 Observez le stack de zoom qui montre le niveau actuel</li>
            <li>🎯 Le bouton zoom-out n'apparaît que s'il y a un niveau précédent</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export const OneLevelZoomDemo: Story = {
  name: '🔍 Zoom Progressif - Test One-Level Navigation',
  render: (args) => <OneLevelZoomDemoComponent {...args} />,
  args: {
    data: createLargeMockTreeData(), // Use data with many levels for deep zoom testing
    colorPalette: 'mp',
    groupMode: 'value-based',
  },
  parameters: {
    docs: {
      story: {
        inline: true,
      },
      description: {
        story:
          '🔍 **NOUVEAU** : Démontre la navigation zoom progressive niveau par niveau. Cliquez sur les éléments pour zoomer, utilisez le bouton zoom-out (bas-gauche) pour revenir exactement UN niveau en arrière. Le stack de zoom montre la progression : overview → niveau 1 → niveau 2, etc. Test interactif complet de la fonctionnalité de zoom intelligent.',
      },
    },
  },
};
