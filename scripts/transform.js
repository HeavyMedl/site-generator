#!/usr/bin/env node
'use strict';
const path 	 = require('path');
const $ 	 = require('./lib/log.js');
const args 	 = process.argv.slice(2);
const config = require(path.normalize(args.length > 0 
					? args[0] : '../config.json'));
const theme  = path.normalize('../themes/configured/'+config.theme);

function build_data() {
	let str = "";
}