const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Dynamically & recursively load all route files in the current directory
const loadRoutes = (dir, baseRoute = '') => {
    fs.readdirSync(dir).forEach((file) => {
        const fullPath = path.join(dir, file);
        const routePath = path.join(baseRoute, file.replace('.js', '')).replace(/\\/g, '/');

        if (fs.statSync(fullPath).isDirectory()) {
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
module.exports = router;