import {
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
  createContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res, next) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

//export const patchContactController = async (req, res, next) => {
//  const { contactId } = req.params;
//  const result = await updateContact(contactId, req.body);

//  if (!result) {
//    return next(createHttpError(404, 'Contact not found'));
//  }

//  res.json({
//    status: 200,
//    message: `Successfully updated the contact!`,
//    data: result.contact,
//  });
//};


export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId, req.body);

    if (!updatedContact) {
        return next(createHttpError(404, 'Contact not found'));
    }

    res.json({
        status: 200,
        message: `Successfully updated the contact!`,
        data: updatedContact,
    });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(204).send();
};