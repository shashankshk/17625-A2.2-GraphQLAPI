const db = require("../data/db");
const {GraphQLError} = require('graphql');
const errorCodes = require("../util/ErrorMessages");
const { findSpecialty, findDoctor, findTimeslot } = require("../util/helperFunctions");
const root = {
    doctor: (args) => {
        console.log(args);
        const {name, id} = args;
        if(!name && !id) {
            throw new GraphQLError(errorCodes.INCORRECT_DOCTOR_QUERY, {
                extensions: { status: 400 },
            });
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
            const returnValue = {...doctorDetail, specialty};
            return returnValue;
        }
        throw new GraphQLError(errorCodes.DOCTOR_NOT_FOUND, {
            extensions: { status: 400 },
        });
        
    },

    appointment: (args) => {
        const {appointmentId, doctorId} = args;
        if(!appointmentId || !doctorId) {
            throw new GraphQLError(errorCodes.INCORRECT_APPOINTMENT_QUERY, {
                extensions: { status: 400 },
            });
        } else {
            const appointmentDetail = db.appointments.find(appointment => appointment.appointmentId === appointmentId
                && appointment.doctor === doctorId);
            if(appointmentDetail) {
                const doctorForAppointment = db.doctors.find(doctor => doctor.id === appointmentDetail.doctor);
                const timeslot = findTimeslot(appointmentDetail.timeslot);
                const returnValue = {appointmentDetail, doctor: doctorForAppointment, timeslot}
                return returnValue
            }
            throw new GraphQLError(errorCodes.APPOINTMENT_NOT_FOUND, {
                extensions: { status: 400 },
            });

        }
    },

    calendar: (args) => {
        const {date, doctorId} = args;
        if(!date || !doctorId) {
            throw new GraphQLError(errorCodes.INCORRECT_CALENDAR_QUERY, {
                extensions: { status: 400 },
            });
        } else {
            const calendarDetail = db.calendar.find((calendar => calendar.doctor === doctorId && calendar.date === date));
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
            const returnValue = {...calendarDetail, bookedTimeslots, availableTimeslots, doctor: doctorForAppointment}
            return returnValue;
        }
    },

    bookAppointment: (args) => {
        const {doctorId, patientName, date, timeslot} = args;
        if(!doctorId || !patientName || !date || !timeslot) {
            throw new GraphQLError(errorCodes.INCORRECT_APPOINTMENT_MUTATION, {
                extensions: { status: 400 },
            });
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
                    throw new GraphQLError(errorCodes.PATIENT_ALREADY_BOOKED, {
                        extensions: { status: 400 },
                    });
                }
                throw new GraphQLError(errorCodes.TIMESLOT_ALREADY_BOOKED, {
                    extensions: { status: 400 },
                });
            }
        })
        if(!dataExists) {
            db.appointments.push(objectToAdd);
            const doctorForAppointment = findDoctor(doctorId);
            const timeslotSelected = findTimeslot(timeslot);
            return {...objectToAdd, timeslot: timeslotSelected, doctor: doctorForAppointment};
        } else {
            throw new GraphQLError(errorCodes.APPOINTMENT_NOT_BOOKED, {
                extensions: { status: 400 },
            });
        }
    },

    cancelAppointment: (args) => {
        const {appointmentId, doctorId} = args;
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
                throw new GraphQLError(errorCodes.APPOINTMENT_ALREADY_CANCELLED, {
                    extensions: { status: 400 },
                });
            }
            appointmentToCancel.cancelled = true;
            let calendarToUpdate = db.calendar.find((calendar) => calendar.doctor === doctorId && calendar.date === appointmentToCancel.date);
            calendarToUpdate.bookedTimeslots = calendarToUpdate.bookedTimeslots.filter(slot => slot !== appointmentToCancel.timeslot);
            calendarToUpdate.availableTimeslots.push(appointmentToCancel.timeslot);
            const doctorForAppointment = findDoctor(appointmentToCancel.doctor);
            const timeslotSelected = findTimeslot(appointmentToCancel.timeslot);
            return {...appointmentToCancel, doctor: doctorForAppointment, timeslot: timeslotSelected};
        } else {
            throw new GraphQLError(errorCodes.APPOINTMENT_NOT_FOUND, {
                extensions: { status: 400 },
            });
        }

    },
    updateAppointment: (args) => {
        const {appointmentId, timeslotId, date, doctorId, patientName} = args;
        if(!appointmentId){
            throw new GraphQLError(errorCodes.INCORRECT_APPOINTMENT_QUERY, {
                extensions: { status: 400 },
            });
        }
        const appointmentToUpdate = db.appointments.find((appointment) => appointment.id === appointmentId);
        if(!appointmentToUpdate) {
            throw new GraphQLError(errorCodes.APPOINTMENT_NOT_FOUND, {
                extensions: { status: 400 },
            });
        }
        if(doctorId){
            const doctorToUpdate = findDoctor(doctorId);
            if(!doctorToUpdate){
                throw new GraphQLError(errorCodes.DOCTOR_DOES_NOT_EXIST, {
                    extensions: { status: 400 },
                });
            }
            appointmentToUpdate.doctor = doctorId;
        }
        if(patientName){
            appointmentToUpdate.patientName = patientName;
        }
        if(timeslotId) {
            const timeslotToUpdate = findTimeslot(timeslotId);
            if(!timeslotToUpdate){
                throw new GraphQLError(errorCodes.TIMESLOT_DOES_NOT_EXIST, {
                    extensions: { status: 400 },
                });
            }
            appointmentToUpdate.timeslot = timeslotId;
        }
        if(date){
            appointmentToUpdate.date = date;
        }
        const doctorForAppointment = findDoctor(appointmentToUpdate.doctor);
        const timeslotSelected = findTimeslot(appointmentToUpdate.timeslot);
        return {... appointmentToUpdate, doctor: doctorForAppointment, timeslot: timeslotSelected};
        
    }
    
};

module.exports = {
    root
}
 