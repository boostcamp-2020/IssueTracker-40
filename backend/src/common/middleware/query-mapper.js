const queryMapper = (queryParser) => {
    return (req, res, next) => {
        const queryMap = queryParser.parse(req?.query?.q);
        req.context = { ...req?.context, queryMap };

        next();
    };
};

export { queryMapper };
