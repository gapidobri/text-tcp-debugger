import { createServer } from 'net';
import colors from 'colors';
import { createInterface } from 'readline';
import { log } from 'console';

const port = 6700;
const server = createServer();

const reports = {}

let rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});

const clearLine = () => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
}

const input = () => {
    rl.question('> ', (data) => {
        const [ name, value ] = (data.split(' '));
        const stringValue = ('0000' + value).slice(-4);
        reports[name] = stringValue;
        input();
    });
}

const output = (message) => {
    rl.close();
    clearLine();
    log(message);
    rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    input();
}

server.on('connection', (connection) => {

    output(`New connection from ${colors.blue(connection.remoteAddress.split(':')[3])}`);
    input()

    connection.on('data', (data) => {
        const date = colors.gray(new Date().toISOString().split('T')[1])
        
        const string = data.toString();
        const name = string.slice(0, 4);
        const value = parseInt(string.slice(4), 16);
        
        if (value === 1000) {
            if (!reports[name]) reports[name] = 0;
            connection.write(Buffer.from(name + reports[name] + '\r\n'));
        } else {
            output(`${name}: ${value}`);
        }
        
    });

    connection.on('close', () => {
        output('Disconnected'.red);
        rl.close();
        clearLine();
    });

});

server.listen(port, () => {
    log(`Listening on port ${colors.blue(port)} for incoming connections`);
});