const fs = require("fs");
const path = require("path");
const url = require('url');

const TransactionManager = require("./TransactionManager");

function setSeedKey(workingDir, seedKey, callback) {
    const manager = new TransactionManager(workingDir);
    manager.loadTransaction((err, transaction) => {
        if (err) {
            return callback(err);
        }
        transaction.seedKey = seedKey;
        manager.saveTransaction(transaction, callback);
    });
}

function addFile(workingDir, FileObj, callback) {
    const cmd = {
        name: 'addFile',
        params: {
            dossierPath: FileObj.dossierPath
        }
    };

    const manager = new TransactionManager(workingDir);
    const filePath = path.join(workingDir, path.basename(FileObj.dossierPath));
    fs.access(filePath, (err) => {
        if (!err) {
            const e = new Error('File already exists');
            e.code = 'EEXIST';
            return callback(e);
        }

        const file = fs.createWriteStream(filePath);

        file.on('close', () => {
            manager.addCommand(cmd, callback);
        });

        FileObj.stream.pipe(file);
    });
}

function setEndpoint(workingDir, endpointObj, callback) {
    let endpoint;
    try {
        endpoint = new url.URL(endpointObj).origin;
    } catch (e) {
        return callback(e);
    }
    const manager = new TransactionManager(workingDir);
    manager.loadTransaction((err, transaction) => {
        if (err) {
            return callback(err);
        }
        transaction.endpoint = endpoint;

        manager.saveTransaction(transaction, callback);
    });
}

function mount(workingDir, mountPoint, callback) {
    const cmd = {
        name: 'mount',
        params: {
            path: mountPoint.path,
            seed: mountPoint.seed
        }
    };

    const manager = new TransactionManager(workingDir);
    manager.addCommand(cmd, callback);
}
module.exports = {
    setSeedKey,
    addFile,
    setEndpoint,
    mount
};
