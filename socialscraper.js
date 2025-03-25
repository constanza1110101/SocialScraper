#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');
const chalk = require('chalk');
const ora = require('ora');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const path = require('path');

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 -u [username] -p [platforms] -o [output]')
  .option('username', {
    alias: 'u',
    describe: 'Username to search',
    type: 'string',
    demandOption: true
  })
  .option('platforms', {
    alias: 'p',
    describe: 'Comma-separated list of platforms to search',
    type: 'string',
    default: 'github,twitter,instagram,linkedin,facebook,reddit'
  })
  .option('output', {
    alias: 'o',
    describe: 'Output file (JSON format)',
    type: 'string'
  })
  .option('timeout', {
    alias: 't',
    describe: 'Request timeout in milliseconds',
    type: 'number',
    default: 5000
  })
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'v')
  .argv;

const PLATFORMS = {
  github: {
    url: 'https://github.com/{username}',
    validate: async (url) => {
      const response = await axios.get(url, { validateStatus: false });
      return response.status !== 404;
    }
  },
  twitter: {
    url: 'https://twitter.com/{username}',
    validate: async (url) => {
      try {
        const response = await axios.get(url, { validateStatus: false });
        return response.status !== 404;
      } catch (error) {
        return false;
      }
    }
  },
  instagram: {
    url: 'https://www.instagram.com/{username}/',
    validate: async (url) => {
      try {
        const response = await axios.get(url, { validateStatus: false });
        return response.status !== 404;
      } catch (error) {
        return false;
      }
    }
  },
  linkedin: {
    url: 'https://www.linkedin.com/in/{username}/',
    validate: async (url) => {
      try {
        const response = await axios.get(url, { validateStatus: false });
        return response.status !== 404;
      } catch (error) {
        return false;
      }
    }
  },
  facebook: {
    url: 'https://www.facebook.com/{username}',
    validate: async (url) => {
      try {
        const response = await axios.get(url, { validateStatus: false });
        return response.status !== 404;
      } catch (error) {
        return false;
      }
    }
  },
  reddit: {
    url: 'https://www.reddit.com/user/{username}',
    validate: async (url) => {
      try {
        const response = await axios.get(url, { validateStatus: false });
        return response.status !== 404;
      } catch (error) {
        return false;
      }
    }
  }
};

async function checkUsername(username, platform) {
  const platformConfig = PLATFORMS[platform];
  if (!platformConfig) {
    return { platform, exists: false, error: 'Platform not supported' };
  }

  const url = platformConfig.url.replace('{username}', username);
  
  try {
    const exists = await platformConfig.validate(url);
    return {
      platform,
      exists,
      url: exists ? url : null
    };
  } catch (error) {
    return {
      platform,
      exists: false,
      error: error.message
    };
  }
}

async function main() {
  console.log(chalk.cyan('╔══════════════════════════════════════╗'));
  console.log(chalk.cyan('║ SocialScraper - Username OSINT Tool  ║'));
  console.log(chalk.cyan('╚══════════════════════════════════════╝'));
  
  const { username, platforms, output, timeout } = argv;
  const platformList = platforms.split(',').map(p => p.trim().toLowerCase());
  
  console.log(chalk.green(`[+] Target username: ${username}`));
  console.log(chalk.green(`[+] Platforms to check: ${platformList.join(', ')}`));
  
  axios.defaults.timeout = timeout;
  axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  
  const results = [];
  
  for (const platform of platformList) {
    const spinner = ora(`Checking ${platform}...`).start();
    
    try {
      const result = await checkUsername(username, platform);
      results.push(result);
      
      if (result.exists) {
        spinner.succeed(chalk.green(`Found on ${platform}: ${result.url}`));
      } else if (result.error) {
        spinner.fail(chalk.red(`Error checking ${platform}: ${result.error}`));
      } else {
        spinner.info(chalk.yellow(`Not found on ${platform}`));
      }
    } catch (error) {
      spinner.fail(chalk.red(`Error checking ${platform}: ${error.message}`));
      results.push({
        platform,
        exists: false,
        error: error.message
      });
    }
  }
  
  // Summary
  console.log('\n' + chalk.cyan('═════════ Summary ═════════'));
  const foundCount = results.filter(r => r.exists).length;
  console.log(chalk.green(`[+] Found ${foundCount} profiles for username "${username}"`));
  
  // Save results if output specified
  if (output) {
    try {
      fs.writeFileSync(output, JSON.stringify(results, null, 2));
      console.log(chalk.green(`[+] Results saved to ${output}`));
    } catch (error) {
      console.error(chalk.red(`[-] Error saving results: ${error.message}`));
    }
  }
}

main().catch(error => {
  console.error(chalk.red(`[-] Fatal error: ${error.message}`));
  process.exit(1);
});
