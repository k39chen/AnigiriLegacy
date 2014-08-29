/**
 * A wrapper class to handle generic cast grid management.
 *
 * @class CastGrid
 * @param settings (A set of mandatory settings to be provided by the caller):
 *     @param wrapper {Object} The DOM object of the wrapper element.
 *     @param template {Object} The target template instance.
 *     @param data {Array} The array of data that we will be using to initialize the grid.
 *     @param dimensions {Object} The object of grid item dimensions.
 *     @param render {Function} The HTML to render for each grid item.
 * @return {Object} Reference to the cast grid object.
 */
window.CastGrid = function(settings) {
	var self = this;
	self.dim = settings.dim;
	self.cast = new cast(settings.wrapper);
	self.cast.draw(settings.render);
	settings.template.handle = Meteor.autorun(function(){ self.update(settings.data); });
	$(window).bind('resize', function(){ self.resize(); });
	return self;
};
/**
 * Updates the items that are in the cast grid.
 *
 * @method update
 * @param data {Array} The array of data that will be in the grid.
 * @return {Object} Reference to the cast grid object.
 */
CastGrid.prototype.update = function(data) {
	var self = this;
	self.cast.setData(data,"_id");
	self.redraw();
	return self;
};
/**
 * Recalculates and redraws the grid based on changed dimensions and data.
 * 
 * @method redraw
 * @return {Object} Reference to the cast grid object.
 */
CastGrid.prototype.redraw = function() {
	this.cast.center(this.dim.w,this.dim.h,this.dim.pw,this.dim.ph);
	return this;
};
/**
 * Changes the dimensions of each grid item and forces a redraw.
 *
 * @method changeDimensions
 * @param dim {Object} The object containing the new dimensions.
 * @return {Object} Reference to the cast grid object.
 */
CastGrid.prototype.changeDimensions = function(dim) {
	var self = this;
	self.dim = dim;
	self.redraw();
	return self;
}
/**
 * Issues a request to get the current wrapper width and forces a redraw.
 *
 * @method resize
 * @return {Object} Reference to the cast grid object.
 */
CastGrid.prototype.resize = function() {
	var self = this;
	var newWidth = self.cast.el.clientWidth;
	if (newWidth == self.cast.wrapperWidth) {
		// then do nothing because we don't have to redraw
	} else {
		self.cast.wrapperWidth = newWidth;
		self.redraw();
	}
	return self;
};
