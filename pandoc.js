var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var mkdirp = require('mkdirp');

var extensions = /\.(md|markdown)$/i;
var reInclude = /(?:^|\n)@include\s(.*)\r*\n/;

// eventually
var includeCache = {};

process.stderr.setMaxListeners(0);

function markitdown(inputFile, overwrite, outPath, options) {
	var outputFile = path.join(outPath, inputFile.replace(extensions, '.html'));

	var args = [
		'-t', 'html5',
		'--tab-stop', '4',
		'--standalone',
		'--highlight-style', 'pygments',
		'--section-divs'
	];

	if (options.docTemplate){
		args.push('--template', options.docTemplate);
	}

	if (options.head) {
		args.push('--include-in-header', options.head);
	}

	if (options.header) {
		args.push('--include-before-body', options.header);
	}

	if (options.footer) {
		args.push('--include-after-body', options.footer);	
	}

	if (options.title) {
		args.push('-T', options.title);
	}

	var pandoc = spawn('pandoc', args);

	pandoc.on('exit', function(exitCode) {
		if (127 == exitCode) {
			console.log('Pandoc not found in your path. Please install from http://johnmacfarlane.net/pandoc/installing.html');
			process.exit(1);
		}
	});

	var outstream = (outputFile) 
		? fs.createWriteStream(outputFile)
		: process.stdout
	;

	var instream = fs.createReadStream(inputFile, { encoding: 'utf8' });

	console.warn(inputFile);

	instream.on('data', function(data) {
		// var include = data.match(reInclude);

		// if (include) {
		// 	include = path.join(path.dirname(inputFile), include[1]);
		// }

		// var rs= fs.createReadStream(include, { encoding: 'utf8' });

		// rs.pipe(pandoc.stdin);

		// rs.on('end', function() {
			pandoc.stdin.write(data);
		// });
	});

	instream.on('end', function() {
		pandoc.stdin.end();
	});

	pandoc.stdout.pipe(outstream);
	pandoc.stderr.pipe(process.stderr);	
}

// todo consolidate into one options object
function checkPath(inputPath, overwrite, outPath, prefix, options) {
	// temp
	overwrite = true;
	prefix = prefix || '';
	outPath = outPath || '';

	inputPath.forEach(function(ipath) {
		ipath = path.join(prefix, ipath);
		fs.stat(ipath, function(err, stats) {

			if (err) {
				console.warn(err);
				return;
			}

			if (stats.isDirectory()) {
				fs.readdir(ipath, function(err, files) {
					checkPath(files, overwrite, outPath, ipath, options);
				});
			}
			else {
				if (extensions.test(ipath)) {	
					mkdirp(path.join(outPath, prefix), function(err) {
						if (err) {
							console.warn(err);
							return;
						}
						markitdown(ipath, overwrite, outPath, options);
					})
				}
			}
			
		});
	});

};

module.exports = checkPath;
