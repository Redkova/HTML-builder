const fs = require('fs');
const path = require('path');
const pathToFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFolder, { withFileTypes: true }, (error, files) => {
  if (error) {
    throw error;
  }
  files.forEach((file) => {
    if (file.isFile()) {
      const pathToFile = path.join(__dirname, 'secret-folder', file.name);
      fs.stat(pathToFile, (error, stats) => {
        if (error) {
          throw error;
        }
        const fileName = path.parse(file.name).name;
        const fileExtension = path.parse(file.name).ext.slice(1);

        console.log(`${fileName} - ${fileExtension} - ${stats.size} bytes`);
      });
    }
  });
});
