const chalk = require('chalk');

const debugConsole = (value, message = 'DEBUG CONSOLE') => {
  console.log(
    `${chalk.green.bold(message)} ${chalk.yellow.bold(
      '======>>>>>'
    )} ${chalk.red.bold(value)}`
  );
};
module.exports = { debugConsole };
