module.exports = class Log {
    constructor(timestamp = new Date(Date.now())) {
        this.timestamp = timestamp;
        console.log(`-+-+-+-+- ${this.timestamp} | LOG START -+-+-+-+-`);
    };

    debug(message, args = "") {
        return console.debug(`${new Date(Date.now())} | DEBUG | ${message} ${args}`);
    }

    info(message, args = "") {
        return console.info(`${new Date(Date.now())} | INFO | ${message} ${args}`);
    }

    log(message, args = "") {
        return console.log(`${new Date(Date.now())} | LOG | ${message} ${args}`);
    }

    warn(message, args = "") {
        return console.warn(`${new Date(Date.now())} | WARN | ${message} ${args}`);
    }

    error(message, args = "") {
        return console.error(`${new Date(Date.now())} | ERROR | ${message} ${args}`);
    }
};