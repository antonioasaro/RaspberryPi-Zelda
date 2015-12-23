var JSFtp = require('jsftp');
var fs = require('fs');
console.log('ftp - echo');

var Ftp = new JSFtp({
    host: "ftp.asarotools.com",
    port: 21,
    user: "raspberrypi@asarotools.com",
    pass: "***"
});

var disconnect = function() {
    Ftp.raw.quit(function(err, data) {
    	console.log("Quit ftp session");
   	});
}

var ls = function() {
   	console.log("Calling ftp.ls");
    Ftp.ls(".", function(err, res) {
   	    console.log("Attempting to ftp.ls");
		if (!err) {
        	console.log("'ls' successful");
            res.forEach(function(file) {
        	    console.log(file.name);
	            disconnect();
            });
		}
    });
}

var put = function() {
   	console.log("Attempting to ftp.put");
    Ftp.put("./zelda.log", "./zelda.log", function(hadError) {
        if (!hadError) {
    	    console.log("Ftp sent: zelda.log");
		} else {
    	    console.log("File transfer failed: " + hadError);
		}
	    disconnect();
    });
}

module.exports.put = put;

