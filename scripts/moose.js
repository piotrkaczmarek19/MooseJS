// Boiler plate based off http://code.tutsplus.com/tutorials/build-your-first-javascript-library--net-26796

window.moose = (function(){

	// iterate over the elements selected and stick them into object
	function Moose (els) {
		for(var i = 0; i < els.length; i++) {
			this[i] = els[i];
		}
		this.length = els.length;
	}

	// Mapping everything stored in the object
	Moose.prototype.map = function(callback) {
		var results = [], i=0;
		for (; i<this.length; i++) {
			results.push(callback.call(this,this[i], i));
		}
		return results;
	}

	Moose.prototype.forEach = function(callback) {
		this.map(callback);
		return this;
	}

	Moose.prototype.mapOne = function (callback) {
		var m = this.map(callback);
		return m.length > 1 ? m : m[0]
	}

	/** // replace innerText/innerHTML of el by text/HTML or return innerText
	Moose.prototype.text = function (text) {
		if (typeof text !== "undefined") {
			return this.forEach(function (el){
				el.innerText = text;
			});
		} else {
			return this.mapOne(function(el){
				return el.innerText;
			});
		}
	};
	Moose.prototype.html = function(html) {
		if(typeof html !== "undefined") {
			this.forEach(function(el){
				el.innerHTML = html
			})
			return this;
		} else {
			return el.innerHTML
		}
	}

	// Set or return attr value of els or el
	Moose.prototype.attr = function(attr, val) {
		if (typeof val !== "undefined") {
			return this.forEach(function(el) {
				el.setAttribute(attr,val);
			});
		} else {
			return this.mapOne(function(el) {
				return el.getAttribute(attr);
			});
		}
	};

	// Add/Remove classes on DOM els
	Moose.prototype.addClass = function(classes) {
		// Store input classes in array
		var className = "";
		if(typeof classes !== "string") {
			for (var i=0; i<classes.length;i++) {
				className += " " + classes[i];
			} 
		} else {
			className = " " + classes;
		}
		// sticking classes in array to els
		return this.forEach(function(el) {
			el.className += className;
		});
	};

	Moose.prototype.removeClass = function(clazz) {
		return this.forEach(function(el){
			var cs = el.className.split(" "), i;

			while ( (i = cs.indexOf(clazz)) > -1) {
				// Cut out the portion if the array that contains clazz (located between indices i-1 and i+1)
				cs = cs.slice(0,i).concat(cs.slice(i++));
			}
			el.className = cs.join(" ");
		})
	}

	// IE8 fix for indexOf property
	if (typeof Array.prototype.indexOf !== "function") {
	    Array.prototype.indexOf = function (item) {
	        for(var i = 0; i < this.length; i++) {
	            if (this[i] === item) {
	                return i;
	            }
	        }
	        return -1;
	    };
	}

	// append and prepend functions
	Moose.prototype.append = function(els) {
		return this.forEach(function(parEl, i) {
			els.forEach(function(childEl) {
				// clone subsequent childNodes if more than 1 el selected
				if(i>0) {
					childEl = childEl.cloneNode(true);
				}
				parEl.appendChild(childEl);
			});
		});
	};
	Moose.prototype.prepend = function(els) {
		return this.forEach(function (parEl, i) {
			for (var j = els.length - 1; j > -1; j--) {
				childEl = (i>0) ? els[j].cloneNode(true) : els[j];
				parEl.insertBefore(childEl, parEl.firstChild);
			}
		});
	};

	// remove node
	Moose.prototype.remove = function() {
		return this.forEach(function(el){
			return el.parentNode.removeChild(el);
		});
	};***/

	// Populate template
	Moose.prototype.populate = function(template, dataFile, field){
		var parameters = {field:field, template:template};
		parameters["self"] = this;

		getAjax(dataFile, parameters, retrieveContext)
		
	}
	// Clear template 
	Moose.prototype.clearTemplate = function()
	{
		this[0].innerHTML = "";
	}

	function getAjax(dataFile, parameters,  callback ){
		var xmlhttp = new XMLHttpRequest(),
			storage,
			source,
			html;
		xmlhttp.onreadystatechange = function() {
			if(xmlhttp.readyState == XMLHttpRequest.DONE) {
				if(xmlhttp.status == 200) {
					try {
						var response = JSON.parse(xmlhttp.responseText)
					} catch (error) {
						var response = xmlhttp.responseText;
					}
					
					callback(response, parameters)
				} else {
				}
			}
		}

		xmlhttp.open("GET", dataFile);
		xmlhttp.send();

	}
	function retrieveContext(data, parameters){
		var field = parameters.field;
		parameters["context"] = typeof field !== "undefined" ? data[field] : data;
		
		getAjax(parameters["template"], parameters, setTemplate)
	}
	function setTemplate(data, parameters){
		parameters["html"] = data;
		var template = Handlebars.compile(parameters["html"]),
			HTML = template(parameters.context),
			i = 0;
		for(;i<parameters["self"].length; i++){
			el = parameters["self"][i];
			el.innerHTML = HTML;
		}
	}

	// Translate els
	Moose.prototype.translate = function(X,Y,secs) {
		return this.forEach(function(el){
			browser = detectBrowser();
			switch(browser) {
				case "firefox":
					el.style.MozTransform = "translate("+X+"px,"+Y+"px) rotate(0.01deg)";
					break
				case "chrome":
					el.style.webkitTransform = "translate("+X+"px,"+Y+"px)";
					break
				case "opera":
					el.style.OTransform = "translate("+X+"px,"+Y+"px)";
					break
				case "safari":
					el.style.msTransform = "translate("+X+"px,"+Y+"px)";
					break
				default:
					el.style.transform = "translate("+X+"px,"+Y+"px)";
			}
			el.style.transition = "transform "+secs+"s ease"

		});
	}
	// Revert els to original pos
	Moose.prototype.revertTranslate = function(secs) {
		return this.forEach(function(el){
			browser = detectBrowser();
			switch(browser) {
				case "firefox":
					el.style.MozTransform = "translate(0,0) rotate(0.01deg)";
					break
				case "chrome":
					el.style.webkitTransform = "translate(0,0)";
					break
				case "opera":
					el.style.OTransform = "translate(0,0)";
					break
				case "safari":
					el.style.msTransform = "translate(0,0)";
					break
				default:
					el.style.transform = "translate(0,0)";
			}
			el.style.transition = "transform "+secs+"s ease"

		});
	}

	// Rotate els 
	Moose.prototype.rotate = function(deg, secs) {
		return this.forEach(function(el){
			browser = detectBrowser();
			switch(browser) {
				case "firefox":
					el.style.MozTransform = "rotate("+deg+"deg)";
					break
				case "chrome":
					el.style.webkitTransform = "rotate("+deg+"deg)";
					break
				case "opera":
					el.style.OTransform = "rotate("+deg+"deg)";
					break
				case "safari":
					el.style.msTransform = "rotate("+deg+"deg)";
					break
				default:
					el.style.transform = "rotate("+deg+"deg)";
			}
			el.style.transition = "transform "+secs+"s ease"

		});
	}

	// Move one  node to another by taking both elements selectors as parameters
	Moose.prototype.moveToNode = function(selector, secs){
		return this.forEach(function(el){
			toEl = moose.get(selector);

			// In case of multiple els selected, takes only first into account
			var destCoordinates = toEl[0].getBoundingClientRect(),
				destX = destCoordinates.x,
				destY = destCoordinates.y,
				initCoordinates = el.getBoundingClientRect(),
				initX = initCoordinates.x,
				initY = initCoordinates.y;

			// Computing movement
			var movementX = destX - initX,
				movementY = destY - initY;
			this.translate(movementX, movementY, secs);

		})
	}

	// Animations

	function detectBrowser() {
		// Code taken from http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
		// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
		isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
		// Firefox 1.0+
		isFirefox = typeof InstallTrigger !== 'undefined';
		// At least Safari 3+: "[object HTMLElementConstructor]"
		isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
		// Internet Explorer 6-11
		isIE = /*@cc_on!@*/false || !!document.documentMode;
		// Edge 20+
		isEdge = !isIE && !!window.StyleMedia;
		// Chrome 1+
		isChrome = !!window.chrome && !!window.chrome.webstore;

		var browser = true;

		switch(browser){
			case isOpera === browser:
				b = "opera";
				break
			case isFirefox === browser:
				b = "firefox";
				break
			case isSafari === browser:
				b = "safari";
				break
			case isIE === browser:
				b = "IE";
				break
			case isEdge === browser:
				b = "edge";
				break
			case isChrome === browser:
				b = "chrome";
				break
			default:
				b =0;
		}
		return b
	}
	// Events
	Moose.prototype.on = (function(){
		if(document.addEventListener) {
			return function (evt, fn) {
				return this.forEach(function(el) {
					el.addEventListener(evt, fn, false);
				});
			};
		// <IE11
		} else if (document.attachEvent) {
			return function(evt,fn) {
				return this.forEach(function(el) {
					el.attachEvent("on" + evt, fn);
				});
			};
		} else {
			return function(evt, fn) {
				return this.forEach(function(el) {
					el["on" + evt] = fn;
				})
			}
		}
	}());

	Moose.prototype.off = (function(){
		if(document.removeEventListener) {
			return function(evt, fn) {
				return this.forEach(function(el) {
					el.removeEventListener(evt, fn, false);
				});
			};
		// <IE11
		} else if (document.detachEvent) {
			return function(evt, fn) {
				return this.forEach(function(el) {
					el.detachEvent("on" + evt, fn);
				});
			}
		} else {
			return function (evt, fn) {
				return this.forEach(function(el) {
					el["on" + evt] = null;
				});
			};
		}
	}());

	// Determine type of selector input and store it in relevant data structure
	var moose = {
		get: function(selector){
			var els;
			if (typeof selector === "string") {
				els = document.querySelectorAll(selector);
			} else if (selector.length) {
				els = selector;
			} else {
				els = [selector];
			}
			return new Moose(els);
		}
		/**create : function(tagName, attrs){
			var el = new Moose([document.createElement(tagName)]);
			
			if (attrs) {
				if (attrs.className) {
					el.addClass(attrs.className);
					delete attrs.className;
				}
				// if attr is text, set text
				if (attrs.text) {
					el.text(attrs.text);
					delete attrs.text;
				}
				for (var key in attrs) {
					if (attrs.hasOwnProperty(key)) {
						el.attr(key, attrs[key]);
					}
				}
			}
			return el;
		}***/
	};

	return moose;
}());


//moose.get('.translate').moveToNode('.rotate', 2)
moose.get('.chgeContent-button').on('click', function (event)
{
	moose.get('.content').populate('test.hbs', 'test.json', event.target.id);
})
var $translate_div = moose.get('.translate');
$translate_div.on('click', function(){
	$translate_div.translate(50, 100, 2);
})
moose.get('.rotate').on('click', function(){
	moose.get('.rotate').rotate(45,1)

})