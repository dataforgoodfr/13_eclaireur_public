'use client';

import { PropsWithChildren, createContext, useContext, useState } from 'react';

import { CommunityContact } from '#app/models/communityContact';

type SelectedContactsContextProps = {
  selectedContacts: CommunityContact[];
  addContact: (contact: CommunityContact) => void;
  removeContact: (contact: CommunityContact) => void;
};

const SelectedContactsContext = createContext<SelectedContactsContextProps | undefined>(undefined);

export function SelectedContactsProvider({ children }: PropsWithChildren) {
  const [contacts, setContacts] = useState<CommunityContact[]>([]);

  function addContact(newContact: CommunityContact) {
    setContacts((prev) => {
      if (prev.find((contact) => contact.contact === newContact.contact)) {
        return prev;
      }

      return [...prev, newContact];
    });
  }

  function removeContact(contactToRemove: CommunityContact) {
    setContacts((prev) => prev.filter((contact) => contact.contact !== contactToRemove.contact));
  }

  return (
    <SelectedContactsContext.Provider
      value={{ selectedContacts: contacts, addContact, removeContact }}
    >
      {children}
    </SelectedContactsContext.Provider>
  );
}

export function useSelectedContactsContext() {
  const context = useContext(SelectedContactsContext);
  if (context === undefined) {
    throw new Error('useSelectedContactsProvider must be used within a SelectedContactsProvider');
  }

  return context;
}
