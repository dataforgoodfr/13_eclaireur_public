'use client';

import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import ButtonBackAndForth from '@/components/Interpellate/ButtonBackAndForth';
import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { postInterpellate } from '@/utils/fetchers/interpellate/postInterpellate';
import { ContactsProps, loadContacts } from '@/utils/localStorage';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight } from 'lucide-react';

import MessageToContacts from './MessageToContacts';
import { type FormSchema, InterpellateFormSchema } from './types';

export type InterpellateFormProps = {
  missingData: unknown;
  communityParam: string;
};
function getRecipientName(contactArray: ContactsProps[]) {
  return contactArray[0].nom;
}

export default function InterpellateForm({ missingData, communityParam }: InterpellateFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const router = useRouter();
  const {
    formState: { isSubmitting },
    setError,
  } = useForm();
  const contactsLoaded = loadContacts();
  const recipientName = getRecipientName(contactsLoaded);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };
  const handleFullName = () => {
    setFullName(firstName.concat(' ', lastName));
  };
  const contactsList = contactsLoaded.map((elt) => elt.contact).join('; ');
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
    const responseData = await response.json();
    if (!response.ok) {
      alert('Submitting form failed!');
      return;
    }

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
        className='flex flex-wrap items-start justify-center gap-4'
      >
        <fieldset className='basis-1/4'>
          <legend className='mb-4'>Vos coordonnées</legend>
          <FormField
            control={form.control}
            name='firstname'
            render={({ field }) => {
              return (
                <FormItem className='mb-4'>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Entrez votre prénom'
                      {...field}
                      onInput={handleFirstNameChange}
                      onBlur={handleFullName}
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
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Entrez votre nom'
                    {...field}
                    onInput={handleLastNameChange}
                    onBlur={handleFullName}
                  />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Entrez votre adresse e-mail' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <fieldset className='basis-2/3'>
          <legend className='mb-4'>Votre message</legend>
          <FormField
            control={form.control}
            name='emails'
            render={({ field }) => (
              <FormItem className='mb-4'>
                <FormLabel>À</FormLabel>
                <FormControl>
                  <Input disabled className='bg-slate-300' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='object'
            render={({ field }) => (
              <FormItem className='mb-4'>
                <FormLabel>Objet</FormLabel>
                <FormControl>
                  <Input disabled className='bg-slate-300' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='simulatedTextArea'>
            <div className='mb-3 text-sm font-medium'>Votre message</div>
            <div
              id='simulatedTextAreaContent'
              className='w-full cursor-not-allowed rounded-md border border-input bg-slate-300 text-base opacity-35 shadow-sm transition-colors md:text-sm'
            >
              <MessageToContacts from={fullName} to={recipientName} />
            </div>
          </div>

          <div className='mt-4 flex items-center space-x-2'>
            <Checkbox id='terms' checked={true} />
            <label
              htmlFor='terms'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Recevoir une copie du message par e-mail
            </label>
          </div>
        </fieldset>

        <div className='my-12 flex min-w-full justify-center gap-4'>
          <ButtonBackAndForth linkto={`/interpeller/${communityParam}/step2`} direction='back'>
            Revenir
          </ButtonBackAndForth>

          <Button
            type='submit'
            disabled={isSubmitting}
            className={buttonVariants({
              variant: 'outline',
              className: 'min-w-[200] bg-black text-white',
            })}
          >
            Envoyer mon message <ChevronRight />
          </Button>
        </div>
      </form>
    </Form>
  );
}
