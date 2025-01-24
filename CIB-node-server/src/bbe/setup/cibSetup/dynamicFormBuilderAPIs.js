var express = require('express');
var XLSX = require('xlsx');
var fs = require('fs');
var _ = require('lodash');
var authorize = require('../../../crudAPIs').authorize;
var getViewData = require('../../../crudAPIs').getViewData;
var updateWorkbook = require('../../../crudAPIs').updateWorkbook;
var router = express.Router();

router.post(
  '/dummyServer/json/setup/cibSetup/dynamicFormBuilder/private/getProductList',
  (req, res) => {
    let workbook = XLSX.readFile(
      './dummyServer/json/commons/menuService/' +
        (req.body.dataMap.isForAdminPortal ? 'bankMenus' : 'corporateMenus') +
        '.xlsx',
    );
    let mainMenus = XLSX.utils.sheet_to_json(workbook.Sheets['modules']);

    var dataList = [];
    _.forEach(mainMenus, function (menu) {
      dataList.push({
        id: menu.moduleId,
        displayName: menu.moduleName,
        enrichments: {
          icon: menu.icon,
        },
      });
    });
    res.json({
      dataList: dataList,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

router.post(
  '/dummyServer/json/setup/cibSetup/dynamicFormBuilder/private/getParentMenuList',
  (req, res) => {
    let workbook = XLSX.readFile(
      './dummyServer/json/commons/menuService/' +
        (req.body.dataMap.isForAdminPortal ? 'bankMenus' : 'corporateMenus') +
        '.xlsx',
    );
    let menus = XLSX.utils.sheet_to_json(workbook.Sheets['menus']);
    menus = _.filter(menus, function (menu) {
      return menu.isParentMenu && menu.moduleId == req.body.dataMap.moduleId;
    });

    var dataList = [];
    _.forEach(menus, function (menu) {
      dataList.push({
        id: menu.id,
        displayName: menu.displayName,
        enrichments: {
          isDynamicFormApplicable: menu.isDynamicFormApplicable,
        },
      });
    });
    res.json({
      dataList: dataList,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

router.post(
  '/dummyServer/json/setup/cibSetup/dynamicFormBuilder/private/getChildMenuList',
  (req, res) => {
    let workbook = XLSX.readFile(
      './dummyServer/json/commons/menuService/' +
        (req.body.dataMap.isForAdminPortal ? 'bankMenus' : 'corporateMenus') +
        '.xlsx',
    );
    let menus = XLSX.utils.sheet_to_json(workbook.Sheets['menus']);
    menus = _.filter(menus, function (menu) {
      return !menu.isParentMenu && menu.parentMenuId == req.body.dataMap.parentMenuId;
    });

    var dataList = [];
    _.forEach(menus, function (menu) {
      dataList.push({
        id: menu.id,
        displayName: menu.displayName,
        enrichments: {
          isDynamicFormApplicable: menu.isDynamicFormApplicable,
        },
      });
    });
    res.json({
      dataList: dataList,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

router.post('/dummyServer/json/setup/cibSetup/dynamicFormBuilder/private/authorize', (req, res) => {
  var fbFilePath = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  _.forEach(req.body.dataMap.ids, function (recordId) {
    let record = getViewData(fbFilePath, [{ name: 'id', value: recordId }]);
    let menusWb = XLSX.readFile(
      './dummyServer/json/commons/menuService/' +
        (record.isForAdminPortal ? 'bankMenus.xlsx' : 'corporateMenus.xlsx'),
    );
    let menus = XLSX.utils.sheet_to_json(menusWb.Sheets['menus']);
    let isMenusUpdated = false;
    // delete menu entry
    if (['update', 'disable'].includes(record.lastAction) && record.isFullMaster) {
      const menuIndex = _.findIndex(menus, function (menu) {
        return menu.id == record.menuId;
      });
      if (menuIndex != -1) {
        menus.splice(menuIndex, 1);
        isMenusUpdated = true;
      }
      // remove role right if config changed
      if (['update'].includes(record.lastAction) && record.isFullMaster) {
        revokeRoleRights(record);
      }
    }
    // create Parent Menu
    if (
      ['create', 'update', 'enable'].includes(record.lastAction) &&
      record.isFullMaster &&
      !record.isExistingParentMenu
    ) {
      let parentMenu = {
        id: getMenuId(menus, 'moduleId', record.moduleId),
        isParentMenu: true,
        parentMenuId: '0',
        moduleId: record.moduleId,
        moduleName: record.moduleName,
        menuCategory: 'Dynamic',
        displayName: record.parentMenu,
        entityName: record.moduleName.toUpperCase() + record.parentMenu.toUpperCase(),
        serviceUrl: '-',
        linkIds: '-',
        isViewApplicable: record.isViewApplicable,
        isDataEntryApplicable: record.isDataEntryApplicable,
        isAuthorizeApplicable: record.isAuthorizeApplicable,
        isEnableDisableApplicable: record.isEnableDisableApplicable,
        isExecuteApplicable: record.isExecuteApplicable,
        isVeriferApplicable: record.isVeriferApplicable,
        isSelfAuthApplicable: record.isSelfAuthApplicable,
        isDynamicFormApplicable: false,
      };
      record.parentMenuId = parentMenu.id;
      menus.splice(getNewMenuIndex(menus, 'moduleId', record.moduleId), 0, parentMenu);
      isMenusUpdated = true;
    }
    // create Child Menu
    if (['create', 'update', 'enable'].includes(record.lastAction) && record.isFullMaster) {
      let childMenu = {
        id: getMenuId(menus, 'parentMenuId', record.parentMenuId),
        isParentMenu: false,
        parentMenuId: record.parentMenuId,
        moduleId: record.moduleId,
        moduleName: record.moduleName,
        menuCategory: 'Dynamic',
        displayName: record.displayName,
        entityName: record.moduleName.toUpperCase() + record.displayName.toUpperCase(),
        serviceUrl:
          _.camelCase(record.moduleName) +
          '/' +
          _.camelCase(record.parentMenu) +
          '/' +
          _.camelCase(record.displayName),
        linkIds: record.isForAdminPortal ? '1,2' : '1,2,3,4,5',
        isViewApplicable: record.isViewApplicable,
        isDataEntryApplicable: record.isDataEntryApplicable,
        isAuthorizeApplicable: record.isAuthorizeApplicable,
        isEnableDisableApplicable: record.isEnableDisableApplicable,
        isExecuteApplicable: record.isExecuteApplicable,
        isVeriferApplicable: record.isVeriferApplicable,
        isSelfAuthApplicable: record.isSelfAuthApplicable,
        dynamicFormId: record.id,
        isDynamicFormApplicable: false,
      };
      if (!record.isForAdminPortal) {
        childMenu.smeDisplayName = record.displayName;
        childMenu.msmeDisplayName = record.displayName;
        childMenu.isApplicableForNormalUser = record.isApplicableForNormalUser;
        childMenu.isApplicableForGroupUser = record.isApplicableForGroupUser;
        childMenu.isAvailableForSME = record.isAvailableForSME;
        childMenu.isAvailableForMSME = record.isAvailableForMSME;
      }
      menus.splice(getNewMenuIndex(menus, 'parentMenuId', record.parentMenuId), 0, childMenu);
      record.menuId = childMenu.id;
      record.serviceUrl = childMenu.serviceUrl;
      record.entityName = childMenu.entityName;
      // Creating folders and data.xlsx
      generateDataXLSXFile(record);
      // Creating listingTypes.xlsx
      generateListingTypesFile(record);
      isMenusUpdated = true;
    }
    // update Menu excel
    if (isMenusUpdated) {
      updateWorkbook(
        menusWb,
        { menus: XLSX.utils.json_to_sheet(menus) },
        './dummyServer/json/commons/menuService/' +
          (record.isForAdminPortal ? 'bankMenus.xlsx' : 'corporateMenus.xlsx'),
      );
    }
    // Authorize the record
    var formBuilderWb = XLSX.readFile(fbFilePath);
    authorize(fbFilePath, req.session.userDetails, req.body, formBuilderWb);
    // update menuId and parentMenuId in record
    if (record.isFullMaster) {
      formBuilderWb = XLSX.readFile(fbFilePath);
      let records = XLSX.utils.sheet_to_json(formBuilderWb.Sheets['Sheet1']);
      let recordIndex = _.findIndex(records, function (r) {
        return r.id == record.id;
      });
      records[recordIndex].parentMenuId = record.parentMenuId;
      records[recordIndex].menuId = record.menuId;
      records[recordIndex].serviceUrl = record.serviceUrl;
      records[recordIndex].entityName = record.entityName;
      updateWorkbook(formBuilderWb, { Sheet1: XLSX.utils.json_to_sheet(records) }, fbFilePath);
    }
  });
  res.json({ responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
});

function getMenuId(menus, filterKey, filterValue) {
  let id = '';
  filteredMenus = _.filter(menus, function (m) {
    return m[filterKey] == filterValue;
  });
  if (filteredMenus && filteredMenus.length > 0) {
    let lastId = filteredMenus[filteredMenus.length - 1].id.toString();
    id = filterValue + (parseInt(lastId.substring(filterValue.length, filterValue.length + 2)) + 1);
  } else {
    id = filterValue + '11';
  }
  return id;
}

function getNewMenuIndex(menus, filterKey, filterValue) {
  let index = '';
  filteredMenus = _.filter(menus, function (menu) {
    return menu[filterKey] == filterValue;
  });
  if (filteredMenus && filteredMenus.length > 0) {
    index =
      _.findIndex(menus, function (m) {
        return m.id == filteredMenus[filteredMenus.length - 1].id;
      }) + 1;
  } else {
    index = menus.length;
  }
  return index;
}

function generateDataXLSXFile(record) {
  let dataFilePath =
    './dummyServer/json/' +
    _.camelCase(record.moduleName) +
    '/' +
    _.camelCase(record.parentMenu) +
    '/' +
    _.camelCase(record.displayName);
  fs.mkdirSync(dataFilePath, { recursive: true });
  dataFilePath += '/data.xlsx';
  if (!fs.existsSync(dataFilePath)) {
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([]), 'Sheet1');
    XLSX.writeFile(wb, dataFilePath);
  }
}

function generateListingTypesFile(record) {
  let filePath =
    './dummyServer/json/' +
    _.camelCase(record.moduleName) +
    '/' +
    _.camelCase(record.parentMenu) +
    '/' +
    _.camelCase(record.displayName) +
    '/listingTypes.xlsx';
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  var wb = XLSX.utils.book_new();
  var listingTypes = [['code', 'displayName', 'count', 'rowDataUrl', 'checkboxSelection']];
  listingTypes.push(['REVIEWLIST', 'Review List', '1', 'getAuthorizedList', 'false']);
  listingTypes.push(['PENDINGLIST', 'Pending Authorization List', '1', 'getPendingList', 'true']);
  listingTypes.push(['REJECTEDLIST', 'Rejected List', '1', 'getRejectedList', 'false']);
  var listingCodes = 'REVIEWLIST,PENDINGLIST,REJECTEDLIST';
  if (record.isEnableDisableApplicable) {
    listingTypes.push(['DISABLEDLIST', 'Disabled List', '1', 'getDisabledList', 'false']);
    listingCodes = listingCodes + ',DISABLEDLIST';
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(listingTypes), 'listingTypes');
  var columns = [
    [
      'applicableListings',
      'headerName',
      'field',
      'cellRenderer',
      'type',
      'hide',
      'lockVisible',
      'filter',
      'pinned',
      'sortable',
    ],
  ];
  columns.push([listingCodes, 'Id', 'id', '', '', 'true', 'true', 'false', '', 'false']);
  _.forEach(record.gridDataList, function (item) {
    if (item.itemType == 'CARD') {
      _.forEach(item.cardData, function (field) {
        if (field.isShowInListing) {
          columns.push([
            listingCodes,
            field.label,
            _.camelCase(field.label) + '_DV',
            '',
            '',
            'false',
            'false',
            'true',
            '',
            'true',
          ]);
        }
      });
    }
  });
  columns.push([
    'REJECTEDLIST',
    'Reject Reason',
    'rejectReason',
    '',
    '',
    'false',
    'false',
    'true',
    '',
    'true',
  ]);
  columns.push([
    listingCodes,
    'Actions',
    'actions',
    'actionCellRenderer',
    '',
    'false',
    'false',
    'false',
    '',
    'false',
  ]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(columns), 'columns');
  XLSX.writeFile(wb, filePath);
}

function revokeRoleRights(record) {
  const oldRecord = JSON.stringify(record.changeInfo);
  if (
    record.menuId != oldRecord.menuId ||
    record.parentMenuId != oldRecord.parentMenuId ||
    record.moduleId != oldRecord.moduleId ||
    record.displayName != oldRecord.displayName ||
    record.isViewApplicable != oldRecord.isViewApplicable ||
    record.isDataEntryApplicable != oldRecord.isDataEntryApplicable ||
    record.isAuthorizeApplicable != oldRecord.isAuthorizeApplicable ||
    record.isEnableDisableApplicable != oldRecord.isEnableDisableApplicable ||
    record.isExecuteApplicable != oldRecord.isExecuteApplicable ||
    record.isVeriferApplicable != oldRecord.isVeriferApplicable ||
    record.isSelfAuthApplicable != oldRecord.isSelfAuthApplicable
  ) {
    let roleWb = XLSX.readFile(
      './dummyServer/json/setup/' +
        (record.isForAdminPortal ? 'securityBank/bankRole' : 'security/corporateRole') +
        '/data.xlsx',
    );
    let assignRightList = XLSX.utils.sheet_to_json(roleWb.Sheets['assignRightList']);
    for (let i = assignRightList.length - 1; i >= 0; i--) {
      if (assignRightList[i].menuId == record.menuId) {
        assignRightList.splice(i, 1);
      }
    }
    updateWorkbook(
      roleWb,
      { assignRightList: XLSX.utils.json_to_sheet(assignRightList) },
      './dummyServer/json/setup/' +
        (record.isForAdminPortal ? 'securityBank/bankRole' : 'security/corporateRole') +
        '/data.xlsx',
    );
  }
}

module.exports = router;
