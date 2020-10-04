const moment = require('moment');
const path = require('path');
const fs = require('fs');
const stream = require('stream');



class ReadableStream extends stream.Readable {
    _read(){
        console.log('---- Reading -----');
        setTimeout(() => {
            this.push(new Date().toISOString());
        }, 1000)
    }
}

class TransformStream extends stream.Transform {
    _transform(chunk, encoding, callback) {
        console.log('----- Transforming -----')
        const data = moment(chunk.toString()).format('YYYY:MMM:DD HH:mm:ss');
        callback(null, `${data} \n`);
    }
}
class WriteableStream extends stream.Writable {
    _write(chunk, encoding, callback){
        console.log('----- Writing -----');
        const data = chunk.toString();
        fs.appendFile(
            path.join(__dirname, 'data', 'datesHistory.txt'),
            data,
            err => {
                if(err){
                    throw err;
                }
            console.log('success');
            })
        callback(null);
    }
}
const rStream = new ReadableStream();
const tStream = new TransformStream();
const wStream = new WriteableStream();


rStream.pipe(tStream);
tStream.pipe(wStream);