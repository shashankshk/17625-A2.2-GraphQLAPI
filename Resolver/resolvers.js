const db = require("../data/db");
const {GraphQLFormattedError} = require('graphql');
const errorCodes = require("../util/ErrorMessages");
const { findSpecialty, findDoctor, findTimeslot, throwGraphQLError } = require("../util/helperFunctions");

// Query for the DAIPAI
const Query = {
    // Query to retrieve the doctor details based on id.
    doctor: (parent, args) => {
        const {name, id} = args;
        // Throwing custom error if incorrect query
        if(!name && !id) {
            throwGraphQLError(errorCodes.INCORRECT_DOCTOR_QUERY, errorCodes.errorType.INCORRECT_DOCTOR_QUERY)
        }
        let doctorDetail = '';
        if(name && !id){
            doctorDetail = db.doctors.find((doctor) => doctor.name === name);
            
        } else if(id && !name) {
            doctorDetail = db.doctors.find((doctor) => doctor.id === id);
            
        }else if(id && name) {
            doctorDetail = db.doctors.find((doctor) => doctor.id === id && doctor.name === name);
        } 
        if(doctorDetail){
            const specialty = findSpecialty(doctorDetail.specialty)
            // Creating the return object according to schema
            const returnValue = {...doctorDetail, specialty};
            return returnValue;
        }
        // Throwing custom error if data not found
        throwGraphQLError(errorCodes.DOCTOR_NOT_FOUND, errorCodes.errorType.DOCTOR_NOT_FOUND)    
    },

    // Query to retrieve the appointment details based on doctor and appointment id.
    appointment: (parent, args) => {
        const {appointmentId, doctorId} = args;
        // Throwing custome error if incorrect query
        if(!appointmentId || !doctorId) {
            throwGraphQLError(errorCodes.INCORRECT_APPOINTMENT_QUERY, errorCodes.errorType.INCORRECT_APPOINTMENT_QUERY)    
        } else {
            const appointmentDetail = db.appointments.find(appointment => appointment.id === appointmentId
                && appointment.doctor === doctorId);
            if(appointmentDetail) {
                const doctorForAppointment = db.doctors.find(doctor => doctor.id === appointmentDetail.doctor);
                const timeslot = findTimeslot(appointmentDetail.timeslot);
                // Creating the return object according to schema
                const returnValue = {...appointmentDetail, doctor: doctorForAppointment, timeslot}
                return returnValue
            }
            throwGraphQLError(errorCodes.APPOINTMENT_NOT_FOUND, errorCodes.errorType.APPOINTMENT_NOT_FOUND);
        }
    },

    // Query to retrieve the calendar detail for a given doctor for a given date.
    calendar: (parent, args) => {
        const {date, doctorId} = args;
        // Throwing custome error if incorrect query
        if(!date || !doctorId) {
            throwGraphQLError(errorCodes.INCORRECT_CALENDAR_QUERY, errorCodes.errorType.INCORRECT_CALENDAR_QUERY);
        } else {
            const calendarDetail = db.calendar.find((calendar => calendar.doctor === doctorId && calendar.date === date));
            // Throwing custom error if data not found
            if(!calendarDetail) {
                throwGraphQLError(errorCodes.CALENDAR_NOT_FOUND, errorCodes.errorType.CALENDAR_NOT_FOUND);
            }
            let availableTimeslots = [];
            let bookedTimeslots = [];
            db.timeslots.forEach((timeslot) => {
                if(calendarDetail.bookedTimeslots.includes(timeslot.id)){
                    bookedTimeslots.push(timeslot)
                } else {
                    availableTimeslots.push(timeslot);
                }
            })
            const doctorForAppointment = findDoctor(calendarDetail.doctor);
            // Creating the return object according to schema
            const returnValue = {...calendarDetail, bookedTimeslots, availableTimeslots, doctor: doctorForAppointment}
            return returnValue;
        }
    },

   
    
};

// Mutations for DAIPAI
const Mutation = {
    // Mutation to create an appointment
    bookAppointment: (parent, args) => {
        const {doctorId, patientName, date, timeslot} = args;
        // Throwing custome error if incorrect query
        if(!doctorId || !patientName || !date || !timeslot) {
            throwGraphQLError(errorCodes.INCORRECT_APPOINTMENT_MUTATION, errorCodes.errorType.INCORRECT_APPOINTMENT_MUTATION);
        }
        const newId = parseInt(db.appointments[db.appointments.length - 1].id) + 1
        const objectToAdd = {
            id: newId.toString(),
            doctor: doctorId,
            patientName,
            date,
            timeslot
        };
        let dataExists = false;
        db.appointments.forEach(appointment => {
            if(appointment.date === date && appointment.doctor === doctorId && appointment.timeslot === timeslot){
                dataExists = true
                if(appointment.patientName === patientName){
                    // Throwing custom error if appointment already booked
                    throwGraphQLError(errorCodes.PATIENT_ALREADY_BOOKED, errorCodes.errorType.PATIENT_ALREADY_BOOKED);
                }
                // Throwing custom error if timeslot already booked
                throwGraphQLError(errorCodes.TIMESLOT_ALREADY_BOOKED, errorCodes.errorType.TIMESLOT_ALREADY_BOOKED);
            }
        })
        if(!dataExists) {
            db.appointments.push(objectToAdd);
            const doctorForAppointment = findDoctor(doctorId);
            // Throwing custom error if data not found
            if(!doctorForAppointment) throwGraphQLError(errorCodes.DOCTOR_NOT_FOUND, errorCodes.errorType.DOCTOR_NOT_FOUND)
            const timeslotSelected = findTimeslot(timeslot);
            // Throwing custom error if data not found
            if(!timeslotSelected) throwGraphQLError(errorCodes.TIMESLOT_DOES_NOT_EXIST, errorCodes.errorType.TIMESLOT_DOES_NOT_EXIST);
            // Creating the return object according to schema
            return {...objectToAdd, timeslot: timeslotSelected, doctor: doctorForAppointment};
        } else {
            throwGraphQLError(errorCodes.APPOINTMENT_NOT_BOOKED, errorCodes.errorType.APPOINTMENT_NOT_BOOKED);
        }
    },

    // Mutation to cancel an appointment
    cancelAppointment: (parent, args) => {
        const {appointmentId, doctorId} = args;
        // Throwing custome error if incorrect query
        if(!appointmentId || !doctorId){
            throwGraphQLError(errorCodes.INCORRECT_APPOINTMENT_QUERY, errorCodes.errorType.INCORRECT_APPOINTMENT_QUERY);
        }
        let appointmentExists = false;
        let appointmentToCancel = '';
        db.appointments.find((appointment) => {
            if(appointment.id === appointmentId && appointment.doctor == doctorId) {
                appointmentExists = true
                appointmentToCancel = appointment
            }
            
        })
        if(appointmentExists) {
            if(appointmentToCancel.cancelled){
                // Throwing custom error if appointment already cancelled
                throwGraphQLError(errorCodes.APPOINTMENT_ALREADY_CANCELLED, errorCodes.errorType.APPOINTMENT_ALREADY_CANCELLED);
            }
            appointmentToCancel.cancelled = true;
            let calendarToUpdate = db.calendar.find((calendar) => calendar.doctor === doctorId && calendar.date === appointmentToCancel.date);
            calendarToUpdate.bookedTimeslots = calendarToUpdate.bookedTimeslots.filter(slot => slot !== appointmentToCancel.timeslot);
            calendarToUpdate.availableTimeslots.push(appointmentToCancel.timeslot);
            const doctorForAppointment = findDoctor(appointmentToCancel.doctor);
            const timeslotSelected = findTimeslot(appointmentToCancel.timeslot);
            // Creating the return object according to schema
            return {...appointmentToCancel, doctor: doctorForAppointment, timeslot: timeslotSelected};
        } else {
            // Throwing custom error if data not found
            throwGraphQLError(errorCodes.APPOINTMENT_NOT_FOUND, errorCodes.errorType.APPOINTMENT_NOT_FOUND);
        }

    },

    // Mutation to update an appointment detail
    updateAppointment: (parent, args) => {
        const {appointmentId, timeslotId, date, doctorId, patientName} = args;
        // Throwing custome error if incorrect query
        if(!appointmentId){
            throwGraphQLError(errorCodes.INCORRECT_APPOINTMENT_QUERY, errorCodes.errorType.INCORRECT_APPOINTMENT_QUERY);
        }
        const appointmentToUpdate = db.appointments.find((appointment) => appointment.id === appointmentId);
        if(!appointmentToUpdate) {
            // Throwing custom error if data not found
            throwGraphQLError(errorCodes.APPOINTMENT_NOT_FOUND, errorCodes.errorType.APPOINTMENT_NOT_FOUND);
        }
        if(doctorId){
            const doctorToUpdate = findDoctor(doctorId);
            if(!doctorToUpdate){
                // Throwing custom error if data not found
                throwGraphQLError(errorCodes.DOCTOR_DOES_NOT_EXIST, errorCodes.errorType.DOCTOR_DOES_NOT_EXIST);
            }
            appointmentToUpdate.doctor = doctorId;
        }
        if(patientName){
            appointmentToUpdate.patientName = patientName;
        }
        if(timeslotId) {
            const timeslotToUpdate = findTimeslot(timeslotId);
            if(!timeslotToUpdate){
                // Throwing custom error if data not found
                throwGraphQLError(errorCodes.TIMESLOT_DOES_NOT_EXIST, errorCodes.errorType.TIMESLOT_DOES_NOT_EXIST);
            }
            appointmentToUpdate.timeslot = timeslotId;
        }
        if(date){
            appointmentToUpdate.date = date;
        }
        const doctorForAppointment = findDoctor(appointmentToUpdate.doctor);
        const timeslotSelected = findTimeslot(appointmentToUpdate.timeslot);
        // Creating the return object according to schema
        return {... appointmentToUpdate, doctor: doctorForAppointment, timeslot: timeslotSelected};
        
    }
}

const resolvers = {
    Query,
    Mutation
}

module.exports = {
    resolvers
}
 