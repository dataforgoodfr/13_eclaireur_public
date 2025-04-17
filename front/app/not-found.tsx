import ErrorPage from '@/components/ErrorPage';

export default function NotFound() {
  return (
    <ErrorPage
      title='Page non trouvée (Erreur 404)'
      description='Il est possible que vous ayez suivi un mauvais lien ou que la page ait été déplacée.'
    />
  );
}
