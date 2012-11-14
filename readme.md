# markitdown

A thin wrapper around pandoc to help you convert markdown into web pages.

## Dependencies

1. Node.js (http://nodejs.org/)
2. Pandoc (http://johnmacfarlane.net/pandoc/installing.html)

## Install

```bash
$> npm install markitdown -g
```

## Usage

	Convert markdown to html courtesy of pandoc.
	Files will be written with the same name and a .html exension

	Usage: markitdown inputFile.md


	Options:
	  --output-path  Output path.                                  
	  --head         file to be included in <head>                 
	  --header       file to be included just after opening <body> 
	  --footer       file to be included just before end of </body>
	  --title        prepend <title> tags with this value
	  --docTemplate  file to be used instead of default pandoc template
	  --version      output version and exit

## Examples

As basic as it gets. Convert a single file to html.  This will output `readme.html`.

```bash
$> markitdown readme.md
```

Convert the markdown files in the `./docs` directory to html and put the output in the `./docsweb` directory.

```bash
$> markitdown ./docs --output-path ./docsweb
```

Convert a single file to html, but insert html content into the top of the page. Useful for common navigation, headers, logos, etc.

```bash
$> markitdown readme.md --header ./header.html
```

## Sample output

Wouldn't that be nice!  Will add some to the gh-pages branch in the future.