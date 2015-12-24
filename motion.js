var gpio = require('onoff').Gpio;
var mail = require('./mail');
var logs = require('./logs');
var ftp = require('./ftp');
var dateFormat = require('dateformat');
console.log("motion - echo");

var wrptr = 0;
var pirSensor = [];
var MAXDEPTH = 16;
var onDate;
var offDate;
var captureEn = 0;


motion = new gpio(17, 'in', 'both');
for (var i=0; i <MAXDEPTH; i++) {
	pirSensor[i] = "010203040506070000";
}

function exit() {
	console.log("Terminated");
	motion.unexport();
	process.exit();
}

function getDateTime(date) {
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + month + day + hour + min + sec;
}

function getDelta(delta) {
    var temp;
    temp = (delta < 10) ? ("000" + delta) : (delta < 100) ? ("00" + delta) : 
		   (delta < 1000) ? ("0" + delta) : delta;
    return temp;
}

process.on('SIGINT', exit);

var timer = 0;;
function processData() {
	clearTimeout(timer);
	timer = setTimeout(function() {
		console.log("After timeout of 10 mins");
		if (captureEn == 1) {
			captureEn = 0;
			pushData();
		}

	}, 1000*60*10);
}

function pushData() {
	    console.log("Dates: " + onDate + " " + offDate);
		delta = Math.round(Math.abs(offDate - onDate) / 1000);
		log = getDateTime(onDate) + getDelta(delta); 
		pirSensor[wrptr] = log;
		logs.setBody(log);
		logs.writeLog();
		body = dateFormat(onDate, "mmm dd, yyyy HH:MM:ss") + " - " + delta + " secs";
		mail.setBody(body);
		mail.sendMail();
		ftp.sendPut();
		wrptr = (wrptr + 1) % MAXDEPTH;
		console.log(log);
};

motion.watch(function(err, value) {
    var body, date, log;
	if (err) throw err;
    date = new Date();
	if (value==1) {
		console.log("Motion on");
		if (captureEn == 0) {
		    console.log("Motion onDate set " + date);
		    onDate = date;
			captureEn = 1;
		}
	} else {
		console.log("Motion off");
		if (captureEn == 1) {
	        console.log("Motion offDate set " + date);
		    offDate = date
		    processData();
		}
	}
});


module.exports = {
	getMAXDEPTH: function() {
		return MAXDEPTH;
	},
	getPirSensor: function(index) {
		return pirSensor[index];
	}
};
