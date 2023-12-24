const chalk = require('chalk');

const debugConsole = (value, message = 'DEBUG CONSOLE') => {
  console.log(
    `${chalk.green.bold(message)} ${chalk.yellow.bold(
      '======>>>>>'
    )} ${chalk.red.bold(value)}`
  );
};
debugConsole(2342352345234);
module.exports = { debugConsole };
