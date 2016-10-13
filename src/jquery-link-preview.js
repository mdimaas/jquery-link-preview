(function ($) {
	$.fn.linkPreview = function (options) {
		var self = this;
		if (!alreadyLoaded(self, options.url)) {
			this.html(options.ajaxLoader);
			var param = {};
			if (options.urlWrapper) {
				param[options.urlWrapperParam] = String(options.url);
			}
			$.get(options.urlWrapper ? options.urlWrapper : options.url, param,  function (data) {
				if (data) {
					if (typeof options.callback === "function") {
						options.callback(data);
					} else {
						drawPreview(self, options.url, readMeta(data, options.redirectUrl));
					}
				}
			});
		}
	};

	$.defaultOptions = {
		url: "",
		urlWrapper: null,
		urlWrapperParam: "url",
		ajaxLoader: "loading...",
		toRedirectUrl: null,
		toRedirectParam: "away",
		redirectUrl: null
	};

	$.fn.linkDetect = function (options) {
		var opts = initOptions(options, this);
		if (opts.url) {
			var $divWrapper = $("<div/>");
			this.after($divWrapper);
			if (opts.width) {
				$divWrapper.attr("data-image-width", opts.width);
			}
			$divWrapper.linkPreview(opts);
		}
	};

	function initOptions(options, $obj) {
		return $.extend({}, $.defaultOptions, dataAttr($obj), options, {
			url: detectUrl($obj.text()),
			redirectUrl: this.toRedirectUrl ? this.toRedirectUrl + "?" + this.toRedirectParam + "=" + this.url : this.url
		});
	}

	function dataAttr($obj) {
		return {
			url: $obj.attr("data-url"),
			urlWrapper: $obj.attr("data-url-wrapper"),
			urlWrapperParam: $obj.attr("data-url-wrapper-param"),
			ajaxLoader: $obj.attr("data-ajax-loader"),
			toRedirectUrl: $obj.attr("data-to-redirect-url"),
			toRedirectParam: $obj.attr("data-to-redirect-url")
		}
	}

	function detectUrl(str) {
		var urlRegex = /(https?:\/\/[^\s]+)/g;
		return str.match(urlRegex);
	}

	function alreadyLoaded($el, url) {
		var result = false;
		$.each($el.children(), function () {
			var loadedUrl = $(this).attr("data-loaded-link");
			if (loadedUrl && loadedUrl.indexOf(url) > -1) {
				result = true;
			}
		});
		return result;
	}

	function readMeta(html, url) {
		var $html = $("<div/>").append(html);
		var ogTitle = findFirstMetaProperty($html, "title");
		var ogUrl = findFirstMetaProperty($html, "url");
		return {
			title: ogTitle ? ogTitle : $html.find("title").text(),
			description: findFirstMetaProperty($html, "description"),
			pageLink: ogUrl ? ogUrl : url,
			imageLink: findFirstMetaProperty($html, "image")
		};
	}

	function findFirstMetaProperty($html, property) {
		return $($html.find("meta[property$='" + property + "']").get(0)).attr("content");
	}

	function drawPreview($el, url, data) {
		var $mainDiv = $("<div class='link-preview' data-loaded-link='" + url + "'/>");
		$mainDiv.append(image(data, $el.attr("data-image-width")));
		var $descDiv = $("<div class='link-preview-description'/>");
		$descDiv.append("<a href='" + data.pageLink + "' target='_blank'>" + data.title + "</a>").append(description(data));
		$mainDiv.append($descDiv);
		applyWidth($mainDiv, $el.attr("data-image-width"));
		$el.html($mainDiv);
	}

	function image(data, width, height) {
		if (data && data.imageLink) {
			var $img = $("<img src='" + data.imageLink + "' />");
			applyWidth($img, width);
			return $img;
		}
		return null;
	}

	function applyWidth($el, width) {
		if (width) {
			$el.width(width);
		}
	}

	function description(data) {
		return data && data.description ? $("<p>" + (data.description.length > 100 ? (data.description.substring(0, 100) + "...") : data.description) + "</p>") : null;
	}

})(jQuery);