'use client';

import ErrorPage from '@/components/ErrorPage';

export default function Error() {
  return (
    <ErrorPage
      title='Une erreur interne s’est produite (Erreur 500)'
      description='Nous nous excusons pour la gêne occasionnée. Vous pouvez revenir à l’accueil ou essayer plus tard.'
    />
  );
}
