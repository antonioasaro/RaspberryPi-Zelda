var JSFtp = require('jsftp');
console.log('ftp - echo');

var Ftp = new JSFtp({
    host: "ftp.asarotools.com",
    port: 21,
    user: "raspberrypi@asarotools.com",
    pass: "***"
});

Ftp.ls(".", function(err, res) {
    res.forEach(function(file) {
	    console.log(file.name);
    });
	Ftp.raw.quit(function(err, data) {
		console.log("Bye!");
	});
});
