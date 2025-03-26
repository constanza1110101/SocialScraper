# SocialScraper

A Node.js-based OSINT tool that searches for usernames across multiple social media platforms to help identify an individual's online presence.

## Features

- Checks username existence across multiple platforms
- Customizable platform selection
- JSON output support
- Rate limiting and timeout handling

## Requirements

- Node.js 12+
- NPM packages: axios, cheerio, chalk, ora, yargs

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/SocialScraper.git
cd SocialScraper

# Install dependencies
npm install

# Make executable
chmod +x socialscraper.js
```

## Usage

```bash
./socialscraper.js -u [username] -p [platforms] -o [output]

# Examples:
./socialscraper.js -u johndoe
./socialscraper.js -u johndoe -p github,twitter,instagram
./socialscraper.js -u johndoe -o results.json
```

## Supported Platforms

- GitHub
- Twitter
- Instagram
- LinkedIn
- Facebook
- Reddit

## License

MIT License

Copyright (c) 2025 Constanza

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Disclaimer

This tool is provided for legitimate OSINT research purposes only. Users are responsible for complying with applicable laws and regulations when using this tool. The developer assumes no liability for misuse or any damages resulting from the use of this software.
