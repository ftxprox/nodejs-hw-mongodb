import { SORT_ORDER } from '../contacts/index.js';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
export const getContactById = async (userId, contactId) => {
    try {
        const contact = await ContactsCollection.findOne({
            _id: contactId,
            userId,
        });
        return contact;
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw error;
    }
};

export const createContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
};

export const updateContact = async (
    userId,
    contactId,
    payload,
    options = {},
) => {
    const rawResult = await ContactsCollection.findOneAndUpdate(
        { _id: contactId, userId },
        payload,
        {
            new: true,
            includeResultMetadata: true,
            ...options,
        },
    );

    if (!rawResult || !rawResult.value) return null;

    return {
        contact: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
};

export const deleteContact = async (contactId, userId) => {
    const contact = await ContactsCollection.findOneAndDelete({
        _id: contactId,
        userId,
    });

    return contact;
};

export const getAllContacts = async ({
    userId,
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
    filter = {},
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = ContactsCollection.find({ userId });

    if (filter.type) {
        contactsQuery.where('contactType').equals(filter.type);
    }
    if (filter.isFavourite !== undefined) {
        contactsQuery.where('isFavourite').equals(filter.isFavourite);
    }

    const contactsCount = await ContactsCollection.find({ userId })
        .merge(contactsQuery)
        .countDocuments();

    const contacts = await contactsQuery
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder })
        .exec();

    const paginationData = calculatePaginationData(contactsCount, perPage, page);

    return {
        data: contacts,
        ...paginationData,
    };
};