import type { Request, Response, NextFunction } from 'express';

export const middlewareLogResponses = (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
        const { method, url } = req;
        const { statusCode } = res;
        
        if (statusCode >= 300) {
            console.log(`[NON-OK] ${method} ${url} - Status: ${statusCode}`)
        }
    })
    
    next();
}