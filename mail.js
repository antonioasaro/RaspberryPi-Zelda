var nodemailer = require('nodemailer');
console.log('mail - echo');
var date = new Date();
var lastSent = new Date(date.getTime() - (15 * 60 * 1000));

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    host: "srv69.hosting24.com",
    secureConnection: true,
    port: 587,
    auth: {
        user: 'raspberrypi@asarotools.com',
        pass: '***'
    }
});

// setup e-mail data with unicode symbols
var from = 'raspberrypi@asarotools.com';
var to   = '4165621384@sms.rogers.com';
var subj = 'Project Zelda Poops Alert';
var text = 'default msg';
var mailOptions = { from: from, to: to, subject: subj, text: text };

// send mail with defined transport object
sendMail = function() {
	var delta = Math.round(Math.abs(date - lastSent) / (60 * 1000));
	if (delta > 10) {
		lastSent = date;
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
	}
}
setBody = function(body) {
    mailOptions = { from: from, to: to, subject: subj, text: 'Deposit on ' + body + '\n'};
}
// sendMail();

// Exports
module.exports.setBody  = setBody;
module.exports.sendMail = sendMail;
