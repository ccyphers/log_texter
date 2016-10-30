var config = require('./config')
    ,client = require('twilio')(config.accountSid, config.authToken)
    , Promise = require('bluebird');

module.exports = function(to, message) {
    return new Promise(function (resolve, reject) {
        client.messages.create({
            body: message,
            to: to,
            from: config.sendingNumber

        }, function (err, data) {
            if (err) {
                console.error('Could not notify administrator');
                console.error(err);
                reject(err)
            } else {
                console.log('Administrator notified');
                resolve(data)
            }
        });
    })
};