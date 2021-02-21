const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adoptionFormSchema = new Schema({
    content: {
        type: String,
    }
})

module.exports = mongoose.model('Adoption', adoptionFormSchema);