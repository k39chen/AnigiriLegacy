Meteor.methods({

	sendEmail: function(from,to,subject,html){
		check([from,to,subject,html],[String]);
		this.unblock();
		Email.send({from:from,to:to,subject:subject,html:html});
	}

});