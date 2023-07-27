const client = require("./client");
const {getRoutineActivitiesByRoutine, 
destroyRoutineActivity} = require("./routine_activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  const routineSql = `INSERT INTO routines ("creatorId", "isPublic", name, goal) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO NOTHING RETURNING * ;`;

  const data = [creatorId, isPublic, name, goal];

  const { rows: routines } = await client.query(routineSql, data);
  return routines[0];
}

async function getRoutineById(id) {
  const getRoutineSql = `SELECT * FROM routines WHERE id = $1`;
  const {
    rows: routine,
  } = await client.query(getRoutineSql, [id]);
  return routine;
  
}

async function getRoutinesWithoutActivities() {}

async function getAllRoutines() {
  //select all routines
  const getRoutineSql = `SELECT * FROM routines`;
  const { rows } = await client.query(getRoutineSql);
  //console.log("ALL_ROUTINES:", rows);
  if(!rows.length) { return null }
  //map over routines AND lookup activites, THEN  add them to routines as [] (routines.activities =  getRoutineActivitiesByRoutine()
  const routines = await Promise.all(
    rows.map(async (routine) => {
    routine.activities = [await getRoutineActivitiesByRoutine(routine.id)];
    //console.log("I'm out", routine);
    })
  )
 //console.log("ALL_ROUTINES:", routines)
  return routines;
}

async function getAllPublicRoutines() {
  const getRoutinesSql = `
  SELECT routines.id , name, goal, username as "creatorName" 
  FROM routines
    LEFT JOIN users ON users.id = routines."creatorId"
	WHERE "isPublic" = true;`;
    const { rows } = await client.query(getRoutinesSql);
    //console.log("ROUTINE_RESULT:", rows)
    const routines = rows;
    return routines;
}

async function getAllRoutinesByUser({ username }) {
  const getRoutinesSql = `
SELECT * FROM routines
LEFT JOIN users ON users.id = routines."creatorId"
WHERE username=$1
;`;
  const { rows } = await client.query(getRoutinesSql, [username]);
 
return rows;

}

async function getPublicRoutinesByUser({ username }) {

}

async function getPublicRoutinesByActivity({ id }) {

}

async function updateRoutine({ id, ...fields }) {
  
}

async function destroyRoutine(id) {  
//DELETE all entries in routine_activites for the routine id
  

//DELETE the routine record.
  try {
    await destroyRoutineActivity(id);
    let deleteSql = `DELETE FROM routines
      WHERE id = $1 RETURNING *;`
    const { rowCount } = await client.query(deleteSql, [id]);
    
    console.log(rowCount > 0 ? console.log(rowCount) : console.log(null) )

    return id;
  } catch (error){
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
