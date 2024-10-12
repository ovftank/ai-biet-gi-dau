import express, { Express, Request, Response } from 'express';
import DataStore from '../database/dataStore.js';
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoutes from './admin/adminRoutes.js';
import bodyParser from 'body-parser';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATIC_PATH = path.join(__dirname, '../../static');
const PORT = 3000;

export const createServer = async (): Promise<Express> => {
    const app = express();
    app.use(express.static(STATIC_PATH));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(bodyParser.json());
    app.use('/api/admin', adminRoutes);
    app.get('*', (_req: Request, res: Response) => {
        if (/\.(js|css|jpg|jpeg|png|gif|svg|ico)$/.test(_req.path)) {
            res.sendFile(path.join(STATIC_PATH, _req.path));
        } else {
            res.sendFile(path.join(STATIC_PATH, 'index.html'));
        }
    });

    const database = new DataStore();
    await database.connect();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    return app;
};
