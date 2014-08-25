(function($) {

	$.widget("ui.searchbox", {
		// default options
		options: {
			// options
		},

		// the constructor
		_create: function() {
			var self = this,
				$el = self.element;

			console.log( "creating searchbox" );

		    self._refresh();
		},
		_refresh: function() {
		    // trigger a callback/event
		    this._trigger("change");
		},
		_destroy: function() {
			// destroy and unbind stuff
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
