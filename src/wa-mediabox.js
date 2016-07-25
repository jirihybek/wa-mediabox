/*
 * WA MediaBox
 *
 * @author WA Studio <www.webarts.name>
 * @author Jiri Hybek <jiri@hybek.cz>
 * @license MIT
 */

(function(){

	/*
	 * Preloader constructor
	 */
	var Preloader = function(){

		this.el = document.createElement("div");
		this.el.classList.add("wa-mediabox-preloader");

		this.wrap = document.createElement("div");
		this.wrap.classList.add("wa-mediabox-preloader-wrap");

		this.spinner = document.createElement("div");
		this.spinner.classList.add("wa-mediabox-preloader-spinner");

		this.patch = document.createElement("div");
		this.patch.classList.add("wa-mediabox-preloader-patch");

		this.clipperLeft = document.createElement("div");
		this.clipperLeft.classList.add("wa-mediabox-preloader-clipper");
		this.clipperLeft.classList.add("left");

		this.clipperRight = document.createElement("div");
		this.clipperRight.classList.add("wa-mediabox-preloader-clipper");
		this.clipperRight.classList.add("right");

		var circle = document.createElement("div");
		circle.classList.add("wa-mediabox-preloader-circle");

		this.patch.appendChild(circle);
		this.clipperLeft.appendChild(circle.cloneNode(true));
		this.clipperRight.appendChild(circle.cloneNode(true));

		this.spinner.appendChild(this.clipperLeft);
		this.spinner.appendChild(this.patch);
		this.spinner.appendChild(this.clipperRight);

		this.wrap.appendChild(this.spinner);
		this.el.appendChild(this.wrap);

	};

	Preloader.prototype.show = function(){

		this.el.classList.remove("hidden");
		this.el.style.display = '';

	};

	Preloader.prototype.hide = function(){

		var self = this;

		this.el.classList.add("hidden");

		setTimeout(function(){

			if(self.el.classList.contains("hidden"))
				self.el.style.display = 'none';

		}, 350);

	};

	/* 
     * Gallery constructor
     */
	var WAMediaBox_Gallery = function(parent){

		this.parent = parent;
		this.mediaList = [];
		
		this.opened = false;

		this.loaded = false;
		this.current = null;

		this.containerWidth = null;
		this.containerHeight = null;

	};

	/*
	 * Media adders
	 */
	WAMediaBox_Gallery.prototype.addImage = function(src, title){

		this.mediaList.push({
			type: "image",
			src: src,
			title: title
		});

		return this.mediaList.length - 1;

	};

	WAMediaBox_Gallery.prototype.addIframe = function(src, title, width, height){

		this.mediaList.push({
			type: "iframe",
			src: src,
			title: title,
			width: width,
			height: height
		});

		return this.mediaList.length - 1;

	};

	/*
	 * Open gallery
	 */
	WAMediaBox_Gallery.prototype.open = function(index){

		if(this.opened) return;

		var self = this;

		this.current = -1;
		this.loaded = false;

		//Create overlay and content wrapper
		this.overlay = document.createElement("div");
		this.overlay.classList.add("wa-mediabox-overlay");

		this.frame = document.createElement("div");
		this.frame.classList.add("wa-mediabox-frame");

		this.container = document.createElement("div");
		this.container.classList.add("wa-mediabox-container");

		this.title = document.createElement("div");
		this.title.classList.add("wa-mediabox-title");

		this.loading = new Preloader();

		//Buttons
		this.closeBtn = document.createElement("button");
		this.closeBtn.classList.add("wa-mediabox-close");
		this.closeBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>';
		this.closeBtn.setAttribute("title", this.parent.lang.close);

		this.prevBtn = document.createElement("button");
		this.prevBtn.classList.add("wa-mediabox-prev");
		this.prevBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg>';
		this.prevBtn.setAttribute("title", this.parent.lang.prev);

		this.nextBtn = document.createElement("button");
		this.nextBtn.classList.add("wa-mediabox-next");
		this.nextBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>';
		this.nextBtn.setAttribute("title", this.parent.lang.next);

		this.openBtn = document.createElement("button");
		this.openBtn.classList.add("wa-mediabox-open");
		this.openBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" /></svg>';
		this.openBtn.setAttribute("title", this.parent.lang.openInNew);

		//Put together
		this.frame.appendChild(this.container);
		this.frame.appendChild(this.title);
		this.frame.appendChild(this.loading.el);
		this.frame.appendChild(this.closeBtn);
		this.frame.appendChild(this.prevBtn);
		this.frame.appendChild(this.nextBtn);
		this.frame.appendChild(this.openBtn);

		this.overlay.appendChild(this.frame);
		document.body.appendChild(this.overlay);

		//Bind events
		this.overlay.addEventListener("click", function(ev){

			ev.stopPropagation();
			self.close();

		});

		this.closeBtn.addEventListener("click", function(ev){

			ev.stopPropagation();
			self.close();

		});

		this.prevBtn.addEventListener("click", function(ev){

			ev.stopPropagation();
			self.prev();

		});

		this.nextBtn.addEventListener("click", function(ev){

			ev.stopPropagation();
			self.next();

		});

		this.container.addEventListener("click", function(ev){

			ev.stopPropagation();
			self.next();

		});

		this.openBtn.addEventListener("click", function(ev){

			ev.stopPropagation();
			self.openSource();

		});

		//Resize
		this.resizeHandler = function(){

			self.resizeContainer();

		};

		this.keyDownHandler = function(ev){

			ev.preventDefault();
			ev.stopPropagation();

			if(ev.keyCode === 37)
				self.prev();
			else if(ev.keyCode === 39)
				self.next();
			else if(ev.keyCode === 27)
				self.close();

			return false;

		};

		window.addEventListener("resize", this.resizeHandler);
		document.body.addEventListener("keydown", this.keyDownHandler);

		//Open
		setTimeout(function(){

			self.overlay.classList.add("opened");

			self.loadMedia(index);

		}, 10);

		//Set opened
		this.opened = true;

	};

	/*
	 * Close gallery
	 */
	WAMediaBox_Gallery.prototype.close = function(){

		if(!this.opened) return;

		var self = this;

		this.overlay.classList.remove("opened");

		window.removeEventListener("resize", this.resizeHandler);
		document.body.removeEventListener("keydown", this.keyDownHandler);

		setTimeout(function(){

			self.overlay.parentElement.removeChild(self.overlay);
			self.opened = false;

			self.nextBtn = null;
			self.prevBtn = null;
			self.closeBtn = null;
			self.openBtn = null;
			self.loading = null;
			self.container = null;
			self.frame = null;
			self.overlay = null;

			self.current = null;
			self.containerWidth = null;
			self.containerHeight = null;

		}, 450);

	};

	/*
	 * Resize container
	 */
	WAMediaBox_Gallery.prototype.resizeContainer = function(){

		if(!this.opened) return;

		//Defaults
		if(!this.containerWidth)
			this.containerWidth = Math.round(this.overlay.offsetWidth * 0.7);

		if(!this.containerHeight)
			this.containerHeight = Math.round(this.overlay.offsetWidth * 0.7);

		var widthLimit = 160;

		if(this.overlay.offsetWidth < 480)
			widthLimit = 70;

		var maxWidth = Math.min(this.overlay.offsetWidth * 0.9, this.overlay.offsetWidth - widthLimit);
		var maxHeight = Math.min(this.overlay.offsetHeight * 0.9, this.overlay.offsetHeight - 64);

		var targetWidth = this.containerWidth;
		var targetHeight = this.containerHeight;

		//Resize if neccesary
		var ratio = targetWidth / targetHeight;

		if(targetWidth > maxWidth){
			targetWidth = Math.round(maxWidth);
			targetHeight = targetWidth / ratio;
		}

		if(targetHeight > maxHeight){
			targetHeight = Math.round(maxHeight);
			targetWidth = targetHeight * ratio;
		}

		//Set styles
		this.frame.style.width = targetWidth + "px";
		this.frame.style.height = targetHeight + "px";

		this.frame.style.marginLeft = -Math.round(targetWidth / 2) + "px";
		this.frame.style.marginTop = -Math.round(targetHeight / 2) + "px";

	};

	/*
	 * Set media into container
	 */
	WAMediaBox_Gallery.prototype.setMedia = function(type, src, title, width, height){

		if(!this.opened) return;

		var self = this;
		this.loaded = false;

		this.frame.classList.remove("can-open-in-new");
		self.frame.classList.remove("has-title");

		//Reset content
		this.container.innerHTML = '';

		//Create proper element
		var mediaEl = null;

		if(type == "image"){

			//Resize
			if(width) this.containerWidth = width;
			if(height) this.containerHeight = height;
			this.resizeContainer();

			mediaEl = document.createElement("img");

			mediaEl.addEventListener("load", function(){

				self.containerWidth = mediaEl.width;
				self.containerHeight = mediaEl.height;

				self.resizeContainer();
				self.frame.classList.add("can-open-in-new");

				//Add to DOM
				self.container.appendChild(mediaEl);

			});

			mediaEl.src = src;

		} else {

			//Resize
			if(width) this.containerWidth = width;
			if(height) this.containerHeight = height + ( title ? 52 : 0 );
			this.resizeContainer();

			mediaEl = document.createElement("iframe");
			mediaEl.src = src;
			mediaEl.setAttribute("width", parseInt(this.frame.style.width));
			mediaEl.setAttribute("height", parseInt(this.frame.style.height) - ( title ? 52 : 0 ));
			mediaEl.setAttribute("frameborder", "0");
			mediaEl.setAttribute("allowfullscreen", "allowfullscreen");

			//Add to DOM
			this.container.appendChild(mediaEl);

		}

		//Wait for load
		mediaEl.addEventListener("load", function(){

			setTimeout(function(){
				
				//Set title
				if(title){
					self.title.innerHTML = title;
					self.frame.classList.add("has-title");
				}

				//Show
				self.frame.classList.add("loaded");
				self.loading.hide();
				self.loaded = true;

			}, 550);

		});

	};

	/*
	 * Load media at index
	 */
	WAMediaBox_Gallery.prototype.loadMedia = function(index){

		if(!this.opened) return;
		if(index == this.current) return;

		var self = this;

		if(!this.mediaList[index]) throw new Error("Undefined media");

		var load = function(){

			self.setMedia( self.mediaList[index].type, self.mediaList[index].src, self.mediaList[index].title, self.mediaList[index].width, self.mediaList[index].height );

		};

		if(this.loaded){

			this.frame.classList.remove("loaded");
			this.loading.show();
			setTimeout(load, 350);

		} else {

			load();

		}

		if(index > 0)
			this.frame.classList.add("has-prev");
		else
			this.frame.classList.remove("has-prev");

		if(index < this.mediaList.length - 1)
			this.frame.classList.add("has-next");
		else
			this.frame.classList.remove("has-next");

		this.current = index;

	};

	/*
	 * Switch to previous media
	 */
	WAMediaBox_Gallery.prototype.prev = function(){

		if(!this.opened) return;

		var index = Math.max(0, this.current - 1);
		this.loadMedia(index);

	};

	/*
	 * Switch to next media
	 */
	WAMediaBox_Gallery.prototype.next = function(){

		if(!this.opened) return;

		var index = Math.min(this.mediaList.length - 1, this.current + 1);
		this.loadMedia(index);

	};

	WAMediaBox_Gallery.prototype.openSource = function(){

		if(!this.opened) return;

		window.open( this.mediaList[this.current].src );

	};

	/*
	 * ImageBox constructor
	 */
	var WAMediaBox = function(){

		this.lang = {
			prev: "Previous",
			next: "Next",
			close: "Close",
			openInNew: "Open in new window"
		};

		this.galleries = {};

	};

	WAMediaBox.prototype.openGallery = function(gallery, index){

		if(!this.galleries[gallery]) throw new Error("Gallery not found");

		this.galleries[gallery].open(index);

	};

	/*
	 * Media adders
	 */
	WAMediaBox.prototype.addImage = function(gallery, src, title){

		if(!this.galleries[gallery])
			this.galleries[gallery] = new WAMediaBox_Gallery(this);

		return this.galleries[gallery].addImage(src, title);

	};

	WAMediaBox.prototype.addIframe = function(gallery, src, title, width, height){

		if(!this.galleries[gallery])
			this.galleries[gallery] = new WAMediaBox_Gallery(this);

		return this.galleries[gallery].addIframe(src, title, width, height);

	};

	/*
	 * Bind single elements
	 */
	WAMediaBox.prototype.bind = function(el){

		if(el._waMediaBoxBound) return;

		el._waMediaBoxBound = true;

		var self = this;

		var gallery = el.getAttribute("data-mediabox") || "_";
		var src = String(el.getAttribute("href") || el.getAttribute("data-src"));
		var title = el.getAttribute("data-title");
		var isIframe = ( el.hasAttribute("data-iframe") || src.indexOf("youtube") >= 0 ? true : false );
		var width = ( el.hasAttribute("data-width") ? parseInt(el.getAttribute("data-width")) : null );
		var height = ( el.hasAttribute("data-height") ? parseInt(el.getAttribute("data-height")) : null );

		var index = null;

		//Add to gallery
		if(isIframe)
			index = this.addIframe(gallery, src, title, width, height);
		else
			index = this.addImage(gallery, src, title);
		
		//Bind open event
		el.addEventListener("click", function(ev){

			ev.preventDefault();
			ev.stopPropagation();

			self.openGallery(gallery, index);

			return false;

		});

	};

	/*
	 * Bind all elements in given parent node
	 */
	WAMediaBox.prototype.bindAll = function(parentEl){

		var elements = parentEl.querySelectorAll("a[data-mediabox]");

		for(var i = 0; i < elements.length; i++)
			this.bind(elements.item(i));

	};

	//Assign to window
	window.WAMediaBox = new WAMediaBox();

	//Bind lightbox elements
	window.addEventListener("load", function(){
		
		window.WAMediaBox.bindAll(document.body);

	});

})();