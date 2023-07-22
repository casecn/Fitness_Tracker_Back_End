const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  
  const routineSql = `INSERT INTO routines ("creatorId", "isPublic", name, goal) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO NOTHING RETURNING * ;`;

  const data = [creatorId, isPublic, name, goal];
//console.log("CREATE_ROUTINE_DATA:", data);
  const { rows } = await client.query(routineSql, data);
  
  
  return rows;
}

async function getRoutineById(id) {}

async function getRoutinesWithoutActivities() {}

async function getAllRoutines() {}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {

  
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
