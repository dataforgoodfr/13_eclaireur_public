'use client';

import { useSelectedContactsContext } from '#app/(visualiser)/interpeller/Contexts/SelectedContactsContext';
import { CommunityContact } from '#app/models/communityContact';
import { Card, CardContent, CardHeader, CardTitle } from '#components/ui/card';
import { Checkbox } from '#components/ui/checkbox';

type ContactListProps = {
  contacts: CommunityContact[];
};

export default function ContactList({ contacts }: ContactListProps) {
  const { selectedContacts, addContact, removeContact } = useSelectedContactsContext();

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

  return contacts.map((contact) => {
    // const isLeaderFlag = contact.isLeader; // décommenter lorsque données activées
    const isLeaderFlag = false; // test de la mise en forme avec contact principal en donnant la valeur true à isLeaderFlag
    const isLeaderBorderClassName = isLeaderFlag ? 'border border-primary rounded-tr-xl' : '';
    const isLeaderPositionClassName = isLeaderFlag ? 'top-[2.5rem]' : 'top-4';
    const isLeaderMarginClassName = isLeaderFlag ? 'mt-10' : 'mt-4';
    return (
      <li key={contact.contact} className='group relative basis-[100%] md:basis-[32%]'>
        <Checkbox
          id={contact.contact}
          onCheckedChange={(checked: boolean) => handleCheckboxChange(checked, contact)}
          checked={isAlreadyChecked(contact)}
          className={`absolute left-6 ${isLeaderPositionClassName}`}
        />
        <Card
          className={`group-[&:nth-of-type(3n+3)]ng-brand-3: min-h-[130] rounded-none rounded-br-xl rounded-tl-xl border-0 bg-primary-light group-[&:nth-of-type(3n+1)]:bg-brand-1 group-[&:nth-of-type(3n+2)]:bg-brand-3 ${isLeaderBorderClassName}`}
        >
          {isLeaderFlag && (
            <CardHeader className='flex space-y-0 p-0'>
              <CardTitle>
                <p className='rounded-t-xl bg-primary py-1 text-center text-primary-foreground'>
                  Contact principal
                </p>
                <h4 className={`ml-6 capitalize ${isLeaderMarginClassName}`}>
                  {contact.fonction ? contact.fonction : 'fonction non disponible'}
                </h4>
              </CardTitle>
            </CardHeader>
          )}
          {!isLeaderFlag && (
            <CardHeader className='flex space-y-0 p-0 pl-6 pt-6'>
              <CardTitle>
                <h4 className='mt-4'>
                  {/* {contact.fonction ? contact.fonction : 'Envoyer un mail à la collectivité'} */}
                  {contact.fonction ? contact.fonction : contact.nom}
                </h4>
                {!contact.fonction && <p className='my-4 text-primary'>{contact.contact}</p>}
              </CardTitle>
            </CardHeader>
          )}
          <CardContent>
            {contact.fonction && <p className='text-primary'>{contact.nom}</p>}
          </CardContent>
        </Card>
      </li>
    );
  });
}
