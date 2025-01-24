let express = require('express');
let XLSX = require('xlsx');
let _ = require('lodash');
let moment = require('moment');
let router = express.Router();
const fs = require('fs');

let count = 0;

router.post('/dummyServer/**/create', (req, res) => {
  const dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  if (req.body.draftId) {
    deleteRecordInExcel(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'draftData.xlsx',
      req.body.draftId,
    );
    delete req.body.draftId;
  }

  req.body.requestBy =
    req.session && req.session.userDetails?.requestBy ? req.session.userDetails?.requestBy : '';
  if (req.session && req.session.userDetails && req.session.userDetails?.requestBy == 'CORPORATE') {
    if (req.session.userDetails?.loginPreferenceDetails?.loginType == 'group') {
      req.body.groupId = req.body.groupId
        ? req.body.groupId
        : req.session?.userDetails?.loginPreferenceDetails?.groupId;
      req.body.groupId = parseInt(req.body.groupId.toString());
    }
    const corporateId = req.body.corporateId
      ? req.body.corporateId
      : req.session?.userDetails?.corporateId;

    const corporateData = getCorporateData(corporateId);

    req.body.corporateId = corporateId;
    req.body.corporateCode = corporateData ? corporateData.corporateCode : '';
    req.body.corporateName = corporateData ? corporateData.corporateName : '';

    req.body.corporateId = parseInt(corporateId?.toString());
  }

  const data = addRecordInExcel(dataXlFile, req.body, req.session.userDetails);
  res.json({
    dataMap: { id: data.id, data },
    responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
  });
});

const getCorporateData = function (corporateId) {
  const existingWb = XLSX.readFile(
    './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx',
  );

  const xlData = XLSX.utils.sheet_to_json(existingWb.Sheets['Sheet1']);

  return xlData.find((data) => data.id == corporateId);
};

let addRecordInExcel = function (dataXlFile, data, userDetails) {
  let existingWb = XLSX.readFile(dataXlFile);
  data = addCreateRecordData(userDetails, data);
  let sheets = generateCreateSheetData(userDetails, data, existingWb);
  updateWorkbook(existingWb, sheets, dataXlFile);
  return data;
};

let fileExist = function (path) {
  try {
    return fs.existsSync(path);
  } catch (err) {
    console.error(err);
  }
};

let updateWorkbook = function (existingWb, sheets, dataXlFile) {
  let wb = XLSX.utils.book_new(); // make Workbook of Excel
  _.forEach(existingWb.SheetNames, function (sheetName) {
    if (!sheets[sheetName]) {
      let sheetJSONData = XLSX.utils.sheet_to_json(existingWb.Sheets[sheetName]);
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheetJSONData), sheetName);
    } else {
      XLSX.utils.book_append_sheet(wb, sheets[sheetName], sheetName); // add sheet to Workbook //can add multiple sheet by same step
    }
  });
  _.forEach(_.keys(sheets), function (sheetName) {
    if (existingWb.SheetNames.indexOf(sheetName) == -1) {
      XLSX.utils.book_append_sheet(wb, sheets[sheetName], sheetName);
    }
  });
  XLSX.writeFile(wb, dataXlFile); // export Excel file
};

function generateCreateSheetData(userDetails, record, existingWb) {
  let sheets = {};
  let sheetList = existingWb.SheetNames;
  let xlData = XLSX.utils.sheet_to_json(existingWb.Sheets[sheetList[0]]);

  _.forEach(_.keys(record), function (key) {
    if (Object.prototype.toString.call(record[key]) == '[object Array]') {
      sheets = recursiveCreateSheets(userDetails, existingWb, sheets, record, key);
    }
  });
  xlData.push(record);
  sheets[sheetList[0]] = XLSX.utils.json_to_sheet(xlData);
  return sheets;
}

function recursiveCreateSheets(userDetails, existingWb, sheets, record, key) {
  // const sheetName = parentIndex !== undefined ? parentIndex + '~' + key : key;
  const sheetName = key;
  let childXlData = _.cloneDeep(XLSX.utils.sheet_to_json(sheets[sheetName]));
  if (!childXlData || childXlData.length == 0)
    childXlData = XLSX.utils.sheet_to_json(existingWb.Sheets[sheetName]);
  if (!childXlData) childXlData = [];
  _.forEach(record[key], function (child) {
    child = addCreateRecordData(userDetails, child);
    _.forEach(_.keys(child), function (childKey) {
      if (Object.prototype.toString.call(child[childKey]) == '[object Array]') {
        sheets = recursiveCreateSheets(userDetails, existingWb, sheets, child, childKey);
      }
    });
    child.mstId = record.id;
    childXlData.push(child);
  });
  sheets[sheetName] = XLSX.utils.json_to_sheet(childXlData);
  record[key] = '[object Array]';
  return sheets;
}

function addCreateRecordData(userDetails, data) {
  data.id = new Date().getTime() + count;
  count++;
  data.version = 0;
  data.lastAction = 'create';
  data.enabled = 'Y';
  data.active = 'Y';
  data.authorized = 'N';
  data.sendToBank = 'N';
  data.sysReqStatus = 'Send-To-Bank';
  data.modifiedBy = userDetails ? userDetails.userName : 'SYSTEM';
  data.modifiedOn = userDetails ? userDetails.applicateDate : '';
  data.modifiedSysOn = moment().format('DD-MMM-YYYY HH:mm:ss');
  data.modifiedAtOU = 1;
  return data;
}

router.post('/dummyServer/**/view', (req, res) => {
  const dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  let filters = [];
  if (req.body.dataMap && req.body.dataMap.filters) {
    filters = req.body.dataMap.filters;
  } else if (req.body.filters) {
    filters = req.body.filters;
  }
  if (req.body.dataMap && req.body.dataMap.id) {
    filters.push({ name: 'id', value: req.body.dataMap.id });
  }

  const viewData = getViewData(dataXlFile, filters);

  // console.log('viewData', viewData);

  res.json({ ...viewData, responseStatus: { message: '', status: '0' } });
});

let getViewData = function (excelUrl, filters) {
  let workbook = XLSX.readFile(excelUrl);
  let sheet_name_list = workbook.SheetNames;
  let xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  let viewData = _.filter(xlData, function (o) {
    for (let i = 0; i < filters.length; i++) {
      if (o[filters[i].name] != filters[i].value) return false;
    }
    return true;
  });
  if (viewData.length > 0) {
    return recursiveView(viewData[0], workbook, viewData[0].id);
  } else return null;
};

function recursiveView(viewData, workbook, id) {
  _.forEach(_.keys(viewData), function (key) {
    if (viewData[key] == '[object Array]') {
      viewData[key] = _.filter(XLSX.utils.sheet_to_json(workbook.Sheets[key]), function (o) {
        return o.mstId == id;
      });

      _.forEach(viewData[key], function (child) {
        child = recursiveView(child, workbook, child.id);
      });
    }
  });

  return viewData;
}

router.post('/dummyServer/**/update', (req, res) => {
  const dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  if (req.body.draftId) {
    deleteRecordInExcel(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'draftData.xlsx',
      req.body.draftId,
    );
    delete req.body.draftId;
  }

  req.body.requestBy =
    req.session && req.session.userDetails?.requestBy ? req.session.userDetails?.requestBy : '';
  if (req.session && req.session.userDetails && req.session.userDetails?.requestBy == 'CORPORATE') {
    if (req.session.userDetails?.loginPreferenceDetails?.loginType == 'group') {
      req.body.groupId = req.body.groupId
        ? req.body.groupId
        : req.session?.userDetails?.loginPreferenceDetails?.groupId;
    }
    req.body.corporateId = req.body.corporateId
      ? req.body.corporateId
      : req.session?.userDetails?.corporateId;
  }

  const data = updateRecordInExcel(dataXlFile, req.body, req.session.userDetails);
  res.json({
    dataMap: { id: data.id, data },
    responseStatus: { message: 'MSG_KEY_UPDATE_SUCCESSFUL', status: '0' },
  });
});

let updateRecordInExcel = function (dataXlFile, data, userDetails) {
  let existingWb = XLSX.readFile(dataXlFile);
  let sheets = generateUpdateSheetData(userDetails, data, existingWb);
  updateWorkbook(existingWb, sheets, dataXlFile);
  return data;
};

function generateUpdateSheetData(userDetails, record, existingWb) {
  let sheets = {};
  let sheetList = existingWb.SheetNames;
  let xlData = XLSX.utils.sheet_to_json(existingWb.Sheets[sheetList[0]]);

  let updateIndex = _.findIndex(xlData, function (o) {
    return o.id == record.id;
  });
  let oldRecord = _.cloneDeep(xlData[updateIndex]);

  record = updateRecordData(userDetails, record, oldRecord);

  _.forEach(_.keys(record), function (key) {
    if (Object.prototype.toString.call(record[key]) == '[object Array]') {
      sheets = recursiveUpdateSheets(userDetails, existingWb, sheets, record, key);
    }
  });
  xlData[updateIndex] = record;
  sheets[sheetList[0]] = XLSX.utils.json_to_sheet(xlData);
  return sheets;
}

function recursiveUpdateSheets(userDetails, existingWb, sheets, record, key) {
  const sheetName = key;
  let childXlData = _.cloneDeep(XLSX.utils.sheet_to_json(sheets[sheetName]));
  if (!childXlData || childXlData.length == 0)
    childXlData = XLSX.utils.sheet_to_json(existingWb.Sheets[sheetName]);
  if (!childXlData) childXlData = [];
  let oldChilds = _.filter(childXlData, function (o) {
    return o.mstId == record.id;
  });
  let updatedIds = [];
  _.forEach(record[key], function (child) {
    if (!child.id) {
      child = addCreateRecordData(userDetails, child);
      child.mstId = record.id;
      childXlData.push(child);
    } else {
      updateChildIndex = _.findIndex(childXlData, function (o) {
        return o.id == child.id;
      });
      child = updateRecordData(userDetails, child, childXlData[updateChildIndex]);
      childXlData[updateChildIndex] = child;

      const oldChildId = _.filter(oldChilds, function (o) {
        return o.id == child.id;
      });

      if (oldChildId && oldChildId.length > 0) {
        updatedIds.push(oldChildId[0].id);
      }
    }

    _.forEach(_.keys(child), function (childKey) {
      if (Object.prototype.toString.call(child[childKey]) == '[object Array]') {
        sheets = recursiveUpdateSheets(userDetails, existingWb, sheets, child, childKey);
      }
    });
  });

  _.forEach(oldChilds, function (child) {
    if (updatedIds.indexOf(child.id) == -1) {
      childXlData.splice(
        _.findIndex(childXlData, function (o) {
          return o.id == child.id;
        }),
        1,
      );
    }
  });

  sheets[sheetName] = XLSX.utils.json_to_sheet(childXlData);
  record[key] = '[object Array]';

  return sheets;
}

function updateRecordData(userDetails, record, oldRecord) {
  record.version = parseInt(record.version) + 1;
  record.changeInfo = record.lastAction?.indexOf('create') != -1 ? '' : JSON.stringify(oldRecord);
  record.lastAction = record.lastAction?.indexOf('Authorized') == -1 ? 'create' : 'update';

  record.enabled = 'Y';
  record.active = 'Y';
  record.authorized = 'N';
  record.modifiedBy = userDetails ? userDetails.userName : 'SYSTEM';
  record.modifiedOn = userDetails ? userDetails.applicateDate : '';
  record.modifiedSysOn = moment().format('DD-MMM-YYYY HH:mm:ss');
  record.modifiedAtOU = 1;

  return record;
}

router.post('/dummyServer/**/reject', (req, res) => {
  let dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  let existingWb = XLSX.readFile(dataXlFile);

  let sheets = generateRejectSheetData(req.session.userDetails, req.body.dataMap, existingWb);
  updateWorkbook(existingWb, sheets, dataXlFile);

  res.json({ responseStatus: { message: 'MSG_KEY_REJECTION_SUCCESSFUL', status: '0' } });
});

function generateRejectSheetData(userDetails, data, existingWb) {
  let sheets = {};
  let sheetList = existingWb.SheetNames;
  _.forEach(sheetList, function (sheetName) {
    sheets[sheetName] = XLSX.utils.sheet_to_json(existingWb.Sheets[sheetName]);
  });
  let xlData = sheets[sheetList[0]];

  _.forEach(data.ids, function (id) {
    let rejectIndex = _.findIndex(xlData, function (o) {
      return o.id == id;
    });
    let record = _.cloneDeep(xlData[rejectIndex]);
    record = rejectRecordData(userDetails, record);
    record.rejectReason = data.rejectReason;
    _.forEach(_.keys(record), function (key) {
      if (record[key] == '[object Array]') {
        let childXlData = sheets[key];
        if (!childXlData) childXlData = [];
        _.forEach(childXlData, function (child, i) {
          if (child.mstId == record.id) {
            childXlData[i] = _.cloneDeep(rejectRecordData(userDetails, child));
            childXlData[i].rejectReason = data.rejectReason;
          }
        });
        sheets[key] = _.cloneDeep(childXlData);
      }
    });
    xlData[rejectIndex] = _.cloneDeep(record);
  });
  sheets[sheetList[0]] = _.cloneDeep(xlData);
  _.forEach(sheetList, function (sheetName) {
    sheets[sheetName] = XLSX.utils.json_to_sheet(sheets[sheetName]);
  });

  return sheets;
}

function rejectRecordData(userDetails, record) {
  record.version = parseInt(record.version) + 1;
  //record.changeInfo = record.lastAction.indexOf('create') != -1 ? '' : JSON.stringify(oldRecord);
  record.lastAction = record.lastAction + ' Rejected';

  //record.enabled = 'Y';
  //record.active = 'Y';
  //record.authorized = 'N';
  record.checkedBy = userDetails ? userDetails.userName : 'tovchecker';
  record.checkedOn = userDetails ? userDetails.applicateDate : '';
  record.checkedSysOn = moment().format('DD-MMM-YYYY HH:mm:ss');

  return record;
}

router.post('/dummyServer/**/authorize', (req, res) => {
  let dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  authorize(dataXlFile, req.session.userDetails, req.body, XLSX.readFile(dataXlFile));
  res.json({ responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
});

let authorize = function (dataXlFile, userDetails, reqData, Wb) {
  updateWorkbook(Wb, generateAuthorizeSheetData(userDetails, reqData.dataMap, Wb), dataXlFile);
};

function generateAuthorizeSheetData(userDetails, data, existingWb) {
  let sheets = {};
  let sheetList = existingWb.SheetNames;
  _.forEach(sheetList, function (sheetName) {
    sheets[sheetName] = XLSX.utils.sheet_to_json(existingWb.Sheets[sheetName]);
  });
  let xlData = sheets[sheetList[0]];

  _.forEach(data.ids, function (id) {
    let authorizeIndex = _.findIndex(xlData, function (o) {
      return o.id == id;
    });
    let record = _.cloneDeep(xlData[authorizeIndex]);
    record = authorizeRecordData(userDetails, record);
    _.forEach(_.keys(record), function (key) {
      if (record[key] == '[object Array]') {
        let childXlData = sheets[key];
        if (!childXlData) childXlData = [];
        _.forEach(childXlData, function (child, i) {
          if (child.mstId == record.id) {
            childXlData[i] = _.cloneDeep(authorizeRecordData(userDetails, child));
          }
        });
        sheets[key] = _.cloneDeep(childXlData);
      }
    });
    xlData[authorizeIndex] = _.cloneDeep(record);
  });
  sheets[sheetList[0]] = _.cloneDeep(xlData);
  _.forEach(sheetList, function (sheetName) {
    sheets[sheetName] = XLSX.utils.json_to_sheet(sheets[sheetName]);
  });

  return sheets;
}

function authorizeRecordData(userDetails, record) {
  record.version = parseInt(record?.version ? record.version : 0) + 1;
  record.lastAction = record.lastAction + ' Authorized';
  record.rejectReason = '';
  record.changeInfo = '';
  record.authorized = 'Y';
  record.checkedBy = userDetails ? userDetails.userName : 'tovchecker';
  record.checkedOn = userDetails ? userDetails.applicateDate : '';
  record.checkedSysOn = moment().format('DD-MMM-YYYY HH:mm:ss');

  return record;
}

router.post('/dummyServer/**/delete', (req, res) => {
  let dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  deleteRecordInExcel(dataXlFile, req.body.dataMap.id);

  res.json({ responseStatus: { message: 'MSG_KEY_DELETION_SUCCESSFUL', status: '0' } });
});

let deleteRecordInExcel = function (dataXlFile, id) {
  let existingWb = XLSX.readFile(dataXlFile);
  let sheets = generateDeleteSheetData(id, existingWb);
  updateWorkbook(existingWb, sheets, dataXlFile);
  return id;
};

router.post('/dummyServer/**/acceptReject', (req, res) => {
  let dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  let existingWb = XLSX.readFile(dataXlFile);

  let sheets = generateDeleteSheetData(req.body.dataMap.id, existingWb);
  updateWorkbook(existingWb, sheets, dataXlFile);

  res.json({ responseStatus: { message: 'MSG_KEY_REJECTION_ACCEPTED_SUCCESSFUL', status: '0' } });
});

function generateDeleteSheetData(id, existingWb) {
  let sheets = {};
  let sheetList = existingWb.SheetNames;
  _.forEach(sheetList, function (sheetName) {
    sheets[sheetName] = XLSX.utils.sheet_to_json(existingWb.Sheets[sheetName]);
  });
  let xlData = sheets[sheetList[0]];

  let deleteIndex = _.findIndex(xlData, function (o) {
    return o.id == id;
  });
  let record = xlData[deleteIndex];
  _.forEach(_.keys(record), function (key) {
    if (record[key] == '[object Array]') {
      let childXlData = sheets[key];
      if (!childXlData) childXlData = [];
      for (let i = childXlData.length - 1; i >= 0; i--) {
        if (childXlData[i].mstId == record.id) {
          if (childXlData[i].lastAction.indexOf('create') != -1) {
            childXlData.splice(i, 1);
          } else {
            childXlData[i] = JSON.parse(childXlData[i].changeInfo);
          }
        }
      }
      sheets[key] = _.cloneDeep(childXlData);
    }
  });
  if (record?.lastAction.indexOf('create') != -1) {
    xlData.splice(deleteIndex, 1);
  } else {
    xlData[deleteIndex] = JSON.parse(record.changeInfo);
  }
  sheets[sheetList[0]] = _.cloneDeep(xlData);
  _.forEach(sheetList, function (sheetName) {
    sheets[sheetName] = XLSX.utils.json_to_sheet(sheets[sheetName]);
  });

  return sheets;
}

router.post('/dummyServer/**/disable', (req, res) => {
  let dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  let existingWb = XLSX.readFile(dataXlFile);

  let sheets = generateDisableSheetData(req.session.userDetails, req.body.dataMap, existingWb);
  updateWorkbook(existingWb, sheets, dataXlFile);

  res.json({ responseStatus: { message: 'MSG_KEY_DISABLE_SUCCESSFUL', status: '0' } });
});

function generateDisableSheetData(userDetails, data, existingWb) {
  let sheets = {};
  let sheetList = existingWb.SheetNames;
  _.forEach(sheetList, function (sheetName) {
    sheets[sheetName] = XLSX.utils.sheet_to_json(existingWb.Sheets[sheetName]);
  });
  let xlData = sheets[sheetList[0]];

  let disableIndex = _.findIndex(xlData, function (o) {
    return o.id == data.id;
  });
  let record = _.cloneDeep(xlData[disableIndex]);
  record = disableRecordData(userDetails, record);
  _.forEach(_.keys(record), function (key) {
    if (record[key] == '[object Array]') {
      let childXlData = sheets[key];
      if (!childXlData) childXlData = [];
      _.forEach(childXlData, function (child, i) {
        if (child.mstId == record.id) {
          childXlData[i] = _.cloneDeep(disableRecordData(userDetails, child));
        }
      });
      sheets[key] = _.cloneDeep(childXlData);
    }
  });
  xlData[disableIndex] = _.cloneDeep(record);
  sheets[sheetList[0]] = _.cloneDeep(xlData);
  _.forEach(sheetList, function (sheetName) {
    sheets[sheetName] = XLSX.utils.json_to_sheet(sheets[sheetName]);
  });

  return sheets;
}

function disableRecordData(userDetails, record) {
  record.changeInfo = JSON.stringify(record);
  record.version = parseInt(record.version) + 1;
  record.lastAction = 'disable';
  record.enabled = 'N';
  record.rejectReason = '';
  record.authorized = 'Y';
  record.modifiedBy = userDetails ? userDetails.userName : 'SYSTEM';
  record.modifiedOn = userDetails ? userDetails.applicateDate : '';
  record.modifiedSysOn = moment().format('DD-MMM-YYYY HH:mm:ss');

  return record;
}

router.post('/dummyServer/**/enable', (req, res) => {
  let dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  let existingWb = XLSX.readFile(dataXlFile);

  let sheets = generateEnableSheetData(req.session.userDetails, req.body.dataMap, existingWb);
  updateWorkbook(existingWb, sheets, dataXlFile);

  res.json({ responseStatus: { message: 'MSG_KEY_ENABLE_SUCCESSFUL', status: '0' } });
});

function generateEnableSheetData(userDetails, data, existingWb) {
  let sheets = {};
  let sheetList = existingWb.SheetNames;
  _.forEach(sheetList, function (sheetName) {
    sheets[sheetName] = XLSX.utils.sheet_to_json(existingWb.Sheets[sheetName]);
  });
  let xlData = sheets[sheetList[0]];

  let enableIndex = _.findIndex(xlData, function (o) {
    return o.id == data.id;
  });
  let record = _.cloneDeep(xlData[enableIndex]);
  record = enableRecordData(userDetails, record);
  _.forEach(_.keys(record), function (key) {
    if (record[key] == '[object Array]') {
      let childXlData = sheets[key];
      if (!childXlData) childXlData = [];
      _.forEach(childXlData, function (child, i) {
        if (child.mstId == record.id) {
          childXlData[i] = _.cloneDeep(enableRecordData(userDetails, child));
        }
      });
      sheets[key] = _.cloneDeep(childXlData);
    }
  });
  xlData[enableIndex] = _.cloneDeep(record);
  sheets[sheetList[0]] = _.cloneDeep(xlData);
  _.forEach(sheetList, function (sheetName) {
    sheets[sheetName] = XLSX.utils.json_to_sheet(sheets[sheetName]);
  });

  return sheets;
}

function enableRecordData(userDetails, record) {
  record.changeInfo = JSON.stringify(record);
  record.version = parseInt(record.version) + 1;
  record.lastAction = 'enable';
  record.enabled = 'Y';
  record.rejectReason = '';
  record.authorized = 'Y';
  record.modifiedBy = userDetails ? userDetails.userName : 'SYSTEM';
  record.modifiedOn = userDetails ? userDetails.applicateDate : '';
  record.modifiedSysOn = moment().format('DD-MMM-YYYY HH:mm:ss');

  return record;
}

router.post('/dummyServer/**/updateFavorite', (req, res) => {
  console.log('Updatating Favorite for : ' + req.url);
  let dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  let existingWb = XLSX.readFile(dataXlFile);
  let xlData = XLSX.utils.sheet_to_json(existingWb.Sheets['Sheet1']);
  _.forEach(xlData, function (r) {
    if (r.id == req.body.dataMap.id) {
      let markedIds = [];
      if (!r.markedFavoriteForUserIds) markedIds = [];
      else markedIds = r.markedFavoriteForUserIds.split(',');

      if (req.body.dataMap.isFavorite == 'Y') {
        markedIds.push(req.body.dataMap.userId);
      } else {
        markedIds.splice(markedIds.indexOf(req.body.dataMap.userId), 1);
      }
      r.markedFavoriteForUserIds = markedIds.join(',');
    }
  });

  let sheets = { Sheet1: xlData };
  _.forEach(existingWb.SheetNames, function (sheetName) {
    if (sheetName !== 'Sheet1')
      sheets[sheetName] = XLSX.utils.sheet_to_json(existingWb.Sheets[sheetName]);
  });
  let wb = XLSX.utils.book_new();
  _.forEach(existingWb.SheetNames, function (sheetName) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheets[sheetName]), sheetName);
  });
  XLSX.writeFile(wb, dataXlFile);

  res.json({ responseStatus: { message: '', status: '0' }, entityIdentifier: '', loggable: false });
});

router.post('/dummyServer/**/createDraft', (req, res) => {
  const dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'draftData.xlsx';

  req.body.requestBy =
    req.session && req.session.userDetails?.requestBy ? req.session.userDetails?.requestBy : '';
  if (req.session && req.session.userDetails && req.session.userDetails?.requestBy == 'CORPORATE') {
    if (req.session.userDetails?.loginPreferenceDetails?.loginType == 'group') {
      req.body.groupId = req.body.groupId
        ? req.body.groupId
        : req.session?.userDetails?.loginPreferenceDetails?.groupId;
      req.body.groupId = parseInt(req.body.groupId.toString());
    }
    req.body.corporateId = req.body.corporateId
      ? req.body.corporateId
      : req.session?.userDetails?.corporateId;
    req.body.corporateId = parseInt(req.body.corporateId.toString());
  }

  const data = addRecordInExcel(dataXlFile, req.body, req.session.userDetails);
  res.json({
    dataMap: { id: data.id },
    responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
  });
});

router.post('/dummyServer/**/viewDraft', (req, res) => {
  const dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'draftData.xlsx';
  let filters = [];
  if (req.body.dataMap && req.body.dataMap.filters) {
    filters = req.body.dataMap.filters;
  } else if (req.body.filters) {
    filters = req.body.filters;
  }
  if (req.body.dataMap && req.body.dataMap.id) {
    filters.push({ name: 'id', value: req.body.dataMap.id });
  }
  res.json({ ...getViewData(dataXlFile, filters), responseStatus: { message: '', status: '0' } });
});

router.post('/dummyServer/**/updateDraft', (req, res) => {
  const dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'draftData.xlsx';
  const data = updateRecordInExcel(dataXlFile, req.body, req.session.userDetails);

  res.json({
    dataMap: { id: data.id },
    responseStatus: { message: 'MSG_KEY_UPDATE_SUCCESSFUL', status: '0' },
  });
});

router.post('/dummyServer/**/deleteDraft', (req, res) => {
  const dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'draftData.xlsx';
  console.log('draftDelete', req.body);
  deleteRecordInExcel(dataXlFile, req.body.dataMap.id);

  res.json({ responseStatus: { message: 'MSG_KEY_DELETION_SUCCESSFUL', status: '0' } });
});

router.post('/dummyServer/**/createTemplate', (req, res) => {
  const dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'templateData.xlsx';

  req.body.requestBy =
    req.session && req.session.userDetails?.requestBy ? req.session.userDetails?.requestBy : '';
  if (req.session && req.session.userDetails && req.session.userDetails?.requestBy == 'CORPORATE') {
    if (req.session.userDetails?.loginPreferenceDetails?.loginType == 'group') {
      req.body.groupId = req.body.groupId
        ? req.body.groupId
        : req.session?.userDetails?.loginPreferenceDetails?.groupId;
      req.body.groupId = parseInt(req.body.groupId.toString());
    }
    req.body.corporateId = req.body.corporateId
      ? req.body.corporateId
      : req.session?.userDetails?.corporateId;
    req.body.corporateId = parseInt(req.body.corporateId.toString());
  }

  const data = addRecordInExcel(dataXlFile, req.body, req.session.userDetails);
  res.json({
    dataMap: { id: data.id },
    responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
  });
});

router.post('/dummyServer/**/viewTemplate', (req, res) => {
  const dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'templateData.xlsx';
  let filters = [];
  if (req.body.dataMap && req.body.dataMap.filters) {
    filters = req.body.dataMap.filters;
  } else if (req.body.filters) {
    filters = req.body.filters;
  }
  if (req.body.dataMap && req.body.dataMap.id) {
    filters.push({ name: 'id', value: req.body.dataMap.id });
  }
  res.json({ ...getViewData(dataXlFile, filters), responseStatus: { message: '', status: '0' } });
});

router.post('/dummyServer/**/updateTemplate', (req, res) => {
  const dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'templateData.xlsx';
  const data = updateRecordInExcel(dataXlFile, req.body, req.session.userDetails);

  res.json({
    dataMap: { id: data.id },
    responseStatus: { message: 'MSG_KEY_UPDATE_SUCCESSFUL', status: '0' },
  });
});

router.post('/dummyServer/**/deleteTemplate', (req, res) => {
  const dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'templateData.xlsx';

  deleteRecordInExcel(dataXlFile, req.body.dataMap.id);

  res.json({ responseStatus: { message: 'MSG_KEY_DELETION_SUCCESSFUL', status: '0' } });
});

module.exports = {
  router: router,
  authorize: authorize,
  getViewData: getViewData,
  addRecordInExcel: addRecordInExcel,
  updateRecordInExcel: updateRecordInExcel,
  deleteRecordInExcel: deleteRecordInExcel,
  updateWorkbook: updateWorkbook,
  generateAuthorizeSheetData: generateAuthorizeSheetData,
  generateDisableSheetData: generateDisableSheetData,
  generateRejectSheetData: generateRejectSheetData,
  generateUpdateSheetData: generateUpdateSheetData,

  getCorporateData: getCorporateData,
};
