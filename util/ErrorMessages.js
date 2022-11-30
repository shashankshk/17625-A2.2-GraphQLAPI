const DOCTOR_NOT_FOUND = "DOCTOR_NOT_FOUND";
const INCORRECT_DOCTOR_QUERY = "INCORRECT_DOCTOR_QUERY";

const APPOINTMENT_NOT_FOUND = "APPOINTMENT_NOT_FOUND";
const INCORRECT_APPOINTMENT_QUERY = "INCORRECT_APPOINTMENT_QUERY";

const CALENDAR_NOT_FOUND = "CALENDAR_NOT_FOUND";
const INCORRECT_CALENDAR_QUERY = "INCORRECT_CALENDAR_QUERY";

const APPOINTMENT_NOT_BOOKED = "APPOINTMENT_NOT_BOOKED";
const INCORRECT_APPOINTMENT_MUTATION = "INCORRECT_APPOINTMENT_MUTATION";

const TIMESLOT_ALREADY_BOOKED = "TIMESLOT_ALREADY_BOOKED";
const TIMESLOT_DOES_NOT_EXIST = "TIMESLOT_DOES_NOT_EXIST";

const PATIENT_ALREADY_BOOKED = "PATIENT_ALREADY_BOOKED";
const APPOINTMENT_ALREADY_CANCELLED = "APPOINTMENT_ALREADY_CANCELLED";

const DOCTOR_DOES_NOT_EXIST = "DOCTOR_DOES_NOT_EXIST";
const errorType = {
    DOCTOR_NOT_FOUND: {
        message:  "Doctor detail could not be found",
        statusCode: 404
    },
    INCORRECT_DOCTOR_QUERY: {
        message: "Incorrect name or id for doctor",
        statusCode: 400
    },
    APPOINTMENT_NOT_FOUND: {
        message: "Appointment detail could not be found",
        statusCode: 404
    },
    INCORRECT_APPOINTMENT_QUERY: {
        message: "Incorrect appointment id or doctor id for appointment",
        statusCode: 400
    },
    CALENDAR_NOT_FOUND: {
        message: "Calendar and timeslots detail could not be found",
        statusCode: 404
    },
    INCORRECT_CALENDAR_QUERY: {
        message: "Incorrect arguments passed for booking appointment",
        statusCode: 400
    },
    APPOINTMENT_NOT_BOOKED: {
        message: "Appointment could not be booked",
        statusCode: 409
    },
    INCORRECT_APPOINTMENT_MUTATION: {
        message: "Incorrect arguments passed for booking appointment",
        statusCode: 400
    },
    TIMESLOT_ALREADY_BOOKED: {
        message: "Timeslot already booked. Please select another timeslot.",
        statusCode: 409
    },
    TIMESLOT_DOES_NOT_EXIST: {
        message: "Timeslot does not exist",
        statusCode: 400
    },
    PATIENT_ALREADY_BOOKED: {
        message: "Patient already booked for an appointment.",
        statusCode: 404
    },
    APPOINTMENT_ALREADY_CANCELLED: {
        message: "Appointment already cancelled",
        statusCode: 400
    },
    DOCTOR_DOES_NOT_EXIST: {
        message: "Doctor does not exist",
        statusCode: 404
    }

}
module.exports = {
    DOCTOR_NOT_FOUND,
    INCORRECT_DOCTOR_QUERY,
    APPOINTMENT_NOT_BOOKED,
    INCORRECT_APPOINTMENT_MUTATION,
    APPOINTMENT_NOT_FOUND,
    INCORRECT_APPOINTMENT_QUERY,
    CALENDAR_NOT_FOUND,
    INCORRECT_CALENDAR_QUERY,
    TIMESLOT_ALREADY_BOOKED,
    PATIENT_ALREADY_BOOKED,
    APPOINTMENT_ALREADY_CANCELLED,
    TIMESLOT_DOES_NOT_EXIST,
    DOCTOR_DOES_NOT_EXIST,
    errorType
}