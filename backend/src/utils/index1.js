import { Router } from 'express';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
const router = Router();

// Dynamically & recursively load all route files in the current directory
const loadRoutes = (dir, baseRoute = '') => {
    readdirSync(dir).forEach((file) => {
        const fullPath = join(dir, file);
        const routePath = join(baseRoute, file.replace('.js', '')).replace(/\\/g, '/');

        if (statSync(fullPath).isDirectory()) {
            loadRoutes(fullPath, routePath);
        } else if (file !== 'index.js' && file.endsWith('.js')) {
            try {
                const route = require(fullPath);
                router.use(`/${routePath}`, route);
            } catch (error) {
                console.error(`Failed to load route ${file}:`, error);
            }
        }
    })
}

loadRoutes(__dirname);
//console.log(router);
export default router;