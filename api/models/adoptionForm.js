const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adoptionFormSchema = new Schema({
    content: {
        type: String,
        require: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        require: true
    },
    animalID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Animal',
    }
})

module.exports = mongoose.model('Adoption', adoptionFormSchema);