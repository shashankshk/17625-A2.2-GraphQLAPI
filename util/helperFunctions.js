const db = require("../data/db");
function findSpecialty(specialtyId){
    const specialty = db.specialties.find((specialtyToFind) => specialtyToFind.id == specialtyId);
    return specialty
}

function findDoctor(doctorId) {
    const doctor = db.doctors.find((doctorToFind) => doctorToFind.id == doctorId);
    return doctor;
}

function findTimeslot(timeslotId) {
    const timeslot = db.timeslots.find((timeslotToFind) => timeslotToFind.id === timeslotId);
    return timeslot;
}

module.exports = {
    findSpecialty,
    findDoctor,
    findTimeslot
}