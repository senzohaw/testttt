const { execSync } = require('child_process');
const fs = require('fs');

// Check if Redis is installed
try {
    execSync('which redis-server');
} catch (error) {
    console.log('Installing Redis...');
    execSync('apt-get update && apt-get install -y redis-server');
}

// Start Redis server
try {
    execSync('redis-server --daemonize yes');
    console.log('Redis server started');
} catch (error) {
    console.error('Failed to start Redis server:', error);
}

// Install dependencies if not already installed
if (!fs.existsSync('node_modules')) {
    console.log('Installing dependencies...');
    execSync('node setup.js');
}

// Start the application
require('./app/backend/server.js'); 