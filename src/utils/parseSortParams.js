import { SORT_ORDER } from '../contacts/index.js';

const parseSortOrder = (sortOrder) => {
    return [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder)
        ? sortOrder
        : SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
    const allowedFields = ['_id', 'name', 'email', 'phone', 'createdAt'];
    return allowedFields.includes(sortBy) ? sortBy : '_id';
};

export const parseSortParams = (query) => {
    return {
        sortBy: parseSortBy(query.sortBy),
        sortOrder: parseSortOrder(query.sortOrder),
    };
};