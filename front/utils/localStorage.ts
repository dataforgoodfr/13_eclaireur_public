export type ContactsProps = {
  id?: string;
  nom?: string;
  photoSrc?: string;
  fonction?: string;
  contact?: string;
  siren: string;
};

const STORAGE_KEY = 'contacts';

export function loadContacts(): ContactsProps[] {
  if (typeof window === 'undefined') return [];

  const savedContacts = localStorage.getItem(STORAGE_KEY);
  if (savedContacts) {
    try {
      const parsedContacts = JSON.parse(savedContacts);
      return parsedContacts.map((contact: any) => {
        return {
          id: contact.id || '',
          nom: contact.nom || '',
          photoSrc: contact.photoSrc || '',
          fonction: contact.fonction || '',
          contact: contact.contact || '',
          siren: contact.siren || '',
        };
      });
    } catch (error) {
      console.error('Failed to parse contacts from localStorage', error);
      return [];
    }
  }
  return [];
}

export function saveContacts(contacts: ContactsProps[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}
