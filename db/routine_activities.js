const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try{
  const sql = `INSERT INTO routine_activities 
  ("routineId", "activityId", duration, count) VALUES ($1, $2, $3, $4) RETURNING *;`;
  const data = [routineId, activityId, count, duration];
  const { rows: routine_activity } = await client.query(sql, data);
  //console.log("ROUTINE_ACTIVITY_RESULT", routine_activity[0].routineId);
  
  return routine_activity[0];
  } catch(error){
    console.error(error);
  }
 }

async function getRoutineActivityById(id) {}

async function getRoutineActivitiesByRoutine( id ) {
  const routineId = [id];
  
  const getRoutinesSql = `
  SELECT * FROM routine_activities
  LEFT JOIN activities ON activities.id = routine_activities."activityId"
WHERE "routineId"=$1;`;
  const { rows: routines } = await client.query(getRoutinesSql, routineId);
  if(routines){
  //console.log("ROUTINE_RESULT2:", routines);
  return routines[0];
  } else {
    return null;
  }

}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {
  try {
    let deleteSQL = `DELETE from routine_activities 
      WHERE "routineId" = $1;`;  
    await client.query (deleteSQL, [id]); 
    return id;
  } catch (error) {
    console.error(error);
    return false;
  }
  
}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
