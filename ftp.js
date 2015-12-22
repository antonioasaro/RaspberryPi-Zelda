var JSFtp = require('jsftp');
var fs = require('fs');
console.log('ftp - echo');

var Ftp = new JSFtp({
    host: "ftp.asarotools.com",
    port: 21,
    user: "raspberrypi@asarotools.com",
    pass: "****"
});

var disconnect = function() {
    Ftp.raw.quit(function(err, data) {
    	console.log("quit");
   	});
}

var ls = function() {
   	console.log("Try 'ls' cmd");
    Ftp.ls(".", function(err, res) {
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
    Ftp.put("./zelda.log", "./zelda.log", function(hadError) {
        if (!hadError) {
    	    console.log("File transferred successfully");
		} else {
    	    console.log("File transfer failed: " + hadError);
		}
	    disconnect();
    });
}

fs.watch('./zelda.log', {
	    persistent : true,
	    interval : 15000
    } ,
	function(event, filename) {
  	    console.log('Ftp zelda.log');
	    put();
});
