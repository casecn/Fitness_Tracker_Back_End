const client = require('./client');
const {getActivityById} = ('./activities');
const { getRoutineById } = ("./routines.js");


async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try{
    // if (routineExists && activityExists) {
      const addA_RSql = `
        INSERT INTO routine_activities ("routineId", "activityId", count, duration) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;`;
      const data = [routineId, activityId, count, duration];
      const { rows: [routineActivity] } = await client.query( addA_RSql, data);
         
      return routineActivity;
    //} else return null;
  } catch(error){
    console.error(error);
  }
 }

async function getRoutineActivityById(id) {
  //id = routine id
  const getRoutineActivitiesSql = `
    SELECT * 
    FROM routine_activities 
    WHERE id = $1`;
  try 
  {const { rows: [routineActivity] } = await client.query(getRoutineActivitiesSql, [id]);
  return routineActivity;
  } catch (error) {
    console.error("Error in 'getRoutineActivityById'", error);
    throw error;
  }
}

async function getRoutineActivitiesByRoutine( { id } ) {
  const routineId = [id];
  
  const getRoutinesSql = `
    SELECT * FROM routine_activities
      LEFT JOIN activities ON activities.id = routine_activities."activityId"
    WHERE "routineId"=$1;`;
  try {
    const { rows: routines } = await client.query(getRoutinesSql, routineId);
    if(routines){
      return routines;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error in 'getRoutineActivitiesByRoutine'", error);
    throw error
  }

}

async function updateRoutineActivity({ id, ...fields }) {
  const dataArray = Object.values(fields);
  dataArray.push(id);

  const placeHolders = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(', ');
  
  const updateSQL = `
  UPDATE routine_activities
  SET ${placeHolders}
  WHERE id = $${dataArray.length}
  RETURNING *`;
  try {
  const { rows: [routineActivity] } = await client.query(updateSQL, dataArray);

  return routineActivity;
  } catch (error) {
    console.error("Error in 'updateRoutineActivity'", error);
    throw error
  }
}

async function destroyRoutineActivity(id) {
  
  try {
    let deleteSQL = `DELETE from routine_activities 
      WHERE "routineId" = $1
      RETURNING *;`;  
    const {rows: [r_aDestroy] } = await client.query (deleteSQL, [id]); 
    
    return r_aDestroy;
  } catch (error) {
    console.error("Error Deleting routine_activities record", error);
    return false;
  }
  
}

async function canEditRoutineActivity(routineActivityId, userId) {
  if (!routineActivityId) {
    console.error("Missing 'routineActivityId'");
    return result;
  }
  
  let result = false
  const data = [routineActivityId, userId];
  const canEditSql = `
    SELECT * FROM routine_activities
      LEFT JOIN routines ON routines.id = routine_activities."routineId"
    WHERE "creatorId"=$1
      AND routine_activities.id = $2;`;

  try {
    const finalResult = await client.query(canEditSql , data);
    if (finalResult.rowCount > 0) {
      result = true;
    } 
    return result;
  } catch(error) {
  console.error("Error in 'canEditRoutineActivity'", error);
  throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
