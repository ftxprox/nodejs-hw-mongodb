import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  try {
    console.log('Starting getAllContacts...');
    const contacts = await ContactsCollection.find();
    console.log('Fetched contacts:', contacts);
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

export const getContactById = async (contactId) => {
  try {
    const contact = await ContactsCollection.findById(contactId);
    return contact;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};