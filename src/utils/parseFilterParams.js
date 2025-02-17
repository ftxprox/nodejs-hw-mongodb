const parseEnam = (enam) => {
    const isString = typeof enam === 'string';
    if (!isString) return;

    const isValidContactType = ['work', 'home', 'personal'].includes(enam);

    return isValidContactType ? enam : undefined;
};


export const parseFilterParams = (query) => {
    const { type, isFavourite } = query;

    const parsedContactType = parseEnam(type);
    const parsedIsFavourite =
        isFavourite === 'true' ? true : isFavourite === 'false' ? false : undefined;

    return {
        type: parsedContactType,
        isFavourite: parsedIsFavourite,
    };
};