'use client';

import ErrorPage from '#components/ErrorPage';

export default function Error() {
  return (
    <ErrorPage
      title='Blackout temporaire ...'
      description='Même les éclaireurs doivent parfois recharger leurs lampes! Nous faisons tout en oeuvre pour ramener de la lumière.'
      errorType='500'
    />
  );
}
