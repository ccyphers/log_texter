var fs = require('fs')
    , path = require('path');

function file_setup(file) {
    fd = fs.openSync(file, 'r');
    offset = fs.statSync(file).size;
    return [fd, offset];
}


fds = {};

module.exports = function(file, cb) {
    fds[path.basename(file)] = {};
    tmp = file_setup(file);
    fds[path.basename(file)].fd = tmp[0];
    fds[path.basename(file)].bufer = null;
    fds[path.basename(file)].offset = tmp[1];

    //{fd:  tmp[0], buffer: null, delta: null, offset: tmp[1] }
    fs.watch(file, function (event, filename) {
        if(event == 'change') {
            stat = fs.statSync(file);
            fds[path.basename(file)].delta = stat.size-fds[path.basename(file)].offset;

            //console.log("offset : " + fds[path.basename(file)].offset + "size: " + stat.size);

            if(fds[path.basename(file)].delta > 0) {
                fds[path.basename(file)]['buffer'] = new Buffer(fds[path.basename(file)].delta);
                fs.readSync(fds[path.basename(file)].fd, fds[path.basename(file)]['buffer'], 0,
                    fds[path.basename(file)]['buffer'].length, fds[path.basename(file)].offset);
                fds[path.basename(file)].offset += fds[path.basename(file)].delta;
                if(cb) {
                    cb({data: fds[path.basename(file)]['buffer'].toString(), file: file});
                } else {
                    console.log("NO CB PROVIDED: ");
                    console.log(fds[path.basename(file)]['buffer'].toString())
                }
            } /*else {
                fs.closeSync(fds[path.basename(file)].fd);
                tmp = file_setup(file);
                fds[path.basename(file)].fd = tmp[0];
                fds[path.basename(file)].offset = tmp[1]
            }*/
        }
    });
}