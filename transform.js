#!/usr/bin/env node
'use strict';
const script = "transform.js";
const path = require('path');
const fs = require('fs');
const wrench = require('wrench');
const chalk = require('chalk');
const args = process.argv.slice(2);
const config = require(args.length > 0 ? args[0] : './config.json');
const norm = path.normalize
const source = norm(config.settings.theme);
const dest = norm(`${config.settings.out}/${config.body.title}`);

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

function copy_configured_theme() {
	const name = ' copy_configured_theme ';
	console.log(_script(script)+method(name)+desc(
			`Copying from ${source} to ${dest}`));

	wrench.copyDirSyncRecursive(source, dest);
	
	console.log(_script(script)+method(name)+succ(
		'Done copying.'));
}

function copy_imgs() {
	const name = ' copy_imgs ';
	const src = norm(config.body.imgs);
	const dst = norm(`${dest}/assets/img/imgs`);
	console.log(_script(script)+method(name)+desc(
		`Copying from ${src} to ${dest}`));
	
	wrench.copyDirSyncRecursive(src, dst);

	console.log(_script(script)+method(name)+succ(
		'Done copying.'));		
}

function transform_data() {
	const name = ' transform_data ';
	console.log(_script(script)+method(name)+desc(
			'Configuring data.js object'));

	let carousel = wrench.readdirSyncRecursive(
			norm(config.header.carousel)),
		all = wrench.readdirSyncRecursive(
			norm(config.body.imgs));
	
	carousel = get_relative_paths(carousel, config.header.carousel);
	all = get_relative_paths(all, config.body.imgs);

	config.header.carousel = carousel;
	config.body.imgs = all;

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
				norm(`assets/img/${path_config}/${img.replace(/\s/g, "%20")}`)
			);
		}
	});

	console.log(_script(script)+method(name)+succ(
		'Done building list of relative paths'));
	return imgs;
}

function write_data_js() {
	const name = ' write_data_js ';
	const _path = norm(`${dest}/assets/js/data.js`);
	console.log(_script(script)+method(name)+desc(
			`Creating data.js at ${_path}`));

	fs.writeFileSync(_path, 
		';var data = '+JSON.stringify(config)+';');

	console.log(_script(script)+method(name)+succ(
		`data.js located at ${_path}`));
}

safe(copy_configured_theme)();
safe(copy_imgs)();
safe(transform_data)();
safe(write_data_js)();