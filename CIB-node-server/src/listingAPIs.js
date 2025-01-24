const fs = require('fs');
var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var router = express.Router();
var FakeServer = require('./fakeServer').FakeServer;

const masterSheet = JSON.parse(fs.readFileSync('./src/sheetDetailsByEntityName.json', 'utf8'));
const showDownloadBtnEntityList = JSON.parse(fs.readFileSync('./src/showDownloadBtnEntityList.json', 'utf8'));

router.post('/dummyServer/**/get*AllCount', (req, res) => {
  var workbook = XLSX.readFile(
    '.' + req.url.substring(0, req.url.indexOf('private')) + 'listingTypes.xlsx',
  );
  console.log(
    'getAllCount : ' + '.' + req.url.substring(0, req.url.indexOf('private')) + 'listingTypes.xlsx',
  );

  var response = {};
  response.dataList = XLSX.utils.sheet_to_json(workbook.Sheets['listingTypes']);
  const defaultReqModel = {
    startRow: 0,
    endRow: 10000,
    rowGroupCols: [],
    valueCols: [],
    pivotCols: [],
    pivotMode: false,
    groupKeys: [],
    filterModel: {},
    sortModel: [],
    entityName: '',
  };
  response.dataList.forEach((list) => {
    delete list.checkboxSelection;
    let dataFileUrl = list.serviceUrl
      ? './dummyServer/json/' + list.serviceUrl
      : '.' + req.url.substring(0, req.url.indexOf('private'));
    if (list.rowDataUrl == 'getPendingList') {
      list.count = getPendingListRecords(
        dataFileUrl + '/data.xlsx',
        defaultReqModel,
        req.session.userDetails,
      ).lastRow;
    } else if (list.rowDataUrl == 'getAuthorizedList') {
      list.count = getAuthorizedListRecords(
        dataFileUrl + '/data.xlsx',
        defaultReqModel,
        req.session.userDetails,
      ).lastRow;
    } else if (list.rowDataUrl == 'getRejectedList') {
      list.count = getRejectedListRecords(
        dataFileUrl + '/data.xlsx',
        defaultReqModel,
        req.session.userDetails,
      ).lastRow;
    } else if (list.rowDataUrl == 'getDisabledList') {
      list.count = getDisabledListRecords(
        dataFileUrl + '/data.xlsx',
        defaultReqModel,
        req.session.userDetails,
      ).lastRow;
    }
  });
  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
  res.json(response);
});

router.post('/dummyServer/**/get*ColDefs', (req, res) => {
  var workbook = XLSX.readFile(
    '.' + req.url.substring(0, req.url.indexOf('private')) + 'listingTypes.xlsx',
  );
  console.log(
    'getColDefs : ' +
      req.body.dataMap.listType +
      ' : ' +
      '.' +
      req.url.substring(0, req.url.indexOf('private')) +
      'listingTypes.xlsx',
  );

  var response = {};
  var listTypes = XLSX.utils.sheet_to_json(workbook.Sheets['listingTypes']);
  var listType = _.find(listTypes, function (o) {
    return o.code == req.body.dataMap.listType;
  });
  var allColumns = XLSX.utils.sheet_to_json(workbook.Sheets['columns']);
  response.columnDefs = _.filter(allColumns, function (o) {
    return o.applicableListings && o.applicableListings.indexOf(req.body.dataMap.listType) != -1;
  });

  if (req.session.userDetails?.loginPreferenceDetails?.loginType == 'group') {
    const i = response.columnDefs.findIndex(
      (col) => col.field == 'corporateCode' && col.headerName == 'Corporate Code',
    );

    if (i >= 0) {
      response.columnDefs.splice(i, 1);
    }

    response.columnDefs.unshift(
      {
        headerName: 'Corporate Code',
        field: 'corporateCode',
        hide: 'false',
        lockVisible: 'false',
      },
      {
        headerName: 'Corporate Name',
        field: 'corporateName',
        hide: 'false',
        lockVisible: 'false',
      },
    );
  }

  var checkBoxSelectionAdded = false;
  response.columnDefs.forEach((coldef) => {
    delete coldef.applicableListings;
    if (
      listType.checkboxSelection == 'true' &&
      coldef.hide == 'false' &&
      coldef.lockVisible == 'false' &&
      !checkBoxSelectionAdded
    ) {
      coldef.checkboxSelection = true;
      coldef.headerCheckboxSelection = true;
      checkBoxSelectionAdded = true;
    }
    /* if(coldef.filter == true) {
      coldef.filter = ''
    } */
  });

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
  res.json(response);
});

router.post('/dummyServer/**/get*ActiveList', (req, res) => {
  res.json(
    getActiveListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    ),
  );
});

var getActiveListRecords = function (dataFilePath, reqModel, userDetails) {
  console.log('getActiveListRecords : ' + dataFilePath);
  var workbook = XLSX.readFile(dataFilePath);
  const sheetName = masterSheet[reqModel.entityName] ? masterSheet[reqModel.entityName] : 'Sheet1';

  var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  setSortCondition(reqModel, userDetails, excelData);

  var fakeServer = FakeServer(excelData);
  if (!reqModel.filterModel) reqModel.filterModel = {};
  reqModel.filterModel.enabled = { filterType: 'text', type: 'equals', filter: 'Y' };

  var response = fakeServer.getData(reqModel);

  _.forEach(response.data, function (row) {
    row.actions = [
      {
        index: 1,
        displayName: 'View',
        type: 'ICON',
        icon: 'pi pi-eye',
        url: 'route~view',
        methodName: 'view',
        paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
        color: null,
      },
    ];

    if (!row.requestBy || row.requestBy == userDetails.requestBy) {
      row.actions.push(
        {
          index: 2,
          displayName: 'Edit',
          type: 'ICON',
          icon: 'pi pi-pencil',
          url: 'route~edit',
          methodName: 'edit',
          paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
          color: 'primary',
        },
        {
          index: 6,
          displayName: 'Disable',
          type: 'ICON',
          icon: 'pi pi-lock',
          url: 'private/disable',
          methodName: 'disable',
          paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
          color: 'warn',
        },
      );
    }
    if (showDownloadBtnEntityList.includes(reqModel.entityName)) {
      row.actions.push({
        index: 2,
        displayName: 'Download',
        type: 'ICON',
        methodName: 'onDownload',
        icon: 'fa-file-download',
        paramList: 'id',
        color: 'primary',
      })
      }
  });

  response.data = response.data.sort((a, b) => {
    return b?.id - a?.id;
  });

  

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
  return response;
};

router.post('/dummyServer/**/get*PendingList', (req, res) => {
  res.json(
    getPendingListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    ),
  );
});

var getPendingListRecords = function (dataFilePath, reqModel, userDetails) {
  console.log('getPendingListRecords : ' + dataFilePath);
  var workbook = XLSX.readFile(dataFilePath);
  const sheetName = masterSheet[reqModel.entityName] ? masterSheet[reqModel.entityName] : 'Sheet1';

  console.log('Reading Sheet Name : ' + sheetName);
  var fakeServer = FakeServer(XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]));
  if (!reqModel.sortModel) reqModel.sortModel = [];
  if (reqModel.sortModel.length == 0)
    reqModel.sortModel.push({ sort: 'desc', colId: 'modifiedSysOn' });
  if (!reqModel.filterModel) reqModel.filterModel = {};
  if (
    userDetails?.loginPreferenceDetails &&
    userDetails?.loginPreferenceDetails?.loginType == 'group'
  ) {
    reqModel.filterModel.groupId = {
      filterType: 'number',
      type: 'equals',
      filter: userDetails?.loginPreferenceDetails?.groupId,
    };
  }
  if (
    userDetails?.loginPreferenceDetails &&
    userDetails?.loginPreferenceDetails?.loginType != 'group'
  ) {
    reqModel.filterModel.corporateId = {
      filterType: 'number',
      type: 'equals',
      filter: userDetails?.corporateId,
    };
  }
  reqModel.filterModel.authorized = { filterType: 'text', type: 'equals', filter: 'N' };
  reqModel.filterModel.lastAction = { filterType: 'text', type: 'notContains', filter: 'Rejected' };

  var response = fakeServer.getData(reqModel);
  _.forEach(response.data, function (row) {
    row.actions = [
      {
        index: 1,
        displayName: 'View',
        type: 'ICON',
        icon: 'pi pi-eye',
        url: 'route~view',
        methodName: 'view',
        paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
        color: null,
      }
    ];

    if (!row.requestBy || row.requestBy == userDetails.requestBy) {
      row.actions.push(
        {
          index: 2,
          displayName: 'Edit',
          type: 'ICON',
          icon: 'pi pi-pencil',
          url: 'route~edit',
          methodName: 'edit',
          paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
          color: 'primary',
        },
        {
          index: 5,
          displayName: 'Delete',
          type: 'ICON',
          icon: 'pi pi-trash',
          url: 'private/delete',
          methodName: 'delete',
          paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
          color: 'warn',
        },
      );

      if (row.modifiedBy != userDetails.userName) {
        row.actions.unshift({
          index: 4,
          displayName: 'Reject',
          type: 'ICON',
          icon: 'pi pi-times',
          url: 'private/reject',
          methodName: 'reject',
          paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
          color: 'warn',
        });
        row.actions.unshift({
          index: 3,
          displayName: 'Authorize',
          type: 'ICON',
          icon: 'pi pi-check',
          url: 'private/authorize',
          methodName: 'authorize',
          paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
          color: 'green',
        });
      }

      if (showDownloadBtnEntityList.includes(reqModel.entityName)) {
        row.actions.push({
          index: 2,
          displayName: 'Download',
          type: 'ICON',
          methodName: 'onDownload',
          icon: 'fa-file-download',
          paramList: 'id',
          color: 'primary',
        })
        }


    }
  });

  response.data = response.data.sort((a, b) => {
    return b?.id - a?.id;
  });

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
  return response;
};

function setSortCondition(reqModel, userDetails, excelData) {
  excelData.forEach((row) => {
    if (
      row.markedFavoriteForUserIds &&
      row.markedFavoriteForUserIds.indexOf(userDetails.userName) != -1
    )
      row.isFavorite = 'Y';
    else row.isFavorite = 'N';
  });
  if (
    reqModel.sortModel &&
    reqModel.sortModel.length > 0 &&
    _.filter(reqModel.sortModel, function (m) {
      return m.colId == 'isFavorite';
    }).length > 0
  ) {
    return;
  }
  if (reqModel.sortModel.length == 0)
    reqModel.sortModel.push({ sort: 'desc', colId: 'modifiedSysOn' });

  reqModel.sortModel.unshift({ sort: 'desc', colId: 'isFavorite' });
}

router.post('/dummyServer/**/get*AuthorizedList', (req, res) => {
  res.json(
    getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    ),
  );
});

var getAuthorizedListRecords = function (dataFilePath, reqModel, userDetails) {
  console.log('getAuthorizedListRecords : ' + dataFilePath);
  var workbook = XLSX.readFile(dataFilePath);
  const sheetName = masterSheet[reqModel.entityName] ? masterSheet[reqModel.entityName] : 'Sheet1';

  var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  setSortCondition(reqModel, userDetails, excelData);

  var fakeServer = FakeServer(excelData);
  if (!reqModel.filterModel) reqModel.filterModel = {};
  if (
    userDetails?.loginPreferenceDetails &&
    userDetails?.loginPreferenceDetails?.loginType == 'group'
  ) {
    reqModel.filterModel.groupId = {
      filterType: 'number',
      type: 'equals',
      filter: userDetails?.loginPreferenceDetails?.groupId,
    };
  }
  if (
    userDetails?.loginPreferenceDetails &&
    userDetails?.loginPreferenceDetails?.loginType != 'group'
  ) {
    reqModel.filterModel.corporateId = {
      filterType: 'number',
      type: 'equals',
      filter: userDetails?.corporateId,
    };
  }
  reqModel.filterModel.enabled = { filterType: 'text', type: 'equals', filter: 'Y' };
  reqModel.filterModel.authorized = { filterType: 'text', type: 'equals', filter: 'Y' };

  var response = fakeServer.getData(reqModel);

  _.forEach(response.data, function (row) {
    row.actions = [
      {
        index: 1,
        displayName: 'View',
        type: 'ICON',
        icon: 'pi pi-eye',
        url: 'route~view',
        methodName: 'view',
        paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
        color: null,
      },
    ];

    if (!row.requestBy || row.requestBy == userDetails.requestBy) {
      row.actions.push(
        {
          index: 2,
          displayName: 'Edit',
          type: 'ICON',
          icon: 'pi pi-pencil',
          url: 'route~edit',
          methodName: 'edit',
          paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
          color: 'primary',
        },
        {
          index: 6,
          displayName: 'Disable',
          type: 'ICON',
          icon: 'pi pi-lock',
          url: 'private/disable',
          methodName: 'disable',
          paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
          color: 'warn',
        },
      );
    }
    if (showDownloadBtnEntityList.includes(reqModel.entityName)) {
      row.actions.push({
        index: 2,
        displayName: 'Download',
        type: 'ICON',
        methodName: 'onDownload',
        icon: 'fa-file-download',
        paramList: 'id',
        color: 'primary',
      })
      }
  });



  response.data = response.data.sort((a, b) => {
    return b?.id - a?.id;
  });

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
  return response;
};

router.post('/dummyServer/**/get*RejectedList', (req, res) => {
  res.json(
    getRejectedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    ),
  );
});

var getRejectedListRecords = function (dataFilePath, reqModel, userDetails) {
  console.log('getRejectedListRecords : ' + dataFilePath);
  var workbook = XLSX.readFile(dataFilePath);
  const sheetName = masterSheet[reqModel.entityName] ? masterSheet[reqModel.entityName] : 'Sheet1';

  var fakeServer = FakeServer(XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]));
  if (reqModel.sortModel.length == 0)
    reqModel.sortModel.push({ sort: 'desc', colId: 'modifiedSysOn' });
  if (!reqModel.filterModel) reqModel.filterModel = {};
  if (
    userDetails?.loginPreferenceDetails &&
    userDetails?.loginPreferenceDetails?.loginType == 'group'
  ) {
    reqModel.filterModel.groupId = {
      filterType: 'number',
      type: 'equals',
      filter: userDetails?.loginPreferenceDetails?.groupId,
    };
  }
  if (
    userDetails?.loginPreferenceDetails &&
    userDetails?.loginPreferenceDetails?.loginType != 'group'
  ) {
    reqModel.filterModel.corporateId = {
      filterType: 'number',
      type: 'equals',
      filter: userDetails?.corporateId,
    };
  }
  reqModel.filterModel.lastAction = { filterType: 'text', type: 'contains', filter: 'Rejected' };
  var response = fakeServer.getData(reqModel);
  _.forEach(response.data, function (row) {
    row.actions = [
      {
        index: 1,
        displayName: 'View',
        type: 'ICON',
        icon: 'pi pi-eye',
        url: 'route~view',
        methodName: 'view',
        paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
        color: null,
      },
    ];

    if (!row.requestBy || row.requestBy == userDetails.requestBy) {
      if (row.modifiedBy == userDetails.userName) {
        row.actions.push({
          index: 8,
          displayName: 'Resubmit',
          type: 'ICON',
          icon: 'pi pi-send',
          url: 'route~resubmit',
          methodName: 'resubmit',
          paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
          color: 'primary',
        });

        row.actions.push({
          index: 9,
          displayName: 'Accept Reject',
          type: 'ICON',
          icon: 'pi pi-check-circle',
          url: 'private/acceptReject',
          methodName: 'acceptReject',
          paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
          color: 'warn',
        });
      }


    }
  });

  response.data = response.data.sort((a, b) => {
    return b?.id - a?.id;
  });

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
  return response;
};

router.post('/dummyServer/**/get*DisabledList', (req, res) => {
  res.json(
    getDisabledListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    ),
  );
});

var getDisabledListRecords = function (dataFilePath, reqModel, userDetails) {
  console.log('getDisabledListRecords : ' + dataFilePath);
  var workbook = XLSX.readFile(dataFilePath);
  const sheetName = masterSheet[reqModel.entityName] ? masterSheet[reqModel.entityName] : 'Sheet1';

  var fakeServer = FakeServer(XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]));
  if (reqModel.sortModel.length == 0)
    reqModel.sortModel.push({ sort: 'desc', colId: 'modifiedSysOn' });
  if (!reqModel.filterModel) reqModel.filterModel = {};
  if (
    userDetails?.loginPreferenceDetails &&
    userDetails?.loginPreferenceDetails?.loginType == 'group'
  ) {
    reqModel.filterModel.groupId = {
      filterType: 'number',
      type: 'equals',
      filter: userDetails?.loginPreferenceDetails?.groupId,
    };
  }
  if (
    userDetails?.loginPreferenceDetails &&
    userDetails?.loginPreferenceDetails?.loginType != 'group'
  ) {
    reqModel.filterModel.corporateId = {
      filterType: 'number',
      type: 'equals',
      filter: userDetails?.corporateId,
    };
  }
  reqModel.filterModel.enabled = { filterType: 'text', type: 'equals', filter: 'N' };
  reqModel.filterModel.authorized = { filterType: 'text', type: 'equals', filter: 'Y' };
  var response = fakeServer.getData(reqModel);
  _.forEach(response.data, function (row) {
    row.actions = [
      {
        index: 1,
        displayName: 'View',
        type: 'ICON',
        icon: 'pi pi-eye',
        url: 'route~view',
        methodName: 'view',
        paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
        color: null,
      },
    ];

    if (!row.requestBy || row.requestBy == userDetails.requestBy) {
      row.actions.push(
        {
          index: 2,
          displayName: 'Edit',
          type: 'ICON',
          icon: 'pi pi-pencil',
          url: 'route~edit',
          methodName: 'edit',
          paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
          color: 'primary',
        },
        {
          index: 7,
          displayName: 'Enable',
          type: 'ICON',
          icon: 'pi pi-lock-open',
          url: 'private/enable',
          methodName: 'enable',
          paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
          color: 'primary',
        },
      );
    }
  });

  response.data = response.data.sort((a, b) => {
    return b?.id - a?.id;
  });

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
  return response;
};

router.post('/dummyServer/**/get*AllList', (req, res) => {
  res.json(
    getAllListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    ),
  );
});

var getAllListRecords = function (dataFilePath, reqModel, userDetails) {
  var workbook = XLSX.readFile(dataFilePath);
  const sheetName = masterSheet[reqModel.entityName] ? masterSheet[reqModel.entityName] : 'Sheet1';

  var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  setSortCondition(reqModel, userDetails, excelData);

  var fakeServer = FakeServer(excelData);
  if (!reqModel.filterModel) reqModel.filterModel = {};
  if (
    userDetails?.loginPreferenceDetails &&
    userDetails?.loginPreferenceDetails?.loginType == 'group'
  ) {
    reqModel.filterModel.groupId = {
      filterType: 'number',
      type: 'equals',
      filter: userDetails?.loginPreferenceDetails?.groupId,
    };
  }
  if (
    userDetails?.loginPreferenceDetails &&
    userDetails?.loginPreferenceDetails?.loginType != 'group'
  ) {
    reqModel.filterModel.corporateId = {
      filterType: 'number',
      type: 'equals',
      filter: userDetails?.corporateId,
    };
  }
  var response = fakeServer.getData(reqModel);
  _.forEach(response.data, function (row) {
    row.actions = [
      {
        index: 1,
        displayName: 'View',
        type: 'ICON',
        icon: 'pi pi-eye',
        url: 'route~view',
        methodName: 'view',
        paramList: sheetName == 'Sheet1' ? 'id' : 'mstId',
        color: null,
      },
    ];
  });

  response.data = response.data.sort((a, b) => {
    return b?.id - a?.id;
  });

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
  return response;
};

router.post('/dummyServer/**/getDraftList', (req, res) => {
  res.json(
    getDraftListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'draftData.xlsx',
      req.body,
      req.session.userDetails,
    ),
  );
});

const getDraftListRecords = function (dataFilePath, reqModel, userDetails) {
  console.log('getDraftListRecords : ' + dataFilePath);

  const workbook = XLSX.readFile(dataFilePath);

  const fakeServer = FakeServer(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));

  if (!reqModel.sortModel) reqModel.sortModel = [];
  if (reqModel.sortModel.length == 0)
    reqModel.sortModel.push({ sort: 'desc', colId: 'modifiedSysOn' });
  if (!reqModel.filterModel) reqModel.filterModel = {};
  if (
    userDetails?.loginPreferenceDetails &&
    userDetails?.loginPreferenceDetails?.loginType == 'group'
  ) {
    reqModel.filterModel.groupId = {
      filterType: 'number',
      type: 'equals',
      filter: userDetails?.loginPreferenceDetails?.groupId,
    };
  }
  if (
    userDetails?.loginPreferenceDetails &&
    userDetails?.loginPreferenceDetails?.loginType != 'group'
  ) {
    reqModel.filterModel.corporateId = {
      filterType: 'number',
      type: 'equals',
      filter: userDetails?.corporateId,
    };
  }

  const response = fakeServer.getData(reqModel);

  _.forEach(response.data, function (row) {
    row.actions = [
      {
        index: 1,
        displayName: 'USE',
        type: 'BUTTON',
        icon: '',
        url: '',
        methodName: 'useDraft',
        paramList: 'id',
        color: 'primary',
      },
    ];

    if (!row.requestBy || row.requestBy == userDetails.requestBy) {
      row.actions.push({
        index: 2,
        displayName: 'Delete',
        type: 'ICON',
        icon: 'pi pi-trash',
        url: '',
        methodName: 'deleteDraft',
        paramList: 'id',
        color: 'warn',
      });
    }
  });

  response.data = response.data.sort((a, b) => {
    return b?.id - a?.id;
  });

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  return response;
};

router.post('/dummyServer/**/getTemplateList', (req, res) => {
  res.json(
    getTemplatetListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'templateData.xlsx',
      req.body,
      req.session.userDetails,
    ),
  );
});

const getTemplatetListRecords = function (dataFilePath, reqModel, userDetails) {
  var workbook = XLSX.readFile(dataFilePath);
  var fakeServer = FakeServer(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
  if (!reqModel.sortModel) {
    reqModel.sortModel = [];
  }
  if (reqModel.sortModel.length == 0)
    reqModel.sortModel.push({ sort: 'desc', colId: 'modifiedSysOn' });
  if (!reqModel.filterModel) reqModel.filterModel = {};
  if (
    userDetails.loginPreferenceDetails &&
    userDetails.loginPreferenceDetails?.loginType == 'group'
  ) {
    reqModel.filterModel.groupId = {
      filterType: 'number',
      type: 'equals',
      filter: userDetails.loginPreferenceDetails?.groupId,
    };
  }
  if (
    userDetails.loginPreferenceDetails &&
    userDetails.loginPreferenceDetails?.loginType != 'group'
  ) {
    reqModel.filterModel.corporateId = {
      filterType: 'number',
      type: 'equals',
      filter: userDetails.corporateId,
    };
  }
  var response = fakeServer.getData(reqModel);
  _.forEach(response.data, function (row, i) {
    row.actions = [
      {
        index: 1,
        onClick: 'id',
        displayName: 'USE THIS',
        methodName: 'useTemplate',
        paramList: 'id',
        type: 'BUTTON',
        class: 'p-button-text p-button-sm',
      },
    ];

    if (!row.requestBy || row.requestBy == userDetails.requestBy) {
      row.actions.push({
        index: 2,
        displayName: 'Delete',
        type: 'ICON',
        icon: 'pi pi-trash',
        url: '',
        methodName: 'deleteTemplate',
        paramList: 'id',
        color: 'warn',
      });
    }
  });
  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
  return response;
};

module.exports = {
  router: router,
  getActiveListRecords: getActiveListRecords,
  getPendingListRecords: getPendingListRecords,
  getAuthorizedListRecords: getAuthorizedListRecords,
  getAllListRecords: getAllListRecords,
  getRejectedListRecords: getRejectedListRecords,
  getDisabledListRecords: getDisabledListRecords,
  getDraftListRecords: getDraftListRecords,
  getTemplatetListRecords: getTemplatetListRecords,
};
