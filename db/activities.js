const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  const routineSql = `INSERT INTO activities (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING RETURNING * ;`;

  const data = [name, description];
  //console.log("CREATE_ACTIVITY_DATA:", data);
  const { rows: [activity] } = await client.query(routineSql, data);

  return activity;
  // return the new activity
}

async function getAllActivities() {
  // select and return an array of all activities
  const getActivitiesSql = `SELECT * FROM activities`;
  const { rows: activities,} = await client.query(getActivitiesSql,);
  return activities
}

async function getActivityById(id) {
   const getActivitiesSql = `SELECT * FROM activities WHERE id = $1`;
   const {
     rows: [activity],
   } = await client.query(getActivitiesSql, [id]);  
   return activity;
}

async function getActivityByName(name) {
  const getActivitiesSql = `SELECT * FROM activities WHERE name = $1`;
  const { rows: [activity], } = await client.query(getActivitiesSql, [name]);
  return activity;
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {
 
  if (!routines?.length) {
    return [];
  }  
  
  const placeHolders = routines.map((_, index) => `$${index + 1}`).join(", ")
  const data = routines.map((routine) => routine.id);
    
  try {
    const activitesSql = `SELECT activities.*, r_a.id AS "routineActivityId", duration, count,  "routineId"
      FROM activities
      LEFT JOIN routine_activities as r_a on r_a."activityId" = activities.id
      WHERE "routineId" IN (${placeHolders});`;
      //console.log(activitesSql)
    const { rows: activities } = await client.query(activitesSql, data );
    
    routines.forEach((routine) => {
      routine.activities = activities.filter((activity) => activity.routineId === routine.id)}); 
    //console.log("ACTIVITIES_1223:", routines);
    return routines;

    } catch (error) {
      console.erro("attachActivitiesToRoutines ERROR:", error);
    }
}

async function updateActivity({ id, ...fields }) {
  const dataArray = Object.values(fields);
  dataArray.push(id);

  const placeHolders = Object.keys(fields)
    .map((key, index) => `"${key}" = $${index + 1}`).join(", ");

  const setSql = `UPDATE activities SET ${placeHolders} WHERE id = $${ dataArray.length } RETURNING *;`;
  const { rows: [activity], } = await client.query(setSql, dataArray);
    
  return activity;
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
