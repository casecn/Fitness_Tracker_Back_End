const client = require("./client");
const {
  destroyRoutineActivity,
} = require("./routine_activities");
const { attachActivitiesToRoutines } = require("./activities");

//DONE - PASSING TEST
async function createRoutine({ creatorId, isPublic, name, goal }) {
  const routineSql = `INSERT INTO routines ("creatorId", "isPublic", name, goal) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO NOTHING RETURNING * ;`;

  const data = [creatorId, isPublic, name, goal];

  const {
    rows: [routines],
  } = await client.query(routineSql, data);
  return routines;
}

async function getRoutineById(id) {
  try {
    const getRoutineSql = `SELECT * FROM routines WHERE id = $1`;
    const {
      rows: [routine],
    } = await client.query(getRoutineSql, [id]);
    return routine;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  const getRoutineSql = `SELECT routines.* from routines
LEFT JOIN routine_activities as r_a ON r_a."routineId" = routines.id
WHERE r_a IS NULL;`;
  const { rows } = await client.query(getRoutineSql);
  return rows;
}

async function getAllRoutines() {
  try {
    const routineSql = `
      SELECT routines.*, users.username AS "creatorName" 
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      `;
    const { rows: routines } = await client.query(routineSql);
    return await attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const getRoutinesSql = `
    SELECT routines.*, username as "creatorName" 
    FROM routines
      LEFT JOIN users ON users.id = routines."creatorId"
	  WHERE "isPublic" = true;`;
    const { rows: routines } = await client.query(getRoutinesSql);

    const result = await attachActivitiesToRoutines(routines);
    //console.log("ROUTINE_RESULT:", result);
    return result;
  } catch (error) {
    console.error("getAllPublicRoutines ERROR", error);
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  const getRoutinesSql = `
  SELECT routines.*, username AS "creatorName" 
  FROM routines
    LEFT JOIN users ON users.id = routines."creatorId"
  WHERE username=$1
  ;`;
  const { rows: routines } = await client.query(getRoutinesSql, [username]);

  const result = await attachActivitiesToRoutines(routines);
  //console.log("ROUTINE_RESULT:", result);
  return result;
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const getRoutinesSql = `
    SELECT routines.*, username as "creatorName" 
    FROM routines
      LEFT JOIN users ON users.id = routines."creatorId"
	  WHERE "isPublic" = true
    and username=$1;`;
    const { rows: routines } = await client.query(getRoutinesSql, [username]);

    const result = await attachActivitiesToRoutines(routines);
    //console.log("ROUTINE_RESULT:", result);
    return result;
  } catch (error) {
    console.error("getAllPublicRoutines ERROR", error);
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const getRoutinesSql = `
      SELECT "routines".id, "creatorId", "isPublic", "routines"."name", goal, username as "creatorName" 
	      FROM "routines"
		      LEFT JOIN routine_activities AS ra ON ra."routineId" = "routines".id
		      LEFT JOIN activities ON activities.id = ra."activityId"
		      LEFT JOIN users ON users.id = "routines"."creatorId"
      WHERE activities.id = $1
	      AND "isPublic"='true';`;
    const { rows: routines } = await client.query(getRoutinesSql, [id]);
    
    const result = await attachActivitiesToRoutines(routines);
    return result;
  } catch (error) {
    console.error("getAllPublicRoutines ERROR", error);
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  const dataArray = Object.values(fields);
  dataArray.push(id);
  const placeHolders = Object.keys(fields)
    .map((key, index) => `"${key}" = $${index + 1}`)
    .join(", ");

  const updateSql = `UPDATE routines SET ${placeHolders} WHERE id = $${dataArray.length} RETURNING *;`;
  const {
    rows: [routines],
  } = await client.query(updateSql, dataArray);

  return routines;
}

async function destroyRoutine(id) {
  //DELETE all entries in routine_activites for the routine id
  //DELETE the routine record.
  try {
    await destroyRoutineActivity(id);
    let deleteSql = `DELETE FROM routines
      WHERE id = $1 RETURNING *;`;
    await client.query(deleteSql, [id]);
    return id;
  } catch (error) {
    console.error(error);
    return false;
  }
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
