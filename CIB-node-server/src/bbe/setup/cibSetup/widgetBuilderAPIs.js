var express = require('express');
var XLSX = require('xlsx');
var fs = require('fs');
var _ = require('lodash');
var authorize = require('../../../crudAPIs').authorize;
var getViewData = require('../../../crudAPIs').getViewData;
var updateWorkbook = require('../../../crudAPIs').updateWorkbook;
var router = express.Router();

router.post('/dummyServer/json/setup/cibSetup/widgetBuilder/private/getProductList', (req, res) => {
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
});

router.post('/dummyServer/json/setup/cibSetup/widgetBuilder/private/authorize', (req, res) => {
  let wbFilePath = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  let defaultDashboardPath =
    './dummyServer/json/commons/dashboardService/defaultDashboard/data.xlsx';
  let usersDashboardPath = './dummyServer/json/commons/dashboardService/usersDashboard/data.xlsx';
  _.forEach(req.body.dataMap.ids, function (recordId) {
    let record = getViewData(wbFilePath, [{ name: 'id', value: recordId }]);
    let moduleName = record.moduleName.replace(/ /g, '').toLowerCase();
    moduleName = moduleName === 'setup' ? 'commons' : moduleName;
    let defaultDashboardWb = XLSX.readFile(defaultDashboardPath);
    let defaultWidgetList = XLSX.utils.sheet_to_json(defaultDashboardWb.Sheets[moduleName]);
    let userDashboardWb = XLSX.readFile(usersDashboardPath);
    let userWidgetList = XLSX.utils.sheet_to_json(userDashboardWb.Sheets['Sheet1']);
    let userConsolidatedWidgetList = XLSX.utils.sheet_to_json(
      userDashboardWb.Sheets['consolidated'],
    );
    let userModuleWidgetList = XLSX.utils.sheet_to_json(userDashboardWb.Sheets[moduleName]);
    let userObjs = _.filter(userWidgetList, function (u) {
      return (
        (record.isForAdminPortal && u.requestBy == 'BANK') ||
        (!record.isForAdminPortal && u.requestBy == 'CORPORATE')
      );
    });
    let userBasedWidgetIds = [];
    _.forEach(userObjs, function (obj) {
      userBasedWidgetIds.push(obj.id);
    });
    // delete widget entry
    if (['update', 'disable'].includes(record.lastAction)) {
      const defaultWidgetIndex = _.findIndex(defaultWidgetList, function (defaultWidget) {
        return defaultWidget.dynamicWidgetId == record.id;
      });
      defaultWidgetList.splice(defaultWidgetIndex, 1);
      userConsolidatedWidgetList = _.filter(
        userConsolidatedWidgetList,
        function (userConsolidatedWidget) {
          return userConsolidatedWidget.dynamicWidgetId != record.id;
        },
      );
      userModuleWidgetList = _.filter(userModuleWidgetList, function (userModuleWidget) {
        return userModuleWidget.dynamicWidgetId != record.id;
      });
    }
    // create Parent Menu
    if (['create', 'update', 'enable'].includes(record.lastAction)) {
      const newDefaultWidget = {
        id: defaultWidgetList.length + 1,
        isApplicableForBBE: record.isForAdminPortal,
        isApplicableForCFE: !record.isForAdminPortal,
        dynamicWidgetId: record.id,
        mandatory: false,
        cols: record.isForAdminPortal ? 6 : 8,
        rows: record.isForAdminPortal ? 6 : 8,
        y: 0,
        x: 0,
        minItemCols: record.isForAdminPortal ? 6 : 8,
        minItemRows: record.isForAdminPortal ? 6 : 8,
        product: record.moduleName,
        isShow: true,
        title: record.widgetName,
        componentName: getComponentName(record.widgetType),
        serviceUrl: '',
        version: 1,
        lastAction: record.lastAction,
        enabled: record.enabled,
        active: record.active,
        authorized: record.authorized,
        modifiedBy: record.modifiedBy,
        modifiedSysOn: record.modifiedSysOn,
        modifiedAtOU: record.modifiedAtOU,
        mstId: 1,
        imageUrl: '',
      };
      defaultWidgetList.push(newDefaultWidget);

      _.forEach(userBasedWidgetIds, function (mstId) {
        let newUserWidget = {
          id: userConsolidatedWidgetList.length + 1,
          mstId: mstId,
          dynamicWidgetId: record.id,
          cols: record.isForAdminPortal ? 6 : 8,
          rows: record.isForAdminPortal ? 6 : 8,
          minItemCols: record.isForAdminPortal ? 6 : 8,
          minItemRows: record.isForAdminPortal ? 6 : 8,
          product: record.moduleName,
          isShow: true,
          title: record.widgetName,
          componentName: getComponentName(record.widgetType),
          serviceUrl: '',
          version: 1,
          lastAction: record.lastAction,
          enabled: record.enabled,
          active: record.active,
          authorized: record.authorized,
          modifiedBy: record.modifiedBy,
          modifiedSysOn: record.modifiedSysOn,
          modifiedAtOU: record.modifiedAtOU,
          isBoxShadow: true,
          isChangeChartApplicable: record.widgetType == 'Chart',
          modifiedOn: record.modifiedOn,
        };
        userConsolidatedWidgetList.push(_.cloneDeep(newUserWidget));
        newUserWidget.id = userModuleWidgetList.length + 1;
        userModuleWidgetList.push(_.cloneDeep(newUserWidget));
      });
    }
    let defaultDashboardWbSheets = {};
    defaultDashboardWbSheets[moduleName] = XLSX.utils.json_to_sheet(defaultWidgetList);
    updateWorkbook(defaultDashboardWb, defaultDashboardWbSheets, defaultDashboardPath);
    let userDashboardWbSheets = {
      consolidated: XLSX.utils.json_to_sheet(userConsolidatedWidgetList),
    };
    userDashboardWbSheets[moduleName] = XLSX.utils.json_to_sheet(userModuleWidgetList);
    updateWorkbook(userDashboardWb, userDashboardWbSheets, usersDashboardPath);
  });
  // Authorize the record
  let widgetBuilderWb = XLSX.readFile(wbFilePath);
  authorize(wbFilePath, req.session.userDetails, req.body, widgetBuilderWb);
  res.json({ responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
});

function getComponentName(widgetType) {
  if (widgetType == 'Chart') {
    return 'chart';
  } else if (widgetType == 'Table/Grid') {
    return 'table';
  } else if (widgetType == 'Calender') {
    return 'calender';
  } else if (widgetType == 'Advertisement') {
    return 'advertisement';
  }
}

module.exports = router;
