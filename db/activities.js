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
  const { rows: [activities],} = await client.query(getActivitiesSql,);
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
async function attachActivitiesToRoutines(routines) {}


async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
