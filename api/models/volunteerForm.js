const mongoose = require('mongoose');

const volunteerFormSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    surname: {type: String, required: true},
    birthDate: {type: Date, required: true},
    phoneNumber: {type: Number, required: true},
    occupation: {type: String, required: true},
    preferredTasks: {type: String, required: true, enum: ['working with dogs', 'working with cats', 'shelter promotion']}
});

module.exports = mongoose.model('VolunteerForm', volunteerFormSchema);