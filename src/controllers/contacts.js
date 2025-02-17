import {
    deleteContact,
    getAllContacts,
    getContactById,
    updateContact,
} from '../services/contacts.js';
import createError from 'http-errors';
import { createContact } from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';


export const getContactByIdController = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const { _id: userId } = req.user;
        const contact = await getContactById(userId, contactId);


        if (!contact) {
            throw createError(404, 'Contact not found');
        }


        res.json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    } catch (err) {
        next(err);
    }
};

export const createContactController = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const photo = req.file;

        let photoUrl;
        if (photo) {
            if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
                photoUrl = await saveFileToCloudinary(photo);
            } else {
                photoUrl = await saveFileToUploadDir(photo);
            }
        }

        const contact = await createContact({
            ...req.body,
            userId,
            photo: photoUrl,
        });

        res.status(201).json({
            status: 201,
            message: `Successfully created a student!`,
            data: contact,
        });
    } catch (error) {
        next(error);
    }
};

export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const { _id: userId } = req.user;

    const photo = req.file;

    let photoUrl;

    if (photo) {
        if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }

    const result = await updateContact(userId, contactId, {
        ...req.body,
        photo: photoUrl,
    });

    if (!result) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }

    res.json({
        status: 200,
        message: `Successfully patched a contact!`,
        data: result.contact,
    });
};

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const { _id: userId } = req.user;

    const contact = await deleteContact(contactId, userId);

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }

    res.status(204).send();
};

export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);

    const { sortBy, sortOrder } = parseSortParams(req.query);

    const filter = parseFilterParams(req.query);

    const { _id: userId } = req.user;

    const contacts = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
        userId,
    });

    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
};