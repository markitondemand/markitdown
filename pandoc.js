var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var mkdirp = require('mkdirp');

var extensions = /\.(md|markdown)$/i;
var reInclude = /(?:^|\n)@include\s(.*)\r*\n/;

// eventually
var includeCache = {};

function markitdown(inputFile, overwrite, outPath) {
	var outputFile = path.join(outPath, inputFile.replace(extensions, '.html'));

	var pandoc = spawn('pandoc', [
		// inputFile,
		// '-o', outputFile,
		'--toc',
		'-t', 'html5',
		'--tab-stop', '4',
		'--standalone',
		'--highlight-style', 'pygments',
		// '-T', 'node-dcl',
		'-c', 'test.css'
	]);

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

function checkPath(inputPath, overwrite, outPath, prefix) {
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
					checkPath(files, overwrite, outPath, ipath);
				});
			}
			else {
				if (extensions.test(ipath)) {	
					mkdirp(path.join(outPath, prefix), function(err) {
						if (err) {
							console.warn(err);
							return;
						}
						markitdown(ipath, overwrite, outPath);
					})
				}
			}
			
		});
	});

};

module.exports = checkPath;