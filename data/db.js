// Mock database 
// Doctors data
const doctors = [
    {
        "id": "1001",
        "name": "Dr.X",
        "specialty": "3001",
        "clinic": "New Clinic"
    },
    {
        "id": "1002",
        "name": "Dr.Y",
        "specialty": "3001",
        "clinic": "New Clinic"
    },
    {
        "id": "1003",
        "name": "Dr.A",
        "specialty": "3002",
        "clinic": "Old Clinic"
    },
    {
        "id": "1004",
        "name": "Dr.B",
        "specialty": "3003",
        "clinic": "Old Clinic"
    }
]

// Specialties data
const specialties = [
    {
        "id": "3001",
        "specialty": "Dermatologist"
    },
    {
        "id": "3002",
        "specialty": "Physician"
    },
    {
        "id": "3002",
        "specialty": "Cardiologist"
    }
]

// Timeslots data
const timeslots = [
    {
        "id": "10",
        "startTime": "9:00",
        "endTime": "9:30"
    },
    {
        "id": "11",
        "startTime": "9:30",
        "endTime": "10:00"
    },
    {
        "id": "12",
        "startTime": "10:00",
        "endTime": "10:30"
    },
    {
        "id": "13",
        "startTime": "10:30",
        "endTime": "11:00"
    },
    {
        "id": "14",
        "startTime": "11:00",
        "endTime": "11:30"
    },
    {
        "id": "15",
        "startTime": "11:30",
        "endTime": "12:00"
    },
    {
        "id": "16",
        "startTime": "12:00",
        "endTime": "12:30"
    },
    {
        "id": "17",
        "startTime": "12:30",
        "endTime": "13:00"
    },
    {
        "id": "18",
        "startTime": "13:00",
        "endTime": "13:30"
    },
    {
        "id": 19,
        "startTime": "13:30",
        "endTime": "14:00"
    },
    {
        "id": "20",
        "startTime": "14:00",
        "endTime": "14:30"
    },
    {
        "id": "21",
        "startTime": "14:30",
        "endTime": "15:00"
    },
    {
        "id": "22",
        "startTime": "15:00",
        "endTime": "15:30"
    },
    {
        "id": "23",
        "startTime": "15:30",
        "endTime": "16:00"
    },
    {
        "id": "24",
        "startTime": "16:00",
        "endTime": "16:30"
    },
    {
        "id": "25",
        "startTime": "16:30",
        "endTime": "17:00"
    }
]

// Appointments data
const appointments = [
    {
        "id": "2001",
        "doctor": "1001",
        "patientName": "Mr.CC",
        "date": new Date().toLocaleDateString(),
        "timeslot": "24",
        "cancelled": false
    },
    {
        "id": "2002",
        "doctor": "1001",
        "patientName": "Mr.DD",
        "date": new Date().toLocaleDateString(),
        "timeslot": "22",
        "cancelled": false
    },
    {
        "id": "2003",
        "doctor": "1003",
        "patientName": "Mr.EE",
        "date": new Date().toLocaleDateString(),
        "timeslot": "12",
        "cancelled": false
    },
    {
        "id": "2004",
        "doctor": "1004",
        "patientName": "Mr.FF",
        "date": new Date().toLocaleDateString(),
        "timeslot": "13",
        "cancelled": false
    }
]

// Calendar data
const calendar = [
    {
        id: "4001",
        date: new Date().toLocaleDateString(),
        doctor: "1001",
        bookedTimeslots: ["22","24"],
        availableTimeslots: ["10","11","12","13","14","15","16","17","18","19","20","21","23","25"]
    },
    {
        id: "4002",
        date: new Date().toLocaleDateString(),
        doctor: "1003",
        bookedTimeslots: ["12"],
        availableTimeslots: ["10","11","13","14","15","16","17","18","19","20","21","22","23","24","25"]
    },
    {
        id: "4003",
        date: new Date().toLocaleDateString(),
        doctor: "1004",
        bookedTimeslots: ["13"],
        availableTimeslots: ["10","11","12","14","15","16","17","18","19","20","21","22","23","24","25"]
    }
]

module.exports = {
    doctors,
    specialties,
    timeslots,
    appointments,
    calendar
}