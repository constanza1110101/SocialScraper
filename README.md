SocialScraper
Username OSINT Tool
SocialScraper is a Node.js-based OSINT tool that searches for usernames across multiple social media platforms to help identify an individual's online presence.

Features
Checks username existence across multiple platforms
Customizable platform selection
JSON output support
Rate limiting and timeout handling
Requirements
Node.js 12+
NPM packages: axios, cheerio, chalk, ora, yargs
Installation
bash

Hide
# Clone the repository
git clone https://github.com/yourusername/SocialScraper.git
cd SocialScraper

# Install dependencies
npm install

# Make executable
chmod +x socialscraper.js
Usage
bash

Hide
./socialscraper.js -u [username] -p [platforms] -o [output]

# Examples:
./socialscraper.js -u johndoe
./socialscraper.js -u johndoe -p github,twitter,instagram
./socialscraper.js -u johndoe -o results.json
Supported Platforms
GitHub
Twitter
Instagram
LinkedIn
Facebook
Reddit
License
This tool is provided for legitimate OSINT research purposes only.
