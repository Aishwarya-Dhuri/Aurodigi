var express = require('express');
var XLSX = require('xlsx');
const fs = require('fs');
var _ = require('lodash');
var moment = require('moment');
var router = express.Router();
const multer = require('multer');

router.get('/downloadSample', function (req, res) {
  res.download('./componentGenerator/samples/sample.xlsx');
});

router.get('/DownloadTemplate', function (req, res) {
  res.download('./componentGenerator/samples/template.xlsx');
});

router.post('/upload', function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }
  var filePath = generateComponent(req.files.templateFile.data);
  setTimeout(function () {
    fs.rmSync(filePath);
  }, 0.25 * 60 * 1000);
  res.download(filePath);
});

/* router.post('/upload', multer({ storage: multer.memoryStorage() }), function (req, res) {
  console.log(req);
  if (!req.buffer || Object.keys(req.buffer).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }
  var filePath = generateComponent(req.buffer.templateFile.data);
  setTimeout(function () {
    fs.rmSync(filePath);
  }, 0.25 * 60 * 1000);
  res.download(filePath);
}); */

function generateComponent(fileBuffer) {
  //var workbook = XLSX.readFile('./sample1.xlsx');
  var workbook = XLSX.read(fileBuffer);
  var main = XLSX.utils.sheet_to_json(workbook.Sheets['Main']);
  var sections = XLSX.utils.sheet_to_json(workbook.Sheets['Sections']);
  sections = _.sortBy(sections, ['Sr No']);
  var parentChild = XLSX.utils.sheet_to_json(workbook.Sheets['ParentChild']);
  var fields = XLSX.utils.sheet_to_json(workbook.Sheets['Fields']);
  fields = _.sortBy(fields, ['Section No']);

  try {
    // Folder generation start
    const mainFolderName =
      _.camelCase(main[0]['Master Name']) + ' - ' + moment().format('DDMMYYYY-hmmss');
    const mainFolderPath = './componentGenerator/temp/' + mainFolderName;
    const uiFolderName = './componentGenerator/temp/' + mainFolderName + '/UI';
    const dummyServerFolderName = './componentGenerator/temp/' + mainFolderName + '/dummyServer';
    //console.log('Main Folder Name : ' + mainFolderName);
    fs.mkdirSync('./componentGenerator/temp/' + mainFolderName);
    fs.mkdirSync(uiFolderName);
    fs.mkdirSync(dummyServerFolderName);
    const masterUrl =
      _.camelCase(main[0]['Product']) +
      '/' +
      _.camelCase(main[0]['Parent Menu']) +
      '/' +
      _.camelCase(main[0]['Master Name']);
    const serverComponentPath = dummyServerFolderName + '/' + masterUrl;
    const uiComponetPath =
      uiFolderName +
      '/' +
      uiFileCase(main[0]['Product']) +
      '/' +
      uiFileCase(main[0]['Parent Menu']) +
      '/' +
      uiFileCase(main[0]['Master Name']);
    console.log('Master Url : ' + masterUrl);
    fs.mkdirSync(serverComponentPath, { recursive: true });
    fs.mkdirSync(uiComponetPath, { recursive: true });
    // Folder generation ends

    const ServerTemplateFilesPath = mainFolderPath + '/ServerTemplateFiles';
    fs.mkdirSync(ServerTemplateFilesPath, { recursive: true });
    //ServerTemplate Start
    console.log('ServerTemplate Write Start');
    if (parentChild.length > 1)
      generateServerPCTemplate(main, parentChild, fields, ServerTemplateFilesPath);
    else generateServerMTemplate(main, fields, ServerTemplateFilesPath);
    console.log('ServerTemplate Write Complete');
    //ServerTemplate Complete

    //GUIAPIServiceTemplate Start
    console.log('GUIAPIServiceTemplate Write Start');
    generateGUIAPIServiceTemplate(main, parentChild, fields, ServerTemplateFilesPath);
    console.log('GUIAPIServiceTemplate Write Complete');
    //GUIAPIServiceTemplate Complete

    //QAScript Start
    console.log('QAScript Write Start');
    generateQAScript(main, sections, fields, mainFolderPath);
    console.log('QAScript Write Complete');
    //QAScript Complete

    //readme Start
    console.log('Readme Write Start');
    let readMe = fs.readFileSync('./componentGenerator/templates/UI/Readme.txt', 'utf8');
    readMe = readMe.replace(/<%=productNameUiFileCase%>/g, uiFileCase(main[0]['Product']));
    readMe = readMe.replace(/<%=componentName%>/g, classNameCase(main[0]['Master Name']));
    readMe = readMe.replace(/<%=componentNameUiFileCase%>/g, uiFileCase(main[0]['Master Name']));
    readMe = readMe.replace(/<%=componentPath%>/g, uiFileCase(main[0]['Parent Menu']));
    readMe = readMe.replace(
      /<%=routerPath%>/g,
      _.camelCase(main[0]['Parent Menu']) + '/' + _.camelCase(main[0]['Master Name']),
    );
    fs.writeFileSync(mainFolderPath + '/Readme.txt', readMe);
    console.log('Readme Write Complete');
    //readme Ends

    // HTML Start
    console.log('HTML Write Start');
    let mainHtml = fs.readFileSync('./componentGenerator/templates/UI/main.html', 'utf8');
    mainHtml = mainHtml.replace(/<%=masterName%>/g, main[0]['Master Name']);
    mainHtml = mainHtml.replace(/<%=formName%>/g, _.camelCase(main[0]['Master Name']) + 'Form');

    // sections start
    var sectionsHtml = '';
    _.forEach(sections, function (section) {
      var sectionHtml = fs.readFileSync('./componentGenerator/templates/UI/section.html', 'utf8');
      sectionHtml = sectionHtml.replace(/<%=header%>/g, section['Sr No'] + '. ' + section.Header);

      // fields start
      var fieldsHtml = '';
      var responsiveClasses = '';
      responsiveClasses = 'p-col-' + parseInt(12 / parseInt(section['No Of Fields On Web']));
      responsiveClasses += ' p-lg-' + parseInt(12 / parseInt(section['No Of Fields On Web']));
      responsiveClasses += ' p-md-' + parseInt(12 / parseInt(section['No Of Fields On Tab']));
      responsiveClasses += ' p-sm-' + parseInt(12 / parseInt(section['No Of Fields On Mobile']));
      var sectionFields = _.filter(fields, function (f) {
        return f['Section No'] == section['Sr No'];
      });
      _.forEach(sectionFields, function (field) {
        const dataType = field.Datatype.toUpperCase();
        switch (dataType) {
          case 'TEXT':
            fieldsHtml += getTextFieldHTML(field, responsiveClasses);
            break;
          case 'ALPHANUMERIC':
            fieldsHtml += getTextFieldHTML(field, responsiveClasses);
            break;
          case 'NUMERIC':
            fieldsHtml += getTextFieldHTML(field, responsiveClasses);
            break;
          case 'DATE':
            fieldsHtml += getDateFieldHTML(field, responsiveClasses);
            break;
          default:
            console.log('unknown dataType : ' + field.Datatype);
            break;
        }
      });
      // fields ends
      sectionHtml = sectionHtml.replace(/<%=fields%>/g, fieldsHtml);
      sectionsHtml += sectionHtml;
    });
    // sections ends
    mainHtml = mainHtml.replace(/<%=sections%>/g, sectionsHtml);
    fs.writeFileSync(
      uiComponetPath + '/' + uiFileCase(main[0]['Master Name']) + '.component.html',
      mainHtml,
    );
    console.log('HTML Write Complete');
    // HTML Ends

    // SCSS Start
    console.log('SCSS Write Start');
    fs.writeFileSync(
      uiComponetPath + '/' + uiFileCase(main[0]['Master Name']) + '.component.scss',
      '',
    );
    console.log('SCSS Write Complete');
    // SCSS Ends

    // SPEC Start
    console.log('SPEC Write Start');
    var specTS = fs.readFileSync('./componentGenerator/templates/UI/spec.ts', 'utf8');
    specTS = specTS.replace(/<%=componentName%>/g, classNameCase(main[0]['Master Name']));
    specTS = specTS.replace(/<%=masterNameUiFileCase%>/g, uiFileCase(main[0]['Master Name']));
    fs.writeFileSync(
      uiComponetPath + '/' + uiFileCase(main[0]['Master Name']) + '.component.spec.ts',
      specTS,
    );
    console.log('SPEC Write Complete');
    // SPEC Ends

    // Form and Excel Start
    console.log('Form and Excel Write Start');
    var formTS = fs.readFileSync('./componentGenerator/templates/UI/form.ts', 'utf8');
    formTS = formTS.replace(/<%=componentName%>/g, classNameCase(main[0]['Master Name']));
    formTS = formTS.replace(
      /<%=masterType%>/g,
      main[0]['Type Of Master'].toLowerCase() == 'master' ? 'Master' : 'MakerChecker',
    );
    formTS = formTS.replace(
      /<%=masterTypeUiFileCase%>/g,
      main[0]['Type Of Master'].toLowerCase() == 'master' ? 'master' : 'maker-checker',
    );
    var formFields = '';
    var jsonObj = { id: 0, version: '', active: '' };
    const makerCheckerObj = {
      authorized: '',
      lastAction: '',
      modifiedBy: '',
      modifiedOn: '',
      modifiedSysOn: '',
      modifiedAtOU: '',
    };
    const masterObj = { enabled: '', effectiveFrom: '', effectiveTill: '' };

    _.forEach(fields, function (field) {
      jsonObj[_.camelCase(field['Field Name'])] = '';
      formFields += _.camelCase(field['Field Name']) + ': [';
      if (field['Default Value'] && field['Default Value'] != '')
        formFields += "'" + field['Default Value'] + "', ";
      else formFields += "'', ";

      if (field['Is Required'] == 'Y') formFields += 'Validators.required ';

      formFields += '],\n\t';
    });
    jsonObj = { ...jsonObj, ...makerCheckerObj };
    if (main[0]['Type Of Master'].toLowerCase() == 'master') {
      jsonObj = { ...jsonObj, ...masterObj };
    }
    formTS = formTS.replace(/<%=formFields%>/g, formFields);
    fs.writeFileSync(
      uiComponetPath + '/' + uiFileCase(main[0]['Master Name']) + '.form.ts',
      formTS,
    );

    var wb = XLSX.utils.book_new(); // make Workbook of Excel
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([jsonObj]), 'sheet1'); // add sheet to Workbook //can add multiple sheet by same step
    XLSX.writeFile(wb, serverComponentPath + '/data.xlsx');

    console.log('Form and Excel Write Complete');
    // Form and Excel Ends

    // Component Start
    console.log('Component Write Start');
    var componentTS = fs.readFileSync('./componentGenerator/templates/UI/component.ts', 'utf8');
    componentTS = componentTS.replace(/<%=componentName%>/g, classNameCase(main[0]['Master Name']));
    componentTS = componentTS.replace(
      /<%=componentNameUiFileCase%>/g,
      uiFileCase(main[0]['Master Name']),
    );
    fs.writeFileSync(
      uiComponetPath + '/' + uiFileCase(main[0]['Master Name']) + '.component.ts',
      componentTS,
    );
    console.log('Component Write Complete');
    // Component Ends

    // ZIP Start
    console.log('ZIP Write Start');
    var zipper = require('zip-local');
    zipper.sync
      .zip(mainFolderPath)
      .compress()
      .save(mainFolderPath + '.zip');
    console.log('ZIP Write Complete');
    //ZIP Complete

    // DELETION Start
    console.log('DELETION Start');
    fs.rmSync(mainFolderPath, { recursive: true });
    console.log('DELETION Complete');
    //DELETION Complete

    return mainFolderPath + '.zip';
  } catch (err) {
    console.error(err);
  }
}

function classNameCase(name) {
  name = _.camelCase(name);
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function uiFileCase(name) {
  return name.toLowerCase().replace(/\s/g, '-');
}

function getTextFieldHTML(field, responsiveClasses) {
  var fieldHtml = fs.readFileSync('./componentGenerator/templates/UI/textField.html', 'utf8');
  fieldHtml = fieldHtml.replace(/<%=responsiveClasses%>/g, responsiveClasses);
  fieldHtml = fieldHtml.replace(/<%=fieldName%>/g, _.camelCase(field['Field Name']));
  fieldHtml = fieldHtml.replace(/<%=fieldDisplayName%>/g, field['Field Name']);
  fieldHtml = fieldHtml.replace(/<%=isRequired%>/g, field['Is Required'] == 'Y' ? 'required' : '');
  return fieldHtml;
}

function getDateFieldHTML(field, responsiveClasses) {
  var fieldHtml = fs.readFileSync('./componentGenerator/templates/UI/dateField.html', 'utf8');
  fieldHtml = fieldHtml.replace(/<%=responsiveClasses%>/g, responsiveClasses);
  fieldHtml = fieldHtml.replace(/<%=fieldName%>/g, _.camelCase(field['Field Name']));
  fieldHtml = fieldHtml.replace(/<%=fieldDisplayName%>/g, field['Field Name']);
  fieldHtml = fieldHtml.replace(/<%=isRequired%>/g, field['Is Required'] == 'Y' ? 'required' : '');
  return fieldHtml;
}

function generateServerMTemplate(main, fields, mainFolderPath) {
  var product = main[0]['Product'];
  var masterType = main[0]['Type Of Master'];
  var masterName = main[0]['Master Name'];
  var wb = XLSX.utils.book_new();
  var ws_cols = [
    { wch: 11 },
    { wch: 35 },
    { wch: 17 },
    { wch: 12 },
    { wch: 22 },
    { wch: 19 },
    { wch: 25 },
    { wch: 25 },
    { wch: 20 },
    { wch: 30 },
    { wch: 13 },
    { wch: 25 },
  ];
  var ws_data = [
    [
      'Identifier',
      'Base Package',
      'Master Name',
      'Extend Class',
      'Implemented Interfaces',
      'Database Table Name',
      'Factory Type',
      'Display Name',
      'EntityName',
      'JSP path',
    ],
  ];
  //adding Master Row
  ws_data.push([
    'MST',
    'com.aurionpro.cashpro.commons.' + ('Master' == masterType ? 'masters' : 'transactions'),
    classNameCase(masterName),
    masterType,
    '-',
    ('Master' == masterType ? 'M' : 'T') + _.camelCase(masterName).toUpperCase() + 'MST',
    (product == 'Setup' ? 'Commons' : product) + 'ServiceFactory',
    masterName,
    _.camelCase(masterName).toUpperCase(),
    '/jsp/' + (product == 'Setup' ? 'Commons' : product) + '/Masters',
  ]);
  //adding fields headers
  ws_data.push([
    'Identifier',
    'Field Name',
    'Field Type',
    'HBM Min Size',
    'HBM Max Size',
    'DB Column Name',
    'DB Column Type',
    'DB Column Size',
    'Allow Null',
    'Unique Field',
    'Listing Field',
    'Display Name',
  ]);

  //adding Fields
  //add by loop below
  var dataTypeMap = {
    ALPHANUMERIC: 'String',
    TEXT: 'String',
    NUMERIC: 'Long',
    AMOUNT: 'Double',
    DATE: 'Date',
  };
  var databaseDataTypeMap = {
    ALPHANUMERIC: 'VARCHAR',
    TEXT: 'VARCHAR',
    NUMERIC: 'NUMBER',
    AMOUNT: 'NUMBER',
    DATE: 'DATE',
  };
  _.forEach(fields, function (field) {
    ws_data.push([
      'PROP',
      _.camelCase(field['Field Name']),
      dataTypeMap[field.Datatype.toUpperCase()],
      field['Min Length'],
      field['Max Length'],
      _.camelCase(field['Field Name']).toUpperCase(),
      databaseDataTypeMap[field.Datatype.toUpperCase()],
      field['Max Length'],
      'Y' == field['Is Required'] ? 'No' : 'Yes',
      'Y' == field['Is Unique'] ? 'Yes' : 'No',
      field['Listing Field Sequence'],
      field['Field Name'],
    ]);
  });

  ws_data.push(['ENDM', 'ENDM']);
  ws_data.push(['END', 'END']);

  var ws = XLSX.utils.aoa_to_sheet(ws_data);
  ws['!cols'] = ws_cols;
  XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
  XLSX.writeFile(wb, mainFolderPath + '/MasterUploadTemplate.xlsx');
}

function generateServerPCTemplate(main, parentChild, fields, mainFolderPath) {
  var product = main[0]['Product'];
  var masterType = main[0]['Type Of Master'];
  var masterName = main[0]['Master Name'];
  var wb = XLSX.utils.book_new();
  var ws_cols = [
    { wch: 11 },
    { wch: 35 },
    { wch: 17 },
    { wch: 12 },
    { wch: 22 },
    { wch: 19 },
    { wch: 25 },
    { wch: 25 },
    { wch: 20 },
    { wch: 30 },
    { wch: 13 },
    { wch: 25 },
  ];
  var ws_data = [
    [
      'Identifier',
      'Base Package',
      'Master Name',
      'Extend Class',
      'Implemented Interfaces',
      'Database Table Name',
      'Factory Type',
      'Display Name',
      'EntityName',
      'JSP path',
    ],
  ];
  //adding Master Row
  ws_data.push([
    'PMST',
    'com.aurionpro.cashpro.commons.' + ('Master' == masterType ? 'masters' : 'transactions'),
    classNameCase(masterName),
    masterType,
    '-',
    ('Master' == masterType ? 'M' : 'T') + _.camelCase(masterName).toUpperCase() + 'MST',
    (product == 'Setup' ? 'Commons' : product) + 'ServiceFactory',
    masterName,
    _.camelCase(masterName).toUpperCase(),
    '/jsp/' + (product == 'Setup' ? 'Commons' : product) + '/Masters',
  ]);
  //adding fields headers
  ws_data.push([
    'Identifier',
    'Field Name',
    'Field Type',
    'HBM Min Size',
    'HBM Max Size',
    'DB Column Name',
    'DB Column Type',
    'DB Column Size',
    'Allow Null',
    'Unique Field',
    'Listing Field',
    'Display Name',
  ]);

  //adding Fields
  //add by loop below
  var dataTypeMap = {
    ALPHANUMERIC: 'String',
    TEXT: 'String',
    NUMERIC: 'Long',
    AMOUNT: 'Double',
    DATE: 'Date',
  };
  var databaseDataTypeMap = {
    ALPHANUMERIC: 'VARCHAR',
    TEXT: 'VARCHAR',
    NUMERIC: 'NUMBER',
    AMOUNT: 'NUMBER',
    DATE: 'DATE',
  };

  var parentFields = _.filter(fields, function (f) {
    return f['Belongs To'] == parentChild[0].Name;
  });
  _.forEach(parentFields, function (field) {
    ws_data.push([
      'PROP',
      _.camelCase(field['Field Name']),
      dataTypeMap[field.Datatype.toUpperCase()],
      field['Min Length'],
      field['Max Length'],
      _.camelCase(field['Field Name']).toUpperCase(),
      databaseDataTypeMap[field.Datatype.toUpperCase()],
      field['Max Length'],
      'Y' == field['Is Required'] ? 'No' : 'Yes',
      'Y' == field['Is Unique'] ? 'Yes' : 'No',
      field['Listing Field Sequence'],
      field['Field Name'],
    ]);
  });
  ws_data.push(['ENDP']);

  var childs = _.filter(parentChild, function (pc) {
    return pc['Parent Name'] && pc['Parent Name'] != '';
  });
  _.forEach(childs, function (pc) {
    var childFields = _.filter(fields, function (f) {
      return f['Belongs To'] == pc.Name;
    });
    ws_data.push([
      'Identifier',
      'Base Package',
      'Master Name',
      'Extend Class',
      'Implemented Interfaces',
      'Database Table Name',
      'Factory Type',
      'Display Name',
      'EntityName',
      'JSP path',
    ]);
    ws_data.push([
      'CMST',
      'com.aurionpro.cashpro.commons.' + ('Master' == masterType ? 'masters' : 'transactions'),
      classNameCase(pc.Name),
      masterType,
      '-',
      ('Master' == masterType ? 'M' : 'T') + _.camelCase(pc.Name).toUpperCase() + 'DET',
      (product == 'Setup' ? 'Commons' : product) + 'ServiceFactory',
      pc.Name,
      _.camelCase(pc.Name).toUpperCase(),
      '/jsp/' + (product == 'Setup' ? 'Commons' : product) + '/Masters',
    ]);
    //adding fields headers
    ws_data.push([
      'Identifier',
      'Field Name',
      'Field Type',
      'HBM Min Size',
      'HBM Max Size',
      'DB Column Name',
      'DB Column Type',
      'DB Column Size',
      'Allow Null',
      'Unique Field',
      'Listing Field',
      'Display Name',
    ]);
    _.forEach(childFields, function (field) {
      ws_data.push([
        'PROP',
        _.camelCase(field['Field Name']),
        dataTypeMap[field.Datatype.toUpperCase()],
        field['Min Length'],
        field['Max Length'],
        _.camelCase(field['Field Name']).toUpperCase(),
        databaseDataTypeMap[field.Datatype.toUpperCase()],
        field['Max Length'],
        'Y' == field['Is Required'] ? 'No' : 'Yes',
        'Y' == field['Is Unique'] ? 'Yes' : 'No',
        field['Listing Field Sequence'],
        field['Field Name'],
      ]);
    });

    ws_data.push(['ENDC']);
    ws_data.push(['Identifier', 'Set Name', 'Key Column Name', 'Mapping']);
    ws_data.push([
      'MAP',
      _.camelCase(pc.Name) + 'Details',
      pc['Key Column Name'],
      pc['Relation Type'],
    ]);
  });

  ws_data.push(['ENDPC']);
  ws_data.push(['END']);

  var ws = XLSX.utils.aoa_to_sheet(ws_data);
  ws['!cols'] = ws_cols;
  XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
  XLSX.writeFile(wb, mainFolderPath + '/PCMasterUploadTemplate.xlsx');
}

function generateGUIAPIServiceTemplate(main, parentChild, fields, mainFolderPath) {
  var productsMap = {
    Setup: 'Commons',
    Payments: 'PayPro',
    RMS: 'RMS',
  };
  var dataTypeMap = {
    ALPHANUMERIC: 'String',
    TEXT: 'String',
    NUMERIC: 'Long',
    AMOUNT: 'Double',
    DATE: 'Date',
  };
  var product = main[0]['Product'];
  var masterType = main[0]['Type Of Master'];
  var masterName = main[0]['Master Name'];
  var wb = XLSX.utils.book_new();
  var ws_cols = [
    { wch: 13 },
    { wch: 35 },
    { wch: 35 },
    { wch: 30 },
    { wch: 30 },
    { wch: 25 },
    { wch: 35 },
    { wch: 25 },
  ];
  var ws_data = [['Identifier', 'Base Package', 'Class Name']];
  //adding REQ
  ws_data.push([
    'REQ',
    'com.aurionpro.cashpro.rest.' +
      productsMap[product].toLowerCase() +
      '.' +
      ('Master' == masterType ? 'masters' : 'transactions'),
    classNameCase(masterName),
  ]);
  ws_data.push(['Identifier', 'Data Type', 'Property Name', 'Required', 'Package Name (optional)']);
  ws_data.push(['END_REQ']);

  //adding RES
  ws_data.push([
    'RES',
    'com.aurionpro.cashpro.rest.' +
      productsMap[product].toLowerCase() +
      '.' +
      ('Master' == masterType ? 'masters' : 'transactions'),
    classNameCase(masterName),
  ]);
  ws_data.push(['Identifier', 'Data Type', 'Property Name', 'Required', 'Package Name (optional)']);
  ws_data.push(['END_RES']);

  //adding WOPERATION
  ws_data.push([
    'Identifier',
    'Base Package',
    'Class Name',
    'Function Name',
    'Parent Name',
    'FactoryName',
    'Service Name',
  ]);
  ws_data.push([
    'WOPERATION',
    'com.aurionpro.cashpro.' +
      productsMap[product].toLowerCase() +
      '.rest.' +
      ('Master' == masterType ? 'master' : 'transaction'),
    classNameCase(masterName) + 'WrapperOperation',
    '',
    ('Master' == masterType ? 'Master' : 'MakerChecker') + 'WrapperOperation',
    productsMap[product] + 'ServiceFactory',
    classNameCase(masterName) + 'Service',
  ]);

  //adding WSERVICE
  ws_data.push(['Identifier', 'Base Package', 'Class Name', 'Function Name', 'Parent Name']);
  ws_data.push([
    'WSERVICE',
    'com.aurionpro.cashpro.' +
      productsMap[product].toLowerCase() +
      '.rest.' +
      ('Master' == masterType ? 'master' : 'transaction'),
    classNameCase(masterName) + 'WrapperService',
    '',
    'MakerCheckerWrapperService',
  ]);

  //adding WSERVICEIMPL
  ws_data.push([
    'Identifier',
    'Base Package',
    'Class Name',
    'Function Name',
    'Parent Name',
    'FactoryName',
  ]);
  ws_data.push([
    'WSERVICEIMPL',
    'com.aurionpro.cashpro.' +
      productsMap[product].toLowerCase() +
      '.rest.' +
      ('Master' == masterType ? 'master' : 'transaction'),
    classNameCase(masterName) + 'WrapperServiceImpl',
    '',
    'MakerCheckerWrapperServiceImpl',
    productsMap[product] + 'ServiceFactory',
  ]);

  //adding WLIST
  ws_data.push([
    'Identifier',
    'Base Package',
    'Class Name',
    'Parent Name',
    'FactoryName',
    'Service Name',
    'Parent Package Name',
  ]);
  ws_data.push([
    'WLIST',
    'com.aurionpro.cashpro.' +
      productsMap[product].toLowerCase() +
      '.rest.' +
      ('Master' == masterType ? 'master' : 'transaction'),
    classNameCase(masterName) + 'WrapperList',
    'MakerCheckerWrapperList',
    productsMap[product] + 'ServiceFactory',
    classNameCase(masterName) + 'Service',
    'com.aurionpro.cashpro.' + productsMap[product].toLowerCase() + '.rest.base',
  ]);

  //adding CONTR
  ws_data.push([
    'Identifier',
    'Base Package',
    'Class Name',
    'Controller Map(@RequestMapping)',
    '@ResponseBody',
    'Parent Name',
    'Validator Package(optional)',
    'Validator Class(optional)',
  ]);
  ws_data.push([
    'CONTR',
    'com.aurionpro.cashpro.rest.controller.' +
      productsMap[product].toLowerCase() +
      '.' +
      ('Master' == masterType ? 'master' : 'transaction'),
    classNameCase(masterName) + 'Controller',
    '/' +
      _.camelCase(productsMap[product]) +
      '/' +
      _.camelCase(main[0]['Parent Menu']) +
      '/' +
      _.camelCase(masterName),
    'BaseResponse',
    'MakerCheckerController',
    'com.aurionpro.cashpro.rest.controller.' +
      productsMap[product].toLowerCase() +
      '.' +
      ('Master' == masterType ? 'master' : 'transaction'),
    classNameCase(masterName) + 'Validator',
  ]);

  //adding CHILD
  ws_data.push(['Identifier', 'Base Package', 'Class Name']);
  ws_data.push([
    'CHILD',
    'com.aurionpro.cashpro.rest.' +
      productsMap[product].toLowerCase() +
      '.' +
      ('Master' == masterType ? 'masters' : 'transactions'),
    classNameCase(masterName),
  ]);
  ws_data.push(['Identifier', 'Data Type', 'Property Name', 'Required']);
  var parentFields = _.filter(fields, function (f) {
    return f['Belongs To'] == parentChild[0].Name;
  });
  _.forEach(parentFields, function (field) {
    ws_data.push([
      'PROP',
      dataTypeMap[field.Datatype],
      _.camelCase(field['Field Name']),
      'Y' == field['Is Required'] ? 'YES' : 'NO',
    ]);
  });
  var childs = _.filter(parentChild, function (pc) {
    return pc['Parent Name'] == parentChild[0].Name;
  });
  _.forEach(childs, function (child) {
    ws_data.push([
      'PROP',
      'one-to-many' == child['Relation Type']
        ? 'Set<' + classNameCase(child.Name) + '>'
        : classNameCase(child.Name),
      _.camelCase(child.Name) + ('one-to-many' == child['Relation Type'] ? 'List' : 'Details'),
      'NO',
    ]);
  });
  ws_data.push(['ENDC']);
  _.forEach(childs, function (child) {
    ws_data.push(['Identifier', 'Base Package', 'Class Name']);
    ws_data.push([
      'CHILD',
      'com.aurionpro.cashpro.rest.' +
        productsMap[product].toLowerCase() +
        '.' +
        ('Master' == masterType ? 'masters' : 'transactions'),
      classNameCase(child.Name),
    ]);
    ws_data.push(['Identifier', 'Data Type', 'Property Name', 'Required']);
    var childFields = _.filter(fields, function (f) {
      return f['Belongs To'] == child.Name;
    });
    _.forEach(childFields, function (field) {
      ws_data.push([
        'PROP',
        dataTypeMap[field.Datatype.toUpperCase()],
        _.camelCase(field['Field Name']),
        'Y' == field['Is Required'] ? 'YES' : 'NO',
      ]);
    });
    ws_data.push(['ENDC']);
  });
  ws_data.push(['ENDS']);
  ws_data.push(['END']);

  var ws = XLSX.utils.aoa_to_sheet(ws_data);
  ws['!cols'] = ws_cols;
  XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
  XLSX.writeFile(wb, mainFolderPath + '/GUIAPIServiceTemplate.xlsx');
}

function generateQAScript(main, sections, fields, mainFolderPath) {
  let mainFile = fs.readFileSync('./componentGenerator/templates/QAScripts/mainFile.sh', 'utf8');

  mainFile = mainFile.replace(/<%=masterNameClassCase%>/g, classNameCase(main[0]['Master Name']));
  mainFile = mainFile.replace(/<%=MasterName%>/g, main[0]['Master Name']);
  let sectionHeaderAsserts = '';
  _.forEach(sections, function (section, index) {
    let sectionHeaderAssertSh = fs.readFileSync(
      './componentGenerator/templates/QAScripts/sectionHeaderAssert.sh',
      'utf8',
    );
    sectionHeaderAssertSh = sectionHeaderAssertSh.replace(
      /<%=sectionHeader%>/g,
      section['Sr No'] + '. ' + section.Header,
    );
    sectionHeaderAssertSh = sectionHeaderAssertSh.replace(/<%=sectionIndex%>/g, index);
    sectionHeaderAsserts += sectionHeaderAssertSh;
  });
  mainFile = mainFile.replace(/<%=sectionHeaderAsserts%>/g, sectionHeaderAsserts);

  let uniqueFieldsErrorConditions = '';
  let $uniqueField = '';
  let $fields = '';
  let listingOFieldName = '';
  let $listingOField = '';
  let viewPreviousDataAsserts = '';
  let viewAsserts = '';
  let fieldAsserts = '';
  _.forEach(fields, function (field, index) {
    let uniqueFieldAssert = '';
    let conditionAsserts = '';
    let fieldAssert = fs.readFileSync(
      './componentGenerator/templates/QAScripts/fieldAssert.sh',
      'utf8',
    );
    fieldAssert = fieldAssert.replace(/<%=fieldName%>/g, field['Field Name']);
    fieldAssert = fieldAssert.replace(/<%=fieldIndex%>/g, index);
    fieldAssert = fieldAssert.replace(/<%=field%>/g, _.camelCase(field['Field Name']));
    if ('Y' == field['Is Unique']) {
      $uniqueField = _.camelCase(field['Field Name']);
      let uniqueFieldsErrorConditionSh = fs.readFileSync(
        './componentGenerator/templates/QAScripts/uniqueFieldsErrorCondition.sh',
        'utf8',
      );
      uniqueFieldsErrorConditionSh = uniqueFieldsErrorConditionSh.replace(
        /<%=fieldName%>/g,
        field['Field Name'],
      );
      uniqueFieldsErrorConditions += uniqueFieldsErrorConditionSh;
      uniqueFieldAssert = fs.readFileSync(
        './componentGenerator/templates/QAScripts/uniqueFieldAssert.sh',
        'utf8',
      );
      uniqueFieldAssert = uniqueFieldAssert.replace(
        /<%=field%>/g,
        _.camelCase(field['Field Name']),
      );
    }
    if ('Y' == field['Is Required']) {
      let conditionAssert = '';
      if ('DATE' == field.Datatype.toUpperCase())
        conditionAssert = fs.readFileSync(
          './componentGenerator/templates/QAScripts/requiredDateFieldAssert.sh',
          'utf8',
        );
      else
        conditionAssert = fs.readFileSync(
          './componentGenerator/templates/QAScripts/requiredFieldAssert.sh',
          'utf8',
        );
      conditionAssert = conditionAssert.replace(/<%=fieldIndex%>/g, index);
      conditionAssert = conditionAssert.replace(/<%=fieldName%>/g, field['Field Name']);
      conditionAsserts += conditionAssert;
    }
    if (
      'ALPHANUMERIC' == field.Datatype.toUpperCase() ||
      'NUMERIC' == field.Datatype.toUpperCase()
    ) {
      let alphaNumericFieldAseert = fs.readFileSync(
        './componentGenerator/templates/QAScripts/alphaNumericFieldAseert.sh',
        'utf8',
      );
      alphaNumericFieldAseert = alphaNumericFieldAseert.replace(/<%=fieldIndex%>/g, index);
      alphaNumericFieldAseert = alphaNumericFieldAseert.replace(
        /<%=fieldName%>/g,
        field['Field Name'],
      );
      alphaNumericFieldAseert = alphaNumericFieldAseert.replace(/<%=dataType%>/g, field.Datatype);
      conditionAsserts += alphaNumericFieldAseert;
    }
    if ('DATE' != field.Datatype.toUpperCase()) {
      let maxLengthAssert = fs.readFileSync(
        './componentGenerator/templates/QAScripts/maxLengthAssert.sh',
        'utf8',
      );
      maxLengthAssert = maxLengthAssert.replace(/<%=fieldIndex%>/g, index);
      maxLengthAssert = maxLengthAssert.replace(/<%=fieldName%>/g, field['Field Name']);
      maxLengthAssert = maxLengthAssert.replace(/<%=fieldMaxLength%>/g, field['Max Length']);
      maxLengthAssert = maxLengthAssert.replace(
        /<%=fieldMaxLengthText%>/g,
        'X'.repeat(parseInt(field['Max Length']) + 2),
      );
      conditionAsserts += maxLengthAssert;
    }
    fieldAssert = fieldAssert.replace(/<%=conditionAsserts%>/g, conditionAsserts);
    fieldAssert = fieldAssert.replace(/<%=uniqueFieldAssert%>/g, uniqueFieldAssert);
    fieldAsserts += fieldAssert;

    if ('0' == field['Listing Field Sequence']) {
      listingOFieldName = field['Field Name'];
      $listingOField = _.camelCase(field['Field Name']);
    }
    $fields += '$' + _.camelCase(field['Field Name']) + ', ';
    let viewFieldAssertSh = fs.readFileSync(
      './componentGenerator/templates/QAScripts/viewFieldAssert.sh',
      'utf8',
    );
    viewFieldAssertSh = viewFieldAssertSh.replace(/<%=fieldIndex%>/g, index);
    //update below using loop with section and fields
    viewFieldAssertSh = viewFieldAssertSh.replace(/<%=dataContentIndex%>/g, '0');
    viewAsserts += viewFieldAssertSh;
    let viewPreFieldAssertSh = fs.readFileSync(
      './componentGenerator/templates/QAScripts/viewFieldAssert.sh',
      'utf8',
    );
    viewPreFieldAssertSh = viewPreFieldAssertSh.replace(/<%=fieldIndex%>/g, index);
    //update below using loop with section and fields
    viewPreFieldAssertSh = viewPreFieldAssertSh.replace(
      /<%=dataContentIndex%>/g,
      sections.length + 1,
    );
    viewPreviousDataAsserts += viewPreFieldAssertSh;
  });
  mainFile = mainFile.replace(/<%=fieldAsserts%>/g, fieldAsserts);
  mainFile = mainFile.replace(/<%=uniqueFieldsErrorConditions%>/g, uniqueFieldsErrorConditions);
  mainFile = mainFile.replace(/<%=uniqueField%>/g, $uniqueField);
  mainFile = mainFile.replace(/<%=fields%>/g, $fields);
  mainFile = mainFile.replace(/<%=listingOFieldName%>/g, listingOFieldName);
  mainFile = mainFile.replace(/<%=listingOField%>/g, $listingOField);
  mainFile = mainFile.replace(/<%=viewPreviousDataAsserts%>/g, viewPreviousDataAsserts);
  mainFile = mainFile.replace(/<%=viewAsserts%>/g, viewAsserts);

  fs.mkdirSync(mainFolderPath + '/QAScripts', { recursive: true });
  fs.writeFileSync(
    mainFolderPath + '/QAScripts/' + classNameCase(main[0]['Master Name']) + '_Function.sh',
    mainFile,
  );
}

module.exports = router;
