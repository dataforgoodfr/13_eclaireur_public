import ErrorPage from '#components/ErrorPage';

export default function NotFound() {
  return (
    <ErrorPage
      title="La page n'existe pas ..."
      description='Même Éclaireur Public n’a pas trouvé cette page ! Promis, on est meilleurs pour éclairer les dépenses publiques que pour retrouver des pages disparues.'
      errorType='404'
    />
  );
}
