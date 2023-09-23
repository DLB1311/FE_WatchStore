const sanitizeSearchQuery = (query) => {
    return query.trim().replace(/\s+/g, ' ');
};

export default sanitizeSearchQuery