'use client';

import { useEffect, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { loadContacts, saveContacts } from '@/utils/localStorage';
import { User } from 'lucide-react';

type contactsCardsProps = {
  id?: string;
  nom?: string;
  photoSrc?: string;
  fonction?: string;
  contact?: string;
  siren: string;
};

type ContactListProps = {
  contacts?: contactsCardsProps[];
  siren: string;
};

export default function ContactList({ contacts, siren }: ContactListProps) {
  const [contactsToInterpellate, setContactsToInterpellate] = useState<contactsCardsProps[]>([]);
  const handleCheckboxChange = (isChecked: boolean, contact: contactsCardsProps) => {
    setContactsToInterpellate((prev) => {
      if (!isChecked) {
        return prev.filter((elt) => elt.contact !== contact.contact);
      }
      const isNewContactAlreadySelected = prev.some((elt) => {
        return elt.contact === contact.contact;
      });
      return isNewContactAlreadySelected ? prev : [...prev, contact];
    });
  };

  let ignore = false;
  useEffect(() => {
    if (!ignore) {
      const registerdContacts = loadContacts();
      const isRegisterdContactsFromSameCommunity = registerdContacts.every(
        (rcElt) => rcElt.siren === siren,
      );
      if (isRegisterdContactsFromSameCommunity) {
        setContactsToInterpellate(registerdContacts);
      } else {
        setContactsToInterpellate([]);
      }
    }
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    saveContacts(contactsToInterpellate);
  }, [contactsToInterpellate]);

  return (
    <>
      {contacts?.map((elt) => {
        const isAlreadyChecked = contactsToInterpellate.some((CT) => CT.contact === elt.contact);
        return (
          <li key={elt.contact} className='relative basis-[310]'>
            <Checkbox
              id={elt.contact}
              onCheckedChange={(checked:boolean) => handleCheckboxChange(checked, elt)}
              checked={isAlreadyChecked}
              className='absolute right-2 top-2'
            />

            <Card className='min-h-[295] text-center'>
              <CardHeader className='flex'>
                <CardTitle className='capitalize'>
                  {elt.photoSrc ? (
                    <img src={elt.photoSrc} width='140' height='140' alt='' className='mx-auto' />
                  ) : (
                    <User size={140} className='mx-auto' />
                  )}
                  <h3 className='mt-4'>{elt.nom}</h3>
                </CardTitle>
                <CardDescription>{elt.fonction}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{elt.contact}</p>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </>
  );
}
