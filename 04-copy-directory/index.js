const fs = require('fs');
const path = require('path');

const pathToFiles = path.join(__dirname, 'files');
const pathToFilesCopy = path.join(__dirname, 'files-copy');

function copyDir(from, to) {
  fs.rm(to, { recursive: true, force: true }, (error) => {
    if (error) {
      throw error;
    }

    fs.mkdir(to, { recursive: true }, (error) => {
      if (error) {
        throw error;
      }

      fs.readdir(from, { withFileTypes: true }, (error, files) => {
        if (error) {
          throw error;
        }

        files.forEach((file) => {
          if (file.isFile()) {
            const fromPath = path.join(from, file.name);
            const toPath = path.join(to, file.name);
            fs.copyFile(fromPath, toPath, (error) => {
              if (error) {
                throw error;
              }
            });
          } else if (file.isDirectory()) {
            copyDir(from, to);
          }
        });
      });
    });
  });
}
copyDir(pathToFiles, pathToFilesCopy);
