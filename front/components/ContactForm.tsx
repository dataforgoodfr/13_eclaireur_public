'use client';

import { useEffect, useState } from 'react';

export type FormData = {
  username: string;
  usermail: string;
  usermessage: string;
};

type contactDetailsT = {
  email: string;
  name: string;
  message: string;
};

async function sendContactData(contactDetails: contactDetailsT) {
  const apiEndpoint = `api/contact`;
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    body: JSON.stringify(contactDetails),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }
}

export default function ContactForm() {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredName, setEnteredName] = useState('');
  const [enteredMessage, setEnteredMessage] = useState('');
  const [requestStatus, setRequestStatus] = useState(''); // 'pending', 'success', 'error'
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    if (requestStatus === 'success' || requestStatus === 'error') {
      const timer = setTimeout(() => {
        setRequestStatus('');
        setRequestError('');
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [requestStatus]);

  async function sendMessageHandler(event: React.SyntheticEvent) {
    event.preventDefault();
    setRequestStatus('pending');

    try {
      await sendContactData({
        email: enteredEmail,
        name: enteredName,
        message: enteredMessage,
      });
      setRequestStatus('success');
      setEnteredMessage('');
      setEnteredEmail('');
      setEnteredName('');
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'An unknown error occurred');
      setRequestStatus('error');
    }
  }

  return (
    <form className='mt-4 flex flex-col gap-5 py-4' onSubmit={sendMessageHandler}>
      <div>
        <label htmlFor='usermail' className='block'>
          Email
        </label>
        <input
          type='email'
          id='usermail'
          name='usermail'
          placeholder='Email'
          aria-required
          required
          // pattern={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/}
          // title="Entrez une adresse mail valide svp"
          value={enteredEmail}
          onChange={(event) => setEnteredEmail(event.target.value)}
          className='block w-full border border-slate-300 px-6 py-2 shadow-md'
        />
      </div>
      <div>
        <label htmlFor='username'>Prénom et nom</label>
        <input
          type='text'
          id='username'
          name='username'
          placeholder='Prénom et nom'
          aria-required
          required
          value={enteredName}
          onChange={(event) => setEnteredName(event.target.value)}
          className='block w-full border border-slate-300 px-6 py-2 shadow-md'
        />
      </div>
      <div>
        <label htmlFor='usermessage'>Message</label>
        <textarea
          id='usermessage'
          name='usermessage'
          placeholder='Tapez votre message ici'
          rows={5}
          aria-required
          required
          value={enteredMessage}
          onChange={(event) => setEnteredMessage(event.target.value)}
          className='block w-full border border-slate-300 px-6 py-2 shadow-md'
        ></textarea>
      </div>

      <div>
        <button className='block border border-slate-300 px-6 py-2 shadow-md'>Envoyer</button>
      </div>

      {requestStatus === 'success' && <div>Message envoyé</div>}
    </form>
  );
}
