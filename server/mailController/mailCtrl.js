var nodemailer = require('nodemailer');
var Hogan = require('hogan.js')
var fs = require('fs')
var config = require('../config.json');

var verifyTemplate = fs.readFileSync('./views/verifyTemplate.hjs', 'utf-8');
var welcomeTemplate = fs.readFileSync('./views/welcomeTemplate.hjs', 'utf-8');
var resetTemplate = fs.readFileSync('./views/resetTemplate.hjs', 'utf-8');
var deleteTemplate = fs.readFileSync('./views/deleteTemplate.hjs', 'utf-8');

var compiledVerifyTemplate = Hogan.compile(verifyTemplate);
var compiledWelcomeTemplate = Hogan.compile(welcomeTemplate);
var compiledResetTemplate = Hogan.compile(resetTemplate);
var compiledDeleteTemplate = Hogan.compile(deleteTemplate);

exports.sendEmail = function (email, emailType, url, req, res) {
    
    // Transporter definition
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.email.user,
            pass: config.email.pass
        }
    });

    // Create Options
    var mailOptions;
    switch(emailType) {
        case "verify": { mailOptions = verifyMailOptions(email, url); break; }
        case "welcome": { mailOptions = welcomeMailOptions(email); break; }
        case "reset":{ mailOptions = resetMailOptions(email, url); break;}
        case "delete":{ mailOptions = deleteMailOptions(email, url); break;}
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

function deleteMailOptions(email, url) {
    return mailOptions = {
        from: 'MEAN Template Web',
        to: email,
        subject: 'MEAN Template Web - Deleted Password',
        html: compiledDeleteTemplate.render({ email: email}) //using zurb.inc, templates, css inliner and hogan
    };
}