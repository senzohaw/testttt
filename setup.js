const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
};

console.log(`${colors.yellow}Starting project setup...${colors.reset}\n`);

try {
    // Create necessary directories
    const dirs = [
        'app/frontend/public',
        'app/frontend/public/assets/troops',
        'app/frontend/public/assets/townhall',
        'app/backend'
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`${colors.green}Created directory: ${dir}${colors.reset}`);
        }
    });

    // Install dependencies from requirements.txt
    console.log(`\n${colors.yellow}Installing dependencies...${colors.reset}`);
    
    const requirements = fs.readFileSync('requirements.txt', 'utf8')
        .split('\n')
        .filter(line => line.trim() !== '');

    requirements.forEach(requirement => {
        try {
            console.log(`Installing ${requirement}...`);
            execSync(`npm install ${requirement}`, { stdio: 'inherit' });
        } catch (error) {
            console.error(`${colors.red}Failed to install ${requirement}${colors.reset}`);
        }
    });

    // Create .env file if it doesn't exist
    if (!fs.existsSync('.env')) {
        const envContent = `CLASH_OF_CLANS_API_KEY=your_api_key_here
REDIS_URL=redis://localhost:6379
PORT=5000`;
        fs.writeFileSync('.env', envContent);
        console.log(`\n${colors.green}Created .env file${colors.reset}`);
    }

    // Add start script to package.json
    let packageJson = {};
    if (fs.existsSync('package.json')) {
        packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    }

    packageJson.scripts = {
        ...packageJson.scripts,
        start: 'node app/backend/server.js',
        dev: 'nodemon app/backend/server.js'
    };

    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log(`\n${colors.green}Updated package.json with start scripts${colors.reset}`);

    console.log(`\n${colors.green}Setup completed successfully!${colors.reset}`);
    console.log(`\n${colors.yellow}Next steps:${colors.reset}`);
    console.log('1. Add your Clash of Clans API key to the .env file');
    console.log('2. Make sure Redis is installed and running');
    console.log('3. Run "npm start" to start the server');
    console.log('4. Open index.html in your browser');

} catch (error) {
    console.error(`\n${colors.red}Setup failed:${colors.reset}`, error);
} 