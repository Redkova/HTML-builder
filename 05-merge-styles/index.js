const fs = require('fs');
const path = require('path');

const pathToStyles = path.join(__dirname, 'styles');
const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToBundle = path.join(pathToProjectDist, 'bundle.css');
const arrayOfStyles = [];
let filesToProcess = 0;

fs.readdir(pathToStyles, { withFileTypes: true }, (error, files) => {
  if (error) {
    throw error;
  }
  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      filesToProcess++;

      const pathToFile = path.join(pathToStyles, file.name);
      fs.readFile(pathToFile, 'utf-8', (error, data) => {
        if (error) {
          throw error;
        }
        arrayOfStyles.push(data);
        filesToProcess--;

        if (filesToProcess === 0) {
          fs.writeFile(pathToBundle, arrayOfStyles.join('\n'), (error) => {
            if (error) {
              throw error;
            }
          });
        }
      });
    }
  });
  if (filesToProcess === 0) {
    fs.writeFile(pathToBundle, arrayOfStyles.join('\n'), (error) => {
      if (error) {
        throw error;
      }
    });
  }
});
