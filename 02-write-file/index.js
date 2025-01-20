const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'text.txt');

const { stdin, stdout } = process;

fs.writeFile(pathToFile, '', (error) => {
  if (error) {
    throw error;
  }
});

stdout.write('File has been created! Please, enter your text:\n');

stdin.on('data', (data) => {
  const input = data.toString().trim();

  if (input.toLowerCase() === 'exit') {
    stdout.write('Goodbye!');
    process.exit();
  } else {
    fs.appendFile(pathToFile, input + '\n', (error) => {
      if (error) {
        throw error;
      }
    });
  }
});

process.on('SIGINT', () => {
  stdout.write('\nGoodbye!');
  process.exit();
});
