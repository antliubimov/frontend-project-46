#!/usr/bin/env node

import { program } from 'commander';

program
  .name('gendiff')
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-V, --version', 'output the version number')
  .option('-h, --help', 'display help for command')

program.parse(process.argv);


