const http = require("http");
const chalk = require("chalk");
const app = require("./app");

const PORT = process.env["SERVER_PORT"] ?? 3000;
console.log("PORT:", PORT)
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(
    chalk.blueBright("Server is listening on PORT:"),
    chalk.yellow(PORT),
    chalk.blueBright("Get your routine on!")
  );
});
