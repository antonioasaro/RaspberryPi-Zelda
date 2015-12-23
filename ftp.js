var JSFtp = require('jsftp');
var fs = require('fs');
console.log('ftp - echo');
var Ftp;

function initFtp() {
    Ftp = new JSFtp({
        host: "ftp.asarotools.com",
        port: 21,
        user: "raspberrypi@asarotools.com",
        pass: "****",
    	debugMode: true
    });
//    Ftp.on('jsftp_debug', function(eventType, data) {
//        console.log('DEBUG: ', eventType);
//        console.log(JSON.stringify(data, null, 2));
//    });
}

var disconnect = function() {
    Ftp.raw.quit(function(err, data) {
    	console.log("Quit ftp session");
   	});
}

var sendLs = function() {
   	console.log("Calling ftp.sendLs");
    Ftp.ls(".", function(err, res) {
   	    console.log("Attempting to ftp.sendLs");
		if (!err) {
        	console.log("'ls' successful");
            res.forEach(function(file) {
        	    console.log(file.name);
	            disconnect();
            });
		}
    });
}

var sendPut = function() {
   	console.log("Attempting to ftp.sendPut");
	initFtp();
    Ftp.put("./zelda.log", "./zelda.log", function(hadError) {
        if (!hadError) {
    	    console.log("Ftp sent: zelda.log");
		} else {
    	    console.log("File transfer failed: " + hadError);
		}
	    disconnect();
    });
}

module.exports.sendPut = sendPut;
// sendPut();
