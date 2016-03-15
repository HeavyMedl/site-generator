#!/usr/bin/env node
'use strict';
const script = "transform.js";
const path 		= require('path');
const fs 		= require('fs');
const wrench 	= require('wrench');
const chalk  	= require('chalk');
const args 		= process.argv.slice(2);
const config 	= require(args.length > 0 ? args[0] : './config.json');
const norm 		= path.normalize
const source 	= norm(config.theme);
const dest 		= norm(`${config.out}/${config.body.title}`);

// terminal color methods
const _script = chalk.cyan.bold.underline;
const method = chalk.cyan;
const desc = chalk.yellow;
const succ = chalk.green;

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
	const name = ' transform_data ';
	console.log(_script(script)+method(name)+desc(
			'Configuring data.js object'));

	let returnStr = "var data = ",
		carousel = wrench.readdirSyncRecursive(
			norm(config.header.carousel)),
		all = wrench.readdirSyncRecursive(
			norm(config.body.imgs));
	
	get_relative_paths(carousel, config.header.carousel);
	get_relative_paths(all, config.body.imgs);

	console.log(_script(script)+method(name)+succ(
		'Done configuring data.js object'));
}

function get_relative_paths(img_arr, path_config) {
	const name = ' get_relative_paths ';
	console.log(_script(script)+method(name)+desc(
			'Building list of relative paths'));

	let imgs = [];
	img_arr.forEach(img => {
		let info = fs.statSync(norm(`${path_config}/${img}`));
		if (info.isFile() && (path.extname(img) == '.jpg'||
			path.extname(img)== '.png')) {
			imgs.push(
				norm(`/assets/img/imgs/${img.replace(/\s/g, "%20")}`)
			);
		}
	});

	console.log(_script(script)+method(name)+succ(
		'Done building list of relative paths'));
	return imgs;
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
	console.log(_script(script)+method(name)+desc(
			`Copying from ${source} to ${dest}`));

	wrench.copyDirSyncRecursive(source, dest);
	
	console.log(_script(script)+method(name)+succ(
		'Done copying.'));
}

safe(copy_configured_theme)();
safe(transform_data)();