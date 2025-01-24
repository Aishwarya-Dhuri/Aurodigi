var fs = require('fs');
var path = require('path');
var dirPath = path.resolve(__dirname);

//TODO: Modify Main Project Folter Name as per your folder Name from src
dirPath = path.resolve(dirPath.replace('CIB\\utility', 'CIB'));

//TODO: Modify Folder Name from src e.g. src/app/xxxxx
// var moduleFolterPath = `src/app/vam/vam-setup/va-issuance-initiate`;
var moduleFolterPath = `src/app/trade/process/transaction-enquiry/view-shipping-guarantee`;
var folderPath = path.join(dirPath, moduleFolterPath);

function writeFile(data, fullFilePath) {
  // console.log(data);
  try {
    data = fs.writeFileSync(fullFilePath, data);

    console.log('The file was saved!', fullFilePath);
  } catch (e) {
    console.log('File Write ERROR ', e);
  }
}

function applyRegix1(result) {
  var searchStr = 'label="\\[\\[.*\\]\\]"';
  const regex1 = RegExp(searchStr, 'gi');
  let array1;
  var data = result;
  var labelsToReplace = [];
  console.log('HI..');
  while ((array1 = regex1.exec(data)) !== null) {
    var label = `${array1[0].replace('[[', '')}`;
    label = label.replace(']]', '');
    // label = "lbl_" + label.replace(/\s/g, "_");
    // label = label.toLowerCase();
    label = label.replace(/\"/g, "'");
    label = label.replace('[label]', 'label');
    label = label.replace('label=', '[label]="');

    // [label]="'Enter New 4 Digit PIN'|apsTranslate"  label='Credit Card' | apsTranslate"

    var replacedLabel = `${label} | apsTranslate"`;
    data = data.replace(array1[0], replacedLabel);
    console.log(array1[0], replacedLabel);
  }
  // console.log(data);
  return data;
}
function applyRegix2(result) {
  var searchStr = '\\[\\[.*?\\]\\]';
  const regex1 = RegExp(searchStr, 'gi');
  let array1;
  var data = result;
  var labelsToReplace = [];
  while ((array1 = regex1.exec(data)) !== null) {
    var label = `${array1[0].replace('[[', '')}`;
    label = label.replace(']]', '');
    // label = "lbl_" + label.replace(/\s/g, "_");
    // label = label.toLowerCase();

    var replacedLabel = `{{'${label}' | apsTranslate}}`;
    data = data.replace(array1[0], replacedLabel);
    console.log(array1[0], replacedLabel);
  }
  return data;
}

function modifyLabels(fullFilePath, result) {
  var data = applyRegix1(result);
  data = applyRegix2(data);
  writeFile(data, fullFilePath);
}

function readFileFromDir(fullPath) {
  try {
    console.log('fullFilePath', fullPath);
    var fullFilePath = path.resolve(fullPath);
    var result = fs.readFileSync(fullFilePath, 'utf8');
    if (!result) {
      console.log('File Read ERROR ', e);
      return;
    }
    modifyLabels(fullFilePath, result);
  } catch (e) {
    console.log(e);
  }
  console.log('readFile called');
}

fs.readdir(folderPath, function (err, files) {
  console.log('# Read Dir called', folderPath);
  if (files && files.length > 0) {
    var filesList = files.filter(function (e) {
      return path.extname(e).toLowerCase() === '.html';
    });
    for (filePath of filesList) {
      readFileFromDir(folderPath + '/' + filePath);
    }
  }
});

//node addAPSTransalatePipeOnHTML.js
