(function($) {

	$.widget("ui.searchbox", {
		// default options
		options: {
			// misc options
			placeholderText: "Start typing keyword",
			minLength: 1, // must enter at least these many characters to generate results

			// source handling
			source: [], // the source data for the autocomplete
			method: null, // the Meteor method to call that generates the source data
			map: null, // the mapping function that formats a set of returned data
			sort: null, // the sorting function for the data

			// how to render each autocomplete item (gives two params: ul,item)
			renderItem: null,

			// event callbacks (gives two params: event,ui)
			select: null,
			click: null,

			// the aesthetics of the autocomplete menu
			top: 0,
			left: 0,
			width: 300
		},
		// the constructor
		_create: function() {
			var self = this,
				$el = self.element;

			var $input = $("<input type='text' placeholder='"+self.options.placeholderText+"'>");
			
			// apply the searchbox components onto the parent container
			$el.addClass("searchbox")
				.append("<i class='fa fa-search'></i>")
				.append($input)
				.click(function(){
					$(this).find("input").val("");
				});

			// apply the autocomplete widget onto the input component
			$input.autocomplete({
				source: self.options.source,
				minLength: self.options.minLength,
				open: function() {
					var css = { width: self.options.width };
					if (self.options.top) css.top = self.options.top;
					if (self.options.left) css.left = self.options.left;
					$(".ui-autocomplete:visible").css(css);
				},
				select: function(event,ui) {
					if (self.options.select) {
						self.options.select(event,ui);
					}
				}
			});
			// allow a custom render of the autocomplete menu
			if ($input.data("ui-autocomplete") && self.options.renderItem) {
				$input.data("ui-autocomplete")._renderItem = self.options.renderItem;
			}

			// we will now try to dynamically load the autocomplete data
			if (self.options.method) {
				Meteor.call(self.options.method, function(err,data){
					var source = data;
					if (self.options.map) {
						source = $.map(source,self.options.map);
					}
					if (self.options.sort) {
						source = source.sort(self.options.sort);
					}
					// update the source data
					self.options.source = source;
					if ($input.hasClass("ui-autocomplete-input")) {
						$input.autocomplete("option","source",source);
					}
				});
			}

		    self._refresh();
		},
		_refresh: function() {
		    // trigger a callback/event
		    this._trigger("change");
		},
		_destroy: function() {
			var self = this,
				$el = self.element,
				$input = $("input",$el);

			// destroy and unbind stuff
			$el.removeClass("searchbox");
			if ($input.hasClass("ui-aucotomplete")) {
				$input.autocomplete("destroy");
			}
			$el.unbind("click");
			$el.empty();
		},
		_setOption: function(key, value) {
			this._super(key, value);
		},
		_setOptions: function() {
		    // _super and _superApply handle keeping the right this-context
		    this._superApply(arguments);
		    this._refresh();
		}
	});

})(jQuery);
