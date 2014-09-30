/**
 * Converts a regular string into a slugified string.
 */
String.prototype.slugify = function(){
  var str = this;
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  var to   = "aaaaaeeeeeiiiiooooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
	str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, "") // remove invalid chars
	.replace(/\s+/g, "-") // collapse whitespace and replace by -
	.replace(/-+/g, "-"); // collapse dashes

  return str;
};
/** 
 * Capitalizes every word in the string.
 */
String.prototype.capitalize = function(){
	var str = this;
	return str.replace(/\w\S*/g, function(txt){
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};
/**
 * An extensive list of month names.
 */
Date.prototype.monthNames = [
	"January", "February", "March",
	"April", "May", "June",
	"July", "August", "September",
	"October", "November", "December"
];
/**
 * Returns the month name for this date.
 */
Date.prototype.getMonthName = function() {
	return this.monthNames[this.getMonth()];
};
/**
 * Returns an abbreviated month name for this date.
 */
Date.prototype.getShortMonthName = function () {
	return this.getMonthName().substr(0,3);
};
/**
 * Encapsulates code that facilitates file saving.
 */
window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
                     window.MozBlobBuilder || window.MSBlobBuilder;
window.saveAs || ( window.saveAs = (window.navigator.msSaveBlob ? function(b,n){ return window.navigator.msSaveBlob(b,n); } : false) || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs || (function(){
	window.URL || (window.URL = window.webkitURL);
	if (!window.URL) return false;
	return function(blob,name){
		var url = URL.createObjectURL(blob);
 
		// Test for download link support
		if ("download" in document.createElement('a')){
			var a = document.createElement('a');
			a.setAttribute('href', url);
			a.setAttribute('download', name);
 
			// Create Click event
			var clickEvent = document.createEvent ("MouseEvent");
			clickEvent.initMouseEvent ("click", true, true, window, 0, 
				event.screenX, event.screenY, event.clientX, event.clientY, 
				event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, 
				0, null);
 
			// dispatch click event to simulate download
			a.dispatchEvent (clickEvent);
		} else {
			// fallover, open resource in new tab.
			window.open(url, '_blank', '');
		}
	};
})());
