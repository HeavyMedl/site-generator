'use strict';
module.exports = {
	/**
	 * [description]
	 * @param  {[type]} string [description]
	 * @param  {[type]} codes  [description]
	 * @return {[type]}        [description]
	 */
	log : (string, codes) => {
		string += module.exports.ansi('rset'); // reset terminal
		const array = [string].concat(codes);
		console.log.apply(null, array);
	},
	/**
	 * [ansi description]
	 * @param  {[type]} code [description]
	 * @return {[type]}      [description]
	 */
	ansi : (code) => {
		const codes = {
			rset      : '0',
			bold      : '1',
			cyan      : '36',
			bold      : '1',
			rbld      : '22',
			yllw      : '33'
		}
		return '\x1b['+codes[code]+'m';
	},
	/**
	 * [description]
	 * @param  {[type]} path [description]
	 * @return {[type]}      [description]
	 */
	mkdirSync : (path) => {
		safe(fs.mkdirSync)(path);
	},
	/**
	 * [description]
	 * @param  {Function} fn [description]
	 * @return {[type]}      [description]
	 */
	safe : (fn) => {
		return () => {
			try {
				return fn.apply(this, arguments);
			} catch(ex) {
				console.trace(ex.stack);
				process.exit(1);
			}
		}
	}
}