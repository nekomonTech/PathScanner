#!/usr/bin/env node
const { exec }=require('child_process');
exec('clear')
const fs = require('fs');
const axios = require('axios');
const readline = require('readline');
const { Command } = require('commander');
const program = new Command();
const colors  = require('colors');

console.clear();
console.log(colors.red.bold(`
..............
            ..,;:ccc,.
          ......''';lxO.
.....''''..........,:ld;
           .';;;:::;,,.x,
      ..'''.            0Xxoc:,.  ...
  ....                ,ONkc;,;cokOdc',.
 .                   OMo           ':ddo.
                    dMc               :OO;
                    0M.                 .:o.
                    ;Wd
                     ;XO,                                                                     ,d0Odlc;,..
                           ..',;:cdOOd::,.                                                                 .:d;.':;.
                                       'd,  .'
                                         ;l   .                                                                  .o
                                            c
                                            .'
                                             .
`));


program.requiredOption('-u, --url <url>', 'Target base URL (misal: https://site.com)').requiredOption('-w, --wordlist <file>', 'Path ke file wordlist (.txt)').parse(process.argv);
const { url, wordlist } = program.opts();
if (!fs.existsSync(wordlist)) {
  console.error(colors.red.bold('[!] File wordlist tidak ditemukan.'));
  process.exit(1);
}
const rl = readline.createInterface({
  input: fs.createReadStream(wordlist),
  crlfDelay: Infinity
});
(async () => {
  console.log(colors.red.bold(`[+] Starting brute force to ${url}`));
  for await (const line of rl) {
    const path = line.trim();
    if (!path) continue;
    const fullUrl = `${url.replace(/\/+$/, '')}/${path}`;
    try {
      const res = await axios.get(fullUrl, { timeout: 3000 });
      if (res.status === 200) {
        console.log(colors.red.bold(`[Found] ${fullUrl}`));
      }
    } catch (err) {}
  }
})();
