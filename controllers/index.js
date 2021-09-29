const querystring = require('querystring');
const deviceServices = require("../services/index.js")

const showDevices = async (req, res, next) => {
    try {
        const devicesList = await deviceServices.getDevices()
        res.status(200).send(devicesList);

    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }
}

const showDevice = async (req, res, next) => {
    try {
        const device = await deviceServices.getDevice(req.params.id)
        if (device) {
            res.send(device);
            res.writeHead(200, { 'Content-Type': 'text/html' });
        }
        else {
            res.sendStatus(404);
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }

}

const deleteDevice = async (req, res, next) => {

    try {
        wasDeleted = await deviceServices.setDeleteDevice(req.params.id)
        if (wasDeleted) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end("Device was deleted")
        }
        else {
            res.sendStatus(404);
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }

}


const modifyDevice = (req, res, next) => {

    try {
        wasModified = deviceServices.modifyDevice(req.params.id, req.query)
        if (wasModified) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end("Device was modified")
        }
        else {
            res.sendStatus(404);
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }

}

const createDevice = async (req, res, next) => {
    try {
        const devicesList = await deviceServices.getDevices();
        console.log(devicesList);
        for (const element of devicesList) {
            if (element.id == req.body["id"] || element.serial_number == req.body["serial_number"]) {
                res.sendStatus(409)
            }
        };
        wasCreated = await deviceServices.createDevice(req)

        if (wasCreated) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end("Device was created");
        }
        else {
            res.sendStatus(400)
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(error)
    }

}

module.exports = {
    showDevices,
    createDevice,
    showDevice,
    deleteDevice,
    modifyDevice
}