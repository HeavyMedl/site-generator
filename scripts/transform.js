#!/usr/bin/env node
'use strict';
const $ = require('./lib/log.js');
const args = process.argv.slice(2);
const config = require(args.length > 0 
	? args[0] : '../config.json');

console.log(config.description);