# WA MediaBox

GALLERIES / PAGINATION / IFRAME / YOUTUBE VIDEOS / RESPONSIVE / MODERN DESIGN

**NO jQuery needed**

[See DEMO at official page](http://jiri.hybek.cz/wa-mediabox/)

## Usage

Load MediaBox JavaScript and CSS:

```html
<script type="text/javascript" src="wa-mediabox/dist/wa-mediabox.min.js"></script>
<link rel="stylesheet" type="text/css" href="wa-mediabox/dist/wa-mediabox.min.css" />
```

When page loads then following elements are bound to MediaBox:

### For images:

```html
<a href="image.jpg" data-mediabox="my-gallery-name" data-title="Sample image">
	<img src="image-thumb.jpg" alt="Image" />
</a> 
```

### For iframes:

```html
<a href="https://www.youtube.com/embed/FA_8TY9Z5Zg?rel=0"
	data-mediabox="my-gallery-name"
	data-iframe="true"
	data-width="853"
	data-height="480"
	data-title="Sample video in iframe">
	<img src="image-thumb.jpg" alt="Image" />
</a> 
```

**YouTube videos are detected automatically so you can omit data-iframe attribute.**

## JavaScript API

```html
<script type="text/javascript">

	//Bind single element manually
	WAMediaBox.bind(document.querySelector(".my-element"));

	//Bind all child elements
	WAMediaBox.bindAll(document.querySelector(".my-parent-element"));

	//Translate - set before any binding
	WAMediaBox.lang = {
		prev: "Previous",
		next: "Next",
		close: "Close",
		openInNew: "Open in new window"
	};

</script>
```html

## License

The MIT License (MIT)

Copyright (c) 2015 WA Studio (www.webarts.name)
Copyright (c) 2015 Jiri Hybek (jiri.hybek.cz)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

