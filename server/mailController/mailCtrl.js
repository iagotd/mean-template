var nodemailer = require('nodemailer');
var Hogan = require('hogan.js')
var fs = require('fs')

var verifyTemplate = fs.readFileSync('./views/verifyTemplate.hjs', 'utf-8');
var welcomeTemplate = fs.readFileSync('./views/welcomeTemplate.hjs', 'utf-8');
var resetTemplate = fs.readFileSync('./views/resetTemplate.hjs', 'utf-8');

var compiledVerifyTemplate = Hogan.compile(verifyTemplate);
var compiledWelcomeTemplate = Hogan.compile(welcomeTemplate);
var compiledResetTemplate = Hogan.compile(resetTemplate);

exports.sendEmail = function (email, emailType, url, req, res) {
    
    // Transporter definition
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'email@gmail.com',
            pass: 'allalala'
        }
    });

    // Create Options
    var mailOptions;
    switch(emailType) {
        case "verify": { mailOptions = verifyMailOptions(email, url); break; }
        case "welcome": { mailOptions = welcomeMailOptions(email); break; }
        case "reset":{ mailOptions = resetMailOptions(email, url); break;}
        default: console.log("Wrong emailType for sendEmail function.");
    }

    // Send Email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent to: " + mailOptions.to);
            res.status(200).jsonp(req.body);
        }
    });
};

function verifyMailOptions(email, url) {
    return mailOptions = {
        from: 'MEAN Template Web',
        to: email,
        subject: 'MEAN Template Web - Verify Account.',
        html: compiledVerifyTemplate.render({ email: email, url: url}) //using zurb.inc, templates, css inliner and hogan
    };
}

function welcomeMailOptions(email) {
    return mailOptions = {
        from: 'MEAN Template Web',
        to: email,
        subject: 'MEAN Template Web - Welcome',
        html: compiledWelcomeTemplate.render({ email: email }) //using zurb.inc, templates, css inliner and hogan
    };
}

function resetMailOptions(email, url) {
    return mailOptions = {
        from: 'MEAN Template Web',
        to: email,
        subject: 'MEAN Template Web - Reset Password',
        html: compiledResetTemplate.render({ email: email, url: url}) //using zurb.inc, templates, css inliner and hogan
    };
}