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
import { Button } from '#components/ui/button';
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
  communityType: string;
  communityName: string;
};
function getRecipientName(contacts: CommunityContact[]) {
  if (contacts.length === 0) {
    return 'No contact selected';
  }

  return contacts[0].nom;
}

export default function InterpellateForm({
  missingData,
  communityParam,
  communityType,
  communityName,
}: InterpellateFormProps) {
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
  // const contactsList = selectedContacts.map((elt) => elt.contact).join('; '); // TODO : décommenter cette ligne à la mise en production !!!
  const formMessage = renderToString(
    <MessageToContacts
      from={fullName}
      to={recipientName}
      communityType={communityType}
      communityName={communityName}
    />,
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(InterpellateFormSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      // emails: contactsList, // TODO : décommenter cette ligne à la mise en production !!!
      emails: 'olivier.pretre@gmx.fr', // TODO : commenter à la mise en production
      object:
        'Transparence des données publiques – Publication des investissements et marchés publics',
      message: formMessage,
      isCC: true,
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-4 px-4 py-6 md:px-8'
      >
        <fieldset className='gap-4 md:flex'>
          <legend className='mb-4 flex-none text-[28px] font-bold md:text-3xl'>
            Vos coordonnées
          </legend>
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

        <p className='mb-4 mt-4 text-[22px] font-bold md:mt-0 md:text-3xl'>
          Message d'interpellation
        </p>

        <div className='flex flex-row justify-between rounded-tl-3xl border border-secondary-dark font-bold'>
          <div className='flex w-36 flex-col justify-center rounded-tl-3xl bg-secondary-dark py-2 md:w-14'>
            <Image
              src='/eclaireur/error_icon.png'
              alt='Interpeller'
              width={24}
              height={24}
              className='self-center'
            />
          </div>
          <p className='p-3 md:px-8 md:py-4'>
            Ce message est généré automatiquement avec les informations du destinataire choisi
            précédemment. Le message sera envoyé en votre nom pour une interpellation citoyenne !
          </p>
        </div>

        <fieldset className='rounded-3xl bg-muted-border p-3 md:p-8'>
          <legend className='hidden'>Votre message</legend>
          <FormField
            control={form.control}
            name='emails'
            render={({ field }) => (
              <FormItem className='mb-4 block flex-row items-center gap-4 md:flex'>
                <FormLabel className='text-sm font-bold uppercase text-muted md:text-lg'>
                  Destinataire
                </FormLabel>
                <FormControl>
                  <Input
                    disabled
                    className='!m-0 border-none bg-transparent p-0 text-sm !text-primary !opacity-100 md:text-lg'
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
              <FormItem className='mb-4 block flex-row items-center gap-4 md:flex'>
                <FormLabel className='text-sm font-bold uppercase text-muted md:text-lg'>
                  Objet
                </FormLabel>
                <FormControl>
                  <Input
                    disabled
                    className='!m-0 border-none bg-transparent p-0 text-sm !text-primary !opacity-100 md:text-lg'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='simulatedTextArea'>
            <div className='hidden'>Votre message</div>
            <div
              id='simulatedTextAreaContent'
              className='cursor-not-allowed text-sm text-primary md:text-lg'
            >
              <MessageToContacts
                from={fullName}
                to={recipientName}
                communityName={communityName}
                communityType={communityType}
              />
            </div>
          </div>
        </fieldset>

        <div className='flex flex-col md:items-end md:gap-4'>
          <FormField
            control={form.control}
            name='isCC'
            render={({ field }) => (
              <FormItem className='flex flex-row-reverse justify-end gap-2 font-normal'>
                <FormLabel className='mt-1 text-sm font-normal text-primary md:text-lg'>
                  Recevoir une copie du message par e-mail
                </FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    defaultChecked
                    onCheckedChange={field.onChange}
                    className='relative -top-1 md:top-1'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            size='lg'
            type='submit'
            disabled={isSubmitting}
            className='mt-4 flex flex-row rounded-none rounded-br-lg rounded-tl-lg bg-primary text-lg hover:bg-primary/90'
          >
            Envoyer le message <ChevronRight />
          </Button>
        </div>
      </form>
    </Form>
  );
}
