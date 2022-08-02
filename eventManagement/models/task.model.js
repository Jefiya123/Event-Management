const mongoose = require('mongoose');
const createHttpError = require('http-errors');

const TaskSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
  },
  subcoordinator: {
    type: String,
  },
  isDone:{
    type:Boolean,
  }
});
const Task = mongoose.model('task', TaskSchema);
module.exports = Task;