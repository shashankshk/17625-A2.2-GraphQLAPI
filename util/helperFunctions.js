var {GraphQLError} = require('graphql');
const db = require("../data/db");

// Felper function to retrieve specialty based on id
function findSpecialty(specialtyId){
    const specialty = db.specialties.find((specialtyToFind) => specialtyToFind.id == specialtyId);
    return specialty
}

// Felper function to retrieve doctor based on id
function findDoctor(doctorId) {
    const doctor = db.doctors.find((doctorToFind) => doctorToFind.id == doctorId);
    return doctor;
}

// Felper function to retrieve timeslot based on id
function findTimeslot(timeslotId) {
    const timeslot = db.timeslots.find((timeslotToFind) => timeslotToFind.id === timeslotId);
    return timeslot;
}

// Felper function to throw custom graphql error and setting status code
function throwGraphQLError (errorCode, errorType) {
    throw new GraphQLError(errorType.message, {
        extensions: { 
            code: errorCode,
            http: {
                status: errorType.statusCode
            }
        },
    });
}


module.exports = {
    findSpecialty,
    findDoctor,
    findTimeslot,
    throwGraphQLError
}