
const fs = require('fs');

const device = require("../model/device")
const deviceList = []

function getUsedCranes() {

}
const allocateCraneId = async () => {
    try {
        const cranesJson = fs.readFileSync("data/cranes.json")
        const allCranes = JSON.parse(cranesJson)
        if (fs.existsSync("data/devices.json")) {
            const allDevices = fs.readFileSync("data/devices.json") 
            const usedCranes = JSON.parse(allDevices).map(device => { return device.crane_id });
            const availableCranesId =  allCranes.filter(crane => !usedCranes.includes(crane))
            console.log(availableCranesId.length>0)
            if(  availableCranesId.length>0)
                return availableCranesId[0]
            else
                return undefined
     
        }
        else {
            return allCranes[0]
        }

    }
    catch (e) {
        throw new Error(e.message)
    }

}
const createDevice = async (data) => {
    try {
        crane_id = await allocateCraneId()
        console.log(crane_id)
        const { id, description, serial_number } = data.body;
        if (id != undefined && crane_id != undefined && description != undefined && serial_number != undefined && crane_id != undefined) {
            const newDevice = new device(id, crane_id, description, serial_number)
            deviceList.push(newDevice)

            await _saveDevicesToFile();
            return true
        }
        else
            return false
    } catch (e) {
        throw new Error(e.message)
    }
}

const getCranes = async () => {
    try {
        return await deviceList.filter(crane => crane.deleted == false).map(x => {
            return {
                "id": x.id,
                "crane_id": x.crane_id,
                "serial_number": x.serial_number,
                "description": x.description

            }
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

const getDevice = async (device_id) => {
    try {
        return await deviceList.find(element => element.id == device_id)
    } catch (e) {
        throw new Error(e.message)
    }
}

const setDeleteDevice = async (device_id) => {
    try {
        deviceIndex = deviceList.findIndex(element => element.id == device_id)
        if (deviceIndex == -1)
            return false
        else {
            deviceList[deviceIndex]["deleted"] = true
            await _saveDevicesToFile();
            return true
        }

    } catch (e) {
        throw new Error(e.message)
    }
}

const modifyDevice = async (device_id, newProperties) => {
    try {
        deviceIndex = deviceList.findIndex(element => element.id == device_id)
        if (deviceIndex != -1) {
            const { description, serial_number } = newProperties
            if (description != undefined)
                deviceList[deviceIndex]["description"] = description
            if (serial_number != undefined)
                deviceList[deviceIndex]["serial_number"] = serial_number
            await _saveDevicesToFile();
            return true
        }
        else
            return false
    }
    catch (e) {
        throw new Error(e.message)
    }
}

function _saveDevicesToFile() {
    return new Promise((resolve, reject) => {
          fs.writeFile('data/devices.json', JSON.stringify(deviceList, null, 2), (err) => {
            if (err) return reject(err)
            resolve();
        })
    })
}


module.exports = {
    createDevice,
    getCranes,
    getDevice,
    setDeleteDevice,
    modifyDevice
}