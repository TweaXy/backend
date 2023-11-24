const getFullUrl = (req) => {
    const extendedUrl = req.url.split('?')[0];

    return `${req.protocol}://${req.get('host')}/${req.baseUrl}${extendedUrl}`;
};

export default getFullUrl;
