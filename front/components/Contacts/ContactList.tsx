'use client';

import { useSelectedContactsContext } from '@/app/(visualiser)/interpeller/Contexts/SelectedContactsContext';
import { CommunityContact } from '@/app/models/communityContact';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from 'lucide-react';
import Image from 'next/image';

type ContactListProps = {
  contacts: CommunityContact[];
};

export default function ContactList({ contacts }: ContactListProps) {
  const { selectedContacts, addContact, removeContact } = useSelectedContactsContext();

  console.log(selectedContacts);

  function handleCheckboxChange(isChecked: boolean, contact: CommunityContact) {
    if (isChecked) {
      addContact(contact);

      return;
    }

    removeContact(contact);
  }

  function isAlreadyChecked(contact: CommunityContact) {
    return selectedContacts.some((selectedContact) => selectedContact.contact === contact.contact);
  }

  return contacts.map((contact) => (
    <li key={contact.contact} className='relative basis-[310]'>
      <Checkbox
        id={contact.contact}
        onCheckedChange={(checked: boolean) => handleCheckboxChange(checked, contact)}
        checked={isAlreadyChecked(contact)}
        className='absolute right-2 top-2'
      />
      <Card className='min-h-[295] text-center'>
        <CardHeader className='flex'>
          <CardTitle className='capitalize'>
            {contact.photoSrc ? (
              <Image src={contact.photoSrc} width={140} height={140} alt='' className='mx-auto' />
            ) : (
              <User size={140} className='mx-auto' />
            )}
            <h3 className='mt-4'>{contact.nom}</h3>
          </CardTitle>
          <CardDescription>{contact.fonction}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{contact.contact}</p>
        </CardContent>
      </Card>
    </li>
  ));
}
