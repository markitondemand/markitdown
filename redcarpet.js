var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var mkdirp = require('mkdirp');

var header = fs.readFileSync(path.join(__dirname, './templates/header.html'));
var footer = fs.readFileSync(path.join(__dirname, './templates/footer.html'));

var extensions = /\.(md|markdown)$/i;



function markitdown(inputFile, overwrite, outPath) {
	var outputFile = path.join(outPath, inputFile.replace(extensions, '.html'));

	// console.warn('in', inputFile, 'out', outputFile);
	
	var rubyRed = spawn(path.join(__dirname, './redcarpetify.rb'));
	
	var out = (outputFile) 
		? fs.createWriteStream(outputFile)
		: process.stdout
	;

	out.write(header);
	rubyRed.on('exit', function() {
		out.write(footer);
	});

	rubyRed.stdout.pipe(out, { end: false });
	fs.createReadStream(inputFile).pipe(rubyRed.stdin);
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