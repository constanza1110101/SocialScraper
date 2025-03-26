#!/usr/bin/env node

const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');

// CLI Arguments
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

// Platform URLs
const PLATFORM_TEMPLATES = {
  github: 'https://github.com/{username}',
  twitter: 'https://twitter.com/{username}',
  instagram: 'https://www.instagram.com/{username}/',
  linkedin: 'https://www.linkedin.com/in/{username}/',
  facebook: 'https://www.facebook.com/{username}',
  reddit: 'https://www.reddit.com/user/{username}'
};

// Function to validate username existence
const validateUsername = async (url) => {
  try {
    const response = await axios.get(url, { validateStatus: false });
    return response.status !== 404;
  } catch {
    return false;
  }
};

// Check username availability across platforms
async function checkUsername(username, platform) {
  const url = PLATFORM_TEMPLATES[platform]?.replace('{username}', username);
  if (!url) return { platform, exists: false, error: 'Unsupported platform' };

  try {
    const exists = await validateUsername(url);
    return { platform, exists, url: exists ? url : null };
  } catch (error) {
    return { platform, exists: false, error: error.message };
  }
}

// Main function
async function main() {
  console.log(chalk.cyan('\n╔══════════════════════════════════════╗'));
  console.log(chalk.cyan('║    SocialScraper - Username OSINT    ║'));
  console.log(chalk.cyan('╚══════════════════════════════════════╝\n'));

  const { username, platforms, output, timeout } = argv;
  const platformList = platforms.split(',').map(p => p.trim().toLowerCase());

  console.log(chalk.green(`[+] Target: ${username}`));
  console.log(chalk.green(`[+] Checking platforms: ${platformList.join(', ')}`));
  
  axios.defaults.timeout = timeout;
  axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0';

  // Perform checks concurrently for speed optimization
  const results = await Promise.all(
    platformList.map(async (platform) => {
      const spinner = ora(`Checking ${platform}...`).start();
      const result = await checkUsername(username, platform);
      
      if (result.exists) {
        spinner.succeed(chalk.green(`Found on ${platform}: ${result.url}`));
      } else if (result.error) {
        spinner.fail(chalk.red(`Error checking ${platform}: ${result.error}`));
      } else {
        spinner.info(chalk.yellow(`Not found on ${platform}`));
      }
      
      return result;
    })
  );

  // Summary
  console.log('\n' + chalk.cyan('═════════ Summary ═════════'));
  const foundProfiles = results.filter(r => r.exists);
  console.log(chalk.green(`[+] Found ${foundProfiles.length} profiles for "${username}"`));
  foundProfiles.forEach(({ platform, url }) => console.log(chalk.green(`  - ${platform}: ${url}`)));

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
