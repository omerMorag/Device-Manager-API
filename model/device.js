

function Device(device_id, crane_id, serial_number, description) {
    this.id = device_id
    this.crane_id = crane_id
    this.serial_number = serial_number
    this.description = description
    this.deleted = false
}

module.exports = Device;