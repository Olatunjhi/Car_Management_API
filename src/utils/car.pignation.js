const pagination = (query) => {
    const page_default = 1;
    const limit_default = 10;
    const maxLimit = 100;

    let page = query.page;
    let limit = query.limit;

    if (isNaN(page) || page < 1)
    {
        page = page_default;
    }

    if (isNaN(limit) || limit < 10 || limit > maxLimit)
    {
        limit = limit_default;
    }

    const skip = (page - 1) * limit;

    return { page, limit , skip };
}

module.exports = pagination;