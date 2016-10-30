var send_sms = require('./send_sms');


watcher = require('./watcher');

cb = function(res) {
    send_sms('update with phone', res.data)
}

watcher('/some/path/to/file', cb)