const client = require("./client");
const bycrypt = require('bcrypt');


// database functions

// user functions
async function createUser({ username, password }) {
  
  const SALT_COUNT = 10;
  const hashedPasssword = await bycrypt.hash(password, SALT_COUNT);
  const userSql = `INSERT INTO users (username, password) VALUES ($1, $2)
  ON CONFLICT (username) DO NOTHING RETURNING * ;`;
  const data = [username, hashedPasssword];
  const { rows: user } = await client.query(userSql, data );
  delete user[0].password
  
  return user[0];
}  
//###### - - getUser - - ######
async function getUser({ username, password }) {
  const getUserSql = `
    SELECT * 
    FROM users
    WHERE username=$1;`;
  const { rows: [user], } = await client.query(getUserSql, [username]);
  console.log({user});
  const hashedPassword = user.password;
  const passwordsMatch = await bycrypt.compare(password, hashedPassword);
  if (passwordsMatch){
    delete user.password;
    return user;
  } else {
    console.error(`Password does not match: ${username}`)
    return null;
  }
  } catch (error) {
    console.error("getUser Error", error)
  }
  
}
//###### - - getUserById - - ######
async function getUserById(userId) {
  const sql =  `SELECT * FROM users WHERE id = $1;`;
  const {rows: user } = await client.query(sql, [userId]);
  delete user[0].password;
  return user[0];
}

async function getUserByUsername(userName) {
  const getUserSql = `
    SELECT * 
    FROM users
    WHERE username=$1;`;
  const { rows: [user]} = await client.query(getUserSql, [userName]);
  return user;
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
