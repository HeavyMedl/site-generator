#!/usr/bin/env node
'use strict';
const path = require('path');
const fs = require('fs');
const wrench = require('wrench');
const chalk = require('chalk');
const config = require('./config.json');
const norm = path.normalize;

// paths used by script
const theme_source = norm('./themes/configured/'+config.settings.theme);
const theme_dest = norm(`${config.settings.out}/${config.body.title}`);
const src_imgs = norm(config.settings.imgs_root);
const dst_imgs = norm(`${theme_dest}/${config.settings.theme_assets}/${config.settings.theme_imgs}/${src_imgs}`);
const dst_js = norm(`${theme_dest}/${config.settings.theme_assets}/${config.settings.theme_js}/`);
const prop_imgs = norm(`${src_imgs}/${config.settings.property_dir}`);
const car_imgs = norm(`${src_imgs}/${config.settings.carousel_dir}`);

// terminal color methods
const script = "transform.js";
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

function build_test() {
	const spawn = require('child_process').spawn;
	const esc_dest = theme_dest.replace(/(["\s'$`\\])/g,'\\$1');
	run();
	spawn('sh', ['-c', 
		`cd ${esc_dest} && python3 -m http.server 8888`], 
		{ stdio: 'inherit' });
	console.log(
		chalk.bgYellow(`Serving ${theme_dest} @ 127.0.0.1:8888`));
}

function deleteFolderRecursive(path) {
	if(fs.existsSync(path)) {
		fs.readdirSync(path).forEach(function(file,index){
			var curPath = path + "/" + file;
			if(fs.lstatSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};

function clean_up() {
	const name = ' clean_up ';
	console.log(_script(script)+method(name)+desc(
		`If ${theme_dest} exists, removing for fresh build`));

	deleteFolderRecursive(theme_dest);

	console.log(_script(script)+method(name)+succ(
		'Done with clean up'));	
}

function copy_configured_theme() {
	const name = ' copy_configured_theme ';
	console.log(_script(script)+method(name)+desc(
			`Copying from ${theme_source} to ${theme_dest}`));

	wrench.copyDirSyncRecursive(theme_source, theme_dest);
	
	console.log(_script(script)+method(name)+succ(
		'Done copying.'));
}

function copy_imgs() {
	const name = ' copy_imgs ';
	console.log(_script(script)+method(name)+desc(
		`Copying from ${src_imgs} to ${dst_imgs}`));
	
	wrench.copyDirSyncRecursive(src_imgs, dst_imgs);

	console.log(_script(script)+method(name)+succ(
		'Done copying'));		
}

function transform_data() {
	const name = ' transform_data ';
	console.log(_script(script)+method(name)+desc(
			'Configuring data.js object'));

	let carousel = wrench.readdirSyncRecursive(car_imgs),
		property = wrench.readdirSyncRecursive(prop_imgs)
	
	carousel = get_images(carousel, car_imgs);
	property = get_images(property, prop_imgs);

	config.settings.carousel_imgs = carousel;
	config.settings.property_imgs = property;

	console.log(_script(script)+method(name)+succ(
		'Done configuring data.js object'));
}

function get_images(img_arr, path_config) {
	const name = ' get_images ';
	console.log(_script(script)+method(name)+desc(
			'Building array of images'));
	let imgs = [];
	img_arr.forEach(img => {
		let info = fs.statSync(norm(`${path_config}/${img}`));
		if (info.isFile() && (path.extname(img) == '.jpg'||
			path.extname(img)== '.png')) {
			imgs.push(img.replace(/\s/g, "%20"));
		}
	});

	console.log(_script(script)+method(name)+succ(
		'Done building array of images'));
	return imgs;
}

function write_data_js() {
	const name = ' write_data_js ';
	const _path = norm(`${dst_js}/data.js`);
	console.log(_script(script)+method(name)+desc(
			`Creating data.js at ${_path}`));

	fs.writeFileSync(_path, 
		';var data = '+JSON.stringify(config)+';');

	console.log(_script(script)+method(name)+succ(
		`data.js located at ${_path}`));
}

function run() {
	safe(clean_up)();
	safe(copy_configured_theme)();
	safe(copy_imgs)();
	safe(transform_data)();
	safe(write_data_js)();
}

process.argv.slice(2)[0] == 'test'
	? build_test()
	: run()
