const parseEnam = (enam) => {
    const isString = typeof enam === 'string';
    if (!isString) return;

    const isValidContactType = ['work', 'home', 'personal'].includes(enam);

    return isValidContactType ? enam : undefined;
};

const parseFilterParams = (query) => {
    const { type, isFavorite } = query;

    const parsedContactType = parseEnam(type);
    const parsedIsFavorite =
        isFavorite === 'true' ? true : isFavorite === 'false' ? false : undefined;

    return {
        type: parsedContactType,
        isFavourite: parsedIsFavorite,
    };
};

export default parseFilterParams;