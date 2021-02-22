const mongoose = require('mongoose');

const volunteerFormSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    surname: {type: String, required: true},
    birthDate: {type: Date, required: true},
    phoneNumber: {type: String, required: true, minLength: 11, maxLength: 15, match: /^(\+\d{2} )?\d{3}-\d{3}-\d{3}$/},
    // mobile no pattern: +48 123-456-789, or 123-456-789
    occupation: {type: String, required: true},
    preferredTasks: {type: String, required: true, enum: ['working with dogs', 'working with cats', 'shelter promotion']}
});

module.exports = mongoose.model('VolunteerForm', volunteerFormSchema);