Template.collectionPage.rendered = function(){
	// initialize the page
	initPage("collection");

	// initialize the collection grid
	if (hasSubscriptions() && this && this.find("#collectionGrid")) {
		window.collectionGrid = new CastGrid({
			wrapper: this.find("#collectionGrid"),
			template: this, 
			dim: {w:154,h:270,pw:10,ph:10},
			dataSource: function() {
				var data = getFullSubscriptions();
				this.update(data);
			},
			render: function(data){
				return getTemplateHTML("gridItem",data);
			}
		});
	}
};
Template.collectionPage.events({
	"mouseover .exportCollectionBtn": addHoverTarget,
	"mouseout .exportCollectionBtn": removeHoverTarget,
	"click .exportCollectionBtn": function(e){
		var subscriptions = getFullSubscriptions();
		var result = exportAsCsv(subscriptions);
		var blob = new Blob([result], {type: 'text/plain'});
		var now = new Date();
		var filename = Meteor.user().profile.name.replace(/ /g,"") + "_" + moment().format("YYYY-MM-DD") + ".csv";

		// save the file
		saveAs(blob,filename);
	},
	"mouseover .redirect-btn": addHoverTarget,
	"mouseout .redirect-btn": removeHoverTarget,
	"click .redirect-btn": function(e){
		Router.go("/discover");
	},
	"mouseover .gridItem": addHoverCurrentTarget,
	"mouseout .gridItem": removeHoverCurrentTarget,
	"click .gridItem": function(e){
		var $el = $(e.currentTarget);
		var annId = parseInt($el.attr("data-annId"),10);
		InfoBar.load(annId);
	},
	"change #importCollectionInput": function(e) {
		// get the contents of this file and then run some diagnostics
		// to present to the user before we actually permit the import
		readSingleFile(e,function(file,contents){
			importCsv(contents);
		});
	}
});
Template.collectionPage.helpers({
	hasSubscriptions: function(){
		return hasSubscriptions();
	}
});
/**
 * Imports a CSV.
 *
 * @method importCsv
 * @param contents {String} The file contents that we are going to interpret as a CSV.
 */
function importCsv(contents) {
	var result = $.csv.toArrays(contents);
	if (!result || result.length === 0) {
		return {error: "Invalid CSV"};
	}
	var ret = [];
	var expectedHeader = [
		"annId",
		"type",
		"title",
		"episodes",
		"progress",
		"rating",
		"linkGenerationRule"
	];
	// validate the header
	if (expectedHeader.join("@") !== result[0].join("@")) {
		return {error: "Invalid header"};
	}
	

	return ret;
}
/**
 * Exports the provided subscriptions as a CSV.
 *
 * @method exportAsCsv
 * @param subscriptions {Array} The array of subscriptions.
 * @return {String} The subscriptions formatted as a CSV.
 */
function exportAsCsv(subscriptions) {
	var fields = [
		"annId",
		"type",
		"title",
		"subscription.episodes",
		"subscription.progress",
		"subscription.rating",
		"subscription.linkGenerationRule"
	];
	var result = "";
	for (var i=0; subscriptions && i<subscriptions.length; i++) {
		var subscription = subscriptions[i];
		var entry = "";
		for (var j=0; j<fields.length; j++) {
			var name = fields[j];
			var split = name.split(".");
			if (split.length === 2) {
				entry = entry + "\""+(subscription.subscription[split[1]] || "") +"\"";
				if (j < fields.length - 1) entry += ",";
			} else {
				entry = entry + "\""+(subscription[name] || "")+"\"";
				if (j < fields.length - 1) entry += ",";
			}
		}
		result = result + entry + "\n";
	}
	var header = "";
	for (var i=0; i<fields.length; i++) {
		var name = fields[i];
		var split = name.split(".");
		if (split.length === 2) {
			header = header + "\""+split[1]+"\"";
		} else {
			header = header + "\""+fields[i]+"\"";
		}
		if (i < fields.length - 1) header += ",";
	}
	result = header+"\n"+result;
		
	return result;
}
/**
 * Exports the provided subscriptions as a XML.
 *
 * @method exportAsXml
 * @param subscriptions {Array} The array of subscriptions.
 * @return {String} The subscriptions formatted as a XML.
 */
function exportAsXml(subscriptions) {
	var fields = [
		"annId",
		"type",
		"title",
		"subscription.episodes",
		"subscription.progress",
		"subscription.rating",
		"subscription.subscriptionDate",
		"subscription.linkGenerationRule"
	];
	var result = "";
	for (var i=0; subscriptions && i<subscriptions.length; i++) {
		var subscription = subscriptions[i];
		var entry = "";
		for (var j=0; j<fields.length; j++) {
			var name = fields[j];
			var split = name.split(".");
			if (split.length === 2) {
				entry = entry + "\t<"+split[1]+">"+(subscription.subscription[split[1]] || "")+"</"+split[1]+">\n";
			} else {
				entry = entry + "\t<"+name+">"+(subscription[name] || "")+"</"+name+">\n";
			}
		}
		result = result + "<subscription>\n" + entry + "</subscription>\n";
	}
	return result;
}
