var send_sms = require('./send_sms');


watcher = require('./watcher');

cb = function(res) {
    send_sms('update with phone', res.data)
}

filter = {
    includes: [/GET \/some\/path/],
    excludes: [/^123.45.6/, /^234.123.1/]
}

watcher('/Users/ccyphers/home_ext/log_texter/access.log', filter, cb)
