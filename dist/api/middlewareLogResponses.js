export const middlewareLogResponses = (req, res, next) => {
    res.on('finish', () => {
        const { method, url } = req;
        const { statusCode } = res;
        if (statusCode >= 300) {
            console.log(`[NON-OK] ${method} ${url} - Status: ${statusCode}`);
        }
    });
    next();
};
