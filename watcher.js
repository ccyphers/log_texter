var fs = require('fs')
    , path = require('path');

function file_setup(file) {
    fd = fs.openSync(file, 'r');
    offset = fs.statSync(file).size;
    return [fd, offset];
}

function allow_filter(text, includes, excludes) {
    if(includes.length === 0 && excludes.length === 0) {
        return true
    }

    var allow_include = false
        , allow_exclude = true;

    for(var x = 0; x < includes.length; x++) {
        if(includes[x].test(text)) {
            allow_include = true
            break;
        }
    }

    for(var x = 0; x < excludes.length; x++) {
        if(excludes[x].test(text)) {
            allow_exclude = false;
            break
        }
    }

    return allow_include && allow_exclude;
}


fds = {};

module.exports = function(file, filter, cb) {
    fds[path.basename(file)] = {};
    tmp = file_setup(file);
    fds[path.basename(file)].fd = tmp[0];
    fds[path.basename(file)].bufer = null;
    fds[path.basename(file)].offset = tmp[1];
    filter = filter || {};
    var data, allowed;

    if(!Array.isArray(filter.includes)) {
        filter.includes = []
    }
    if(!Array.isArray(filter.excludes)) {
        filter.excludes = []
    }

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
                data = fds[path.basename(file)]['buffer'].toString();
                //debugger

                allowed = allow_filter(data, filter.includes, filter.excludes);
                debugger
                if (allowed) {
                    debugger
                    false
                }
                if(allowed) {
                    debugger
                    if (cb) {
                        cb({data: data, file: file});
                    } else {
                        console.log("NO CB PROVIDED: ");
                        console.log(data)
                    }
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