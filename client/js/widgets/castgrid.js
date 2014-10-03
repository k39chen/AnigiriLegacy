/**
 * A wrapper class to handle generic cast grid management.
 *
 * @class CastGrid
 * @param settings (A set of mandatory settings to be provided by the caller):
 *     @param wrapper {Object} The DOM object of the wrapper element.
 *     @param template {Object} The target template instance.
 *     @param dataSource {Function} Sequence of instructions on how to obtain the data source.
 *     @param dimensions {Object} The object of grid item dimensions.
 *     @param render {Function} The HTML to render for each grid item.
 *     @param drawType {String|OPTIONAL} One of center|justify|dynamic
 * @return {Object} Reference to the cast grid object.
 */
window.CastGrid = function(settings) {
	var self = this;
	if (!settings.dataSource) return null;
	self.dim = settings.dim;
	self.drawType = settings.drawType || "center";
	self.cast = new cast(settings.wrapper);
	self.cast.draw(settings.render);
	settings.template.handle = Meteor.autorun($.proxy(settings.dataSource,self));
	self.resize();
	$(window).bind('resize', function(){ self.resize(); });
	return self;
};
/**
 * Resize all existing Cast grids.
 *
 * @method resizeGrids
 */
window.resizeGrids = function(e) {
	if (window.collectionGrid) collectionGrid.resize();
	if (window.profileGrid) profileGrid.resize();
	if (window.friendsGrid) friendsGrid.resize();
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
	var self = this;
	self.cast.sortBy("title")[self.drawType](self.dim.w,self.dim.h,self.dim.pw,self.dim.ph);
	return self;
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
