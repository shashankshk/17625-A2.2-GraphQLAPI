// Schema definitions included
// Doctor, Specialty, Appointment, Calendar, Timeslot
// Query and mutation
var schema = `
    type Doctor {
        id: ID!
        name: String
        specialty: Specialty
        clinic: String
    }

    type Specialty {
        id: ID!
        specialty: String
    }

    type Timeslot {
        id: ID!
        startTime: String
        endTime: String
    }

    type Appointment {
        id: ID!
        doctor: Doctor
        patientName: String
        timeslot: Timeslot
        date: String
        cancelled: Boolean
    }

    type Calendar {
        id: ID!
        date: String
        doctor: Doctor
        bookedTimeslots: [Timeslot]
        availableTimeslots: [Timeslot]
    }

    type Query {
        message: String
        doctor(name: String, id: ID): Doctor
        appointment(doctorId: ID!, appointmentId: ID!): Appointment
        calendar(date: String!, doctorId: ID!): Calendar
    }

    type Mutation {
        bookAppointment(doctorId: ID!, patientName: String!, date: String!,timeslot: ID!): Appointment
        cancelAppointment(appointmentId: ID!, doctorId: ID!): Appointment
        updateAppointment(appointmentId: ID!, doctorId: ID!, patientName: String, timeslotId: ID, date: String): Appointment
    }
`

module.exports = {
    schema
}