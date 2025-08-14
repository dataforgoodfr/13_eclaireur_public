'use client';

// TODO: Review and remove unused variables. This file ignores unused vars for now.
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { useForm } from 'react-hook-form';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useSelectedContactsContext } from '#app/(visualiser)/interpeller/Contexts/SelectedContactsContext';
import { CommunityContact } from '#app/models/communityContact';
import ButtonBackAndForth from '#components/Interpellate/ButtonBackAndForth';
import { Button, buttonVariants } from '#components/ui/button';
import { Checkbox } from '#components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#components/ui/form';
import { Input } from '#components/ui/input';
import { postInterpellate } from '#utils/fetchers/interpellate/postInterpellate';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight } from 'lucide-react';

import MessageToContacts from './MessageToContacts';
import { type FormSchema, InterpellateFormSchema } from './types';

export type InterpellateFormProps = {
  missingData: unknown;
  communityParam: string;
};
function getRecipientName(contacts: CommunityContact[]) {
  if (contacts.length === 0) {
    return 'No contact selected';
  }

  return contacts[0].nom;
}

export default function InterpellateForm({ missingData, communityParam }: InterpellateFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const router = useRouter();
  const {
    formState: { isSubmitting },
    setError,
  } = useForm();
  const { selectedContacts } = useSelectedContactsContext();
  const recipientName = getRecipientName(selectedContacts);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const fullName = `${firstName} ${lastName}`;
  // const contactsList = selectedContacts.map((elt) => elt.contact).join('; ');
  const formMessage = renderToString(<MessageToContacts from={fullName} to={recipientName} />);

  const form = useForm<FormSchema>({
    resolver: zodResolver(InterpellateFormSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      // emails: contactsList, // TODO : décommenter cette ligne à la mise en production pour que ça fonctionne !!!
      emails: 'olivier.pretre@gmx.fr', // TODO : commenter à la mise en production
      object:
        'Transparence des données publiques – Publication des investissements et marchés publics',
      message: formMessage,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    const response = await postInterpellate(data);
    if (!response.ok) {
      alert('Submitting form failed!');
      return;
    }

    const responseData = await response.json();

    if (responseData.errors) {
      const errors = responseData.errors;

      if (errors.firstname) {
        setError('firstname', {
          type: 'server',
          message: errors.firstname,
        });
      } else if (errors.lastname) {
        setError('lastname', {
          type: 'server',
          message: errors.lastname,
        });
      } else if (errors.email) {
        setError('email', {
          type: 'server',
          message: errors.email,
        });
      } else {
        alert('Something went wrong!');
      }
    }
    form.reset();
    router.push(`/interpeller/${communityParam}/step4`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4 px-8 py-6'>
        <fieldset className='gap-4 md:flex'>
          <legend className='mb-4 flex-none text-3xl font-bold'>Vos coordonnées</legend>
          <FormField
            control={form.control}
            name='firstname'
            render={({ field }) => {
              return (
                <FormItem className='mb-4'>
                  <FormLabel className='text-lg font-bold'>Prénom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Entrez votre prénom'
                      {...field}
                      onInput={handleFirstNameChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name='lastname'
            render={({ field }) => (
              <FormItem className='mb-4'>
                <FormLabel className='text-lg font-bold'>Nom</FormLabel>
                <FormControl>
                  <Input placeholder='Entrez votre nom' {...field} onInput={handleLastNameChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg font-bold'>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Entrez votre adresse e-mail' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <p className='mb-4 text-3xl font-bold'>Message d'interpellation</p>

        <div className='flex flex-row justify-between rounded-tl-3xl border border-secondary-dark font-bold'>
          <div className='flex flex-col justify-center rounded-tl-3xl bg-secondary-dark px-4 py-2'>
            <Image src='/eclaireur/error_icon.png' alt='Interpeller' width={24} height={24} />
          </div>
          <p className='px-8 py-4'>
            Ce message est généré automatiquement avec les informations du destinataire choisi
            précédemment. Le message sera envoyé en votre nom pour une interpellation citoyenne !
          </p>
        </div>

        <fieldset className='rounded-3xl bg-muted-border px-8 py-8'>
          <legend className='hidden'>Votre message</legend>
          <FormField
            control={form.control}
            name='emails'
            render={({ field }) => (
              <FormItem className='mb-4 flex flex-row items-center gap-4'>
                <FormLabel className='text-lg font-bold uppercase text-muted'>
                  Destinataire
                </FormLabel>
                <FormControl>
                  <Input
                    disabled
                    className='!m-0 border-none bg-transparent p-0 !text-lg !text-primary !opacity-100'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='object'
            render={({ field }) => (
              <FormItem className='mb-4 flex flex-row items-center gap-4'>
                <FormLabel className='text-lg font-bold uppercase text-muted'>Objet</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    className='!m-0 border-none bg-transparent p-0 !text-lg !text-primary !opacity-100'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='simulatedTextArea'>
            <div className='hidden'>Votre message</div>
            <div id='simulatedTextAreaContent' className='cursor-not-allowed text-lg text-primary'>
              <MessageToContacts from={fullName} to={recipientName} />
            </div>
          </div>
        </fieldset>

        <div className='my-12 flex flex-col items-end gap-4'>
          <div className='mt-4 flex items-center space-x-2'>
            <Checkbox id='terms' checked={true} />
            <label htmlFor='terms' className='text-md text-primary'>
              Recevoir une copie du message par e-mail
            </label>
          </div>
          <Button
            size='lg'
            type='submit'
            disabled={isSubmitting}
            className='mt-8 flex flex-row rounded-none rounded-br-lg rounded-tl-lg bg-primary hover:bg-primary/90'
          >
            Envoyer le message <ChevronRight />
          </Button>
        </div>
      </form>
    </Form>
  );
}
