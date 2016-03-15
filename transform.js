#!/usr/bin/env node
'use strict';
const script = "transform.js";
const path 	 = require('path');
const fs 	 = require('fs');
const ncp 	 = require('ncp');
const chalk  = require('chalk');
const args 	 = process.argv.slice(2);
const config = require(args.length > 0 ? args[0] : './config.json');
const source = path.normalize(config.theme);
const dest 	 = path.normalize(`${config.out}/${config.body.title}`);

// terminal color methods
const _script = chalk.cyan.bold.underline;
const method = chalk.cyan;
const desc = chalk.yellow;

function safe(fn) {
	return function() {
		try {
			return fn.apply(this, arguments);
		} catch(ex) {
			console.trace(ex.stack);
			process.exit(1);
		}
	}
}

function transform_data() {
	// log this
	let returnStr = "var data = ";
}

function write_data_js(data) {
	// log this
	// let _path = `${theme}/assets/js/data.js`;
	let callback = safe(err => {
		if (err) {
			console.trace(err.stack);
			process.exit(1);
		}
	});
	fs.writeFile(_path, data, callback);
}

function copy_configured_theme() {
	const name = ' copy_configured_theme ';
	console.log(
		_script(script)+method(name)+desc(`Copying from ${source} to ${dest}`));

	ncp(source, dest, err => {
		if (err) {
			console.trace(err.stack);
			process.exit(1);
		}
	});

	console.log(_script(script)+method(name)+desc('Done copying.'));
}

safe(copy_configured_theme)();