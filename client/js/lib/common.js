/**
 * Converts a regular string into a slugified string.
 */
String.prototype.slugify = function(){
	var str = this;
	str = str.replace(/^\s+|\s+$/g, ""); // trim
	str = str.toLowerCase();

	// remove accents, swap ñ for n, etc
	var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
	var to= "aaaaaeeeeeiiiiooooouuuunc------";
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
 * Reads the contents of a file and passes the result through the supplied callback.
 */
window.readSingleFile = function(evt,cb) {
	//Retrieve the first (and only!) File from the FileList object
	var f = evt.target.files[0]; 

	if (f) {
		var r = new FileReader();
		r.onload = function(e) { 
			var contents = e.target.result;
			console.log(contents);
			if (cb) cb(r,contents);
		}
		r.readAsText(f);
	} else { 
		alert("Failed to load file");
	}
}
