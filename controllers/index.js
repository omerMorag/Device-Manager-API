
const querystring = require('querystring');
const deviceServices = require("../services/index.js")

const showDevices = async (req, res, next) => {
    try {
        const devicesList = await deviceServices.getNonDeletdDevices()
        res.status(200).send(devicesList);
    }
     catch (e) {
        res.sendStatus(500) 
    }
}

const showDevice =  async (req, res, next) => {
    try {
        const device =  await deviceServices.getDevice(req.params.id)
        if (device) {
            if (!device.deleted) {
                res.send(device);
                res.writeHead(200, { 'Content-Type': 'text/html' });
            }
            else 
                res.sendStatus(404);
        }
        else 
            res.sendStatus(404);
    }
    catch (e) {
        res.sendStatus(500);
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
        res.sendStatus(500) && next(error)
    }
}

const modifyDevice = async (req, res, next) => {
    try {
        wasModified = await deviceServices.modifyDevice(req.params.id, req.query)
        if (wasModified) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end("Device was modified")
        }
        else {
            res.sendStatus(404);
        }
    } catch (e) {
        res.sendStatus(500) && next(error)
    }
}

const createDevice = async (req, res, next) => {
    try {
        let toModify = false
        let toCreate = true
        const devices = await deviceServices.getAllDevices();
        const {id,serialNumber}=req.body
        for (const element of devices) {
            if (element.id == id && element.serial_number == serialNumber) {
                toModify = true
            }
            else if (element.id == id || element.serial_number == serialNumber) {
                toCreate = false
            }
        };
        if (toModify) {
            const { description } = req.body
            wasModified = await deviceServices.modifyDevice([id], { description })
            if (wasModified) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end("Device was modified");
            }
        }
        else if (toCreate) {
            wasCreated = await deviceServices.createDevice(req)
            if (wasCreated) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end("Device was created");
            }
            else {
                res.sendStatus(400)
            }
        }
        else {
            res.sendStatus(409)
        }
    } catch (e) {
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