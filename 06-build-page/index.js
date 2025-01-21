const fs = require('fs');
const path = require('path');

const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToStyles = path.join(__dirname, 'styles');
const pathToAssets = path.join(__dirname, 'assets');
const pathToComponents = path.join(__dirname, 'components');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToIndexHtml = path.join(pathToProjectDist, 'index.html');
const pathToCssFile = path.join(pathToProjectDist, 'style.css');
const pathToCopyAssets = path.join(pathToProjectDist, 'assets');

fs.mkdir(pathToProjectDist, { recursive: true }, (error) => {
  if (error) {
    throw error;
  }

  createIndexHtml();
  mergeStyles();
  copyAssets(pathToAssets, pathToCopyAssets);
});

function createIndexHtml() {
  fs.readFile(pathToTemplate, 'utf-8', (error, templateData) => {
    if (error) {
      throw error;
    }
    const tags = templateData.match(/{{\s*\w+\s*}}/g);

    if (tags) {
      let tagsToReplace = tags.length;

      tags.forEach((tag) => {
        const tagName = tag.replace(/{{\s*|\s*}}/g, '');
        const pathToTag = path.join(pathToComponents, `${tagName}.html`);

        fs.readFile(pathToTag, 'utf-8', (error, tagData) => {
          if (error) {
            tagsToReplace--;
            if (tagsToReplace === 0) {
              fs.writeFile(pathToIndexHtml, templateData, (error) => {
                if (error) {
                  throw error;
                }
              });
            }
            return;
          }
          templateData = templateData.replace(tag, tagData);
          tagsToReplace--;

          if (tagsToReplace === 0) {
            fs.writeFile(pathToIndexHtml, templateData, (error) => {
              if (error) {
                throw error;
              }
            });
          }
        });
      });
    } else {
      fs.writeFile(pathToIndexHtml, templateData, (error) => {
        if (error) {
          throw error;
        }
      });
    }
  });
}

function mergeStyles() {
  fs.readdir(pathToStyles, { withFileTypes: true }, (error, files) => {
    if (error) {
      throw error;
    }

    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );

    const arrayOfStyles = [];
    let filesToProcess = cssFiles.length;

    if (filesToProcess === 0) {
      fs.writeFile(pathToCssFile, arrayOfStyles.join('\n'), (error) => {
        if (error) {
          throw error;
        }
      });
    }
    cssFiles.forEach((file) => {
      const pathToFile = path.join(pathToStyles, file.name);

      fs.readFile(pathToFile, 'utf-8', (error, data) => {
        if (error) {
          throw error;
        }
        arrayOfStyles.push(data);
        filesToProcess--;

        if (filesToProcess === 0) {
          fs.writeFile(pathToCssFile, arrayOfStyles.join('\n'), (error) => {
            if (error) {
              throw error;
            }
          });
        }
      });
    });
  });
}

function copyAssets(from, to) {
  fs.mkdir(to, { recursive: true }, (error) => {
    if (error) {
      throw error;
    }

    fs.readdir(from, { withFileTypes: true }, (error, files) => {
      if (error) {
        throw error;
      }
      files.forEach((file) => {
        const fromPath = path.join(from, file.name);
        const toPath = path.join(to, file.name);

        if (file.isDirectory()) {
          copyAssets(fromPath, toPath);
        } else {
          fs.copyFile(fromPath, toPath, (error) => {
            if (error) {
              throw error;
            }
          });
        }
      });
    });
  });
}
