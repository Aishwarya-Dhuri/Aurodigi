var express = require('express');
var XLSX = require('xlsx');
var router = express.Router();
var _ = require('lodash');

function cleanExtraFeildsFromMenu(menus, corporateType, roleType) {
  for (let i = menus.length - 1; i >= 0; i--) {
    if (roleType == 'NORMAL' && !menus[i].isApplicableForNormalUser) {
      menus.splice(i, 1);
      continue;
    } else if (roleType == 'GROUP' && !menus[i].isApplicableForGroupUser) {
      menus.splice(i, 1);
      continue;
    }
    if (corporateType == 'S') {
      menus[i].displayName = menus[i].smeDisplayName;
      if (!menus[i].isAvailableForSME) {
        menus.splice(i, 1);
      }
    } else if (corporateType == 'M') {
      menus[i].displayName = menus[i].msmeDisplayName;
      if (!menus[i].isAvailableForMSME) {
        menus.splice(i, 1);
      }
    }
    // delete menus[i].smeDisplayName;
    // delete menus[i].msmeDisplayName;
    // delete menus[i].isAvailableForSME;
    // delete menus[i].isAvailableForMSME;
    // delete menus[i].isViewApplicable;
    // delete menus[i].isDataEntryApplicable;
    // delete menus[i].isAuthorizeApplicable;
    // delete menus[i].isEnableDisableApplicable;
    // delete menus[i].isExecuteApplicable;
    // delete menus[i].isVeriferApplicable;
    // delete menus[i].isSelfAuthApplicable;
  }
  return menus;
}

//Get Assign Role Data
router.post(
  '/dummyServer/json/setup/security/corporateRole/assignRightsGrid/private/getAssignRoleData',
  (req, res) => {
    // let reqs = { session: { userDetails: { corporateType: 'L' } } };

    const dataFilePath = '.' + req.url.substring(0, req.url.indexOf('private')) + 'menus.xlsx';
    var workbook = XLSX.readFile(dataFilePath);
    const menus = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[1]]);

    cleanExtraFeildsFromMenu(menus, req.body.dataMap.corporateType);

    var response = {};
    let records = [
      {
        moduleName: '',
        moduleId: null,
        isParentMenu: null,
        parentMenuId: null,
        isApplicableForNormalUser: null,
        isApplicableForGroupUser: null,
        displayName: ['All'],
        isViewApplicable: true,
        isDataEntryApplicable: true,
        isAuthorizeApplicable: true,
        isEnableDisableApplicable: true,
        isExecuteApplicable: true,
        isVeriferApplicable: true,
        isSelfAuthApplicable: true,
      },
    ];
    let parentMenus = _.filter(menus, function (m) {
      return m.isParentMenu && m.moduleName == req.body.dataMap.moduleName;
    });
    parentMenus.forEach((parentMenu) => {
      records.push({
        menuId: parentMenu.id,
        moduleName: parentMenu.moduleName,
        moduleId: parentMenu.moduleId,
        isApplicableForNormalUser: parentMenu.isApplicableForNormalUser,
        isApplicableForGroupUser: parentMenu.isApplicableForGroupUser,
        isParentMenu: parentMenu.isParentMenu,
        parentMenuId: parentMenu.parentMenuId,
        displayName: parentMenu.displayName.split(','),
        isViewApplicable: parentMenu.isViewApplicable,
        isDataEntryApplicable: parentMenu.isDataEntryApplicable,
        isAuthorizeApplicable: parentMenu.isAuthorizeApplicable,
        isEnableDisableApplicable: parentMenu.isEnableDisableApplicable,
        isExecuteApplicable: parentMenu.isExecuteApplicable,
        isVeriferApplicable: parentMenu.isVeriferApplicable,
        isSelfAuthApplicable: parentMenu.isSelfAuthApplicable,
      });
      const masters = _.filter(menus, function (p) {
        return (
          !p.isParentMenu &&
          p.moduleName == req.body.dataMap.moduleName &&
          p.parentMenuId == parentMenu.id
        );
      });

      masters.forEach((master) => {
        records.push({
          menuId: master.id,
          moduleName: master.moduleName,
          moduleId: master.moduleId,
          isApplicableForNormalUser: master.isApplicableForNormalUser,
          isApplicableForGroupUser: master.isApplicableForGroupUser,
          isParentMenu: master.isParentMenu,
          parentMenuId: master.parentMenuId,
          displayName: (parentMenu.displayName + ',' + master.displayName).split(','),
          isViewApplicable: master.isViewApplicable,
          isDataEntryApplicable: master.isDataEntryApplicable,
          isAuthorizeApplicable: master.isAuthorizeApplicable,
          isEnableDisableApplicable: master.isEnableDisableApplicable,
          isExecuteApplicable: master.isExecuteApplicable,
          isVeriferApplicable: master.isVeriferApplicable,
          isSelfAuthApplicable: master.isSelfAuthApplicable,
        });
      });
    });
    response.dataList = records;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/setup/security/corporateRole/private/dropdown/roleList',
  (req, res) => {
    var dataXlFile = './dummyServer/json/setup/security/corporateRole/data.xlsx';
    var workbook = XLSX.readFile(dataXlFile);
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
    var dataList = [];

    _.forEach(xlData, function (record) {
      if (
        record.lastAction.indexOf('Authorized') !== -1 &&
        record.moduleId == req.body?.dataMap?.moduleId
      ) {
        dataList.push({
          id: record.id,
          displayName: record.roleCode + ' - ' + record.roleName,
        });
      }
    });
    res.json({
      dataList: dataList,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

module.exports = router;
