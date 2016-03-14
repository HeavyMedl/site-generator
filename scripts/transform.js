#!/usr/bin/env node
'use strict';
const path 	 = require('path');
const fs 	 = require('fs');
const $ 	 = require('./lib/util.js');
const args 	 = process.argv.slice(2);
const config = require(path.normalize(args.length > 0 
					? args[0] : '../config.json'));
const theme  = path.normalize('../themes/configured/'+config.theme);

function transform_data() {
	let returnStr = "var data = ";
}

function write_data_js(data) {
	// let _path = `${theme}/assets/js/data.js`;
	let callback = safe(err => {
		if (err) {
			console.error("Error")
			console.trace(err.stack);
			process.exit(1);
		}
	});
	fs.writeFile(_path, data, callback);
}

function write_project_dir() {
	$.mkdirSync();
}

console.log(JSON.stringify(config));