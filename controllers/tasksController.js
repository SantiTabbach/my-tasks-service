const Task = require("../models/Task");
const asyncHandler = require("express-async-handler");

// @desc Get all tasks
// @route GET /tasks?owner={id}
// @access Private
const getAllTasks = asyncHandler(async (req, res) => {
  const owner = req.query.owner;

  if (!owner) {
    return res.status(400).send("Incorrect owner id value.");
  }

  let tasks;

  try {
    tasks = await Task.find({ owner });

    if (!tasks?.length) {
      return res
        .status(404)
        .json({ message: `No tasks found for owner with id ${owner}` });
    }
    return res.json(tasks);
  } catch (error) {
    return res
      .status(500)
      .send("Error while trying to get tasks: " + error.message);
  }
});

// @desc Get task by ID
// @route GET /tasks/:id
// @access Private
const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const foundedTask = await Task.findById(id).exec();

    if (!foundedTask) {
      return res.status(404).json({ message: `Task with id ${id} not found` });
    }
    return res.json(foundedTask);
  } catch (error) {
    return res
      .status(500)
      .send("Error while trying to get tasks: " + error.message);
  }
});

// @desc Create a Task
// @route POST /tasks
// @access Private
const createNewTask = asyncHandler(async (req, res) => {
  const { owner, title, description } = req.body;

  if (!owner || !title || !description) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const NewTask = await Task.create({
    owner,
    title,
    description,
    completed: false,
  });

  if (NewTask) {
    return res.status(201).json({ message: "New Task created", task: NewTask });
  } else {
    return res.status(400).json({ message: "Invalid Task data received" });
  }
});

// @desc Update a Task
// @route PATCH /tasks/:id
// @access Private
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { owner, title, description, completed } = req.body;

  if (
    !id ||
    !owner ||
    !title ||
    !description ||
    typeof completed !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const FoundedTask = await Task.findById(id).exec();

  if (!FoundedTask) {
    return res.status(400).json({ message: "Task not found" });
  }

  FoundedTask.owner = owner;
  FoundedTask.title = title;
  FoundedTask.description = description;
  FoundedTask.completed = !!completed;

  const updatedTask = await FoundedTask.save();

  res.json({
    message: `Task with id ${updatedTask._id} updated`,
    task: updatedTask,
  });
});

// @desc Delete a Task
// @route DELETE /tasks/:id
// @access Private
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Task ID required" });
  }

  const FoundedTask = await Task.findById(id).exec();

  if (!FoundedTask) {
    return res.status(400).json({ message: "Task not found" });
  }

  const result = await FoundedTask.deleteOne();

  if (result.acknowledged) {
    const reply = `Task '${FoundedTask.title}' with ID ${FoundedTask._id} deleted`;

    res.json(reply);
  }
});

module.exports = {
  getAllTasks,
  getTaskById,
  createNewTask,
  updateTask,
  deleteTask,
};
