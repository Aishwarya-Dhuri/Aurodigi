var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var router = express.Router();
var getViewData = require('../../crudAPIs').getViewData;

router.post(
  '/dummyServer/json/setup/corporateOnboarding/corporateMain/private/accountList',
  (req, res) => {
    console.log('reading Corporate Accounts');
    var dataXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    var workbook = XLSX.readFile(dataXlFile);
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['accounts']);

    let accountTypes = ['CURRENT', 'SAVING'];

    if (req.body && req.body.dataMap && req.body.dataMap.accountType) {
      accountTypes = [req.body.dataMap.accountType.toUpperCase()];
    }

    var corporateId;
    if (req.body.dataMap && req.body.dataMap.corporateId) {
      corporateId = req.body.dataMap.corporateId;
    } else {
      corporateId = req.session.userDetails.corporateId;
    }

    var dataList = [];

    _.forEach(xlData, function (record) {
      if (
        record.lastAction.indexOf('Authorized') !== -1 &&
        corporateId == record.mstId &&
        accountTypes.includes(record.accountType)
      ) {
        dataList.push({
          id: record.id,
          displayName: record.accountNo + '-' + record.currencyCode,
          enrichments: {
            accountNo: record.accountNo,
            accountTitle: record.accountTitle,
            currencyCode: record.currencyCode,
            currencyId: record.currencyId,
            accountDesc: record.accountDesc,
            corporateAccountAlias: record.corporateAccountAlias,
            iBanNumber: record.iBanNumber,
            accountBranch: record.accountBranch,
            balance: record.balance,
            availableLimit: record.totalPayable,
            totalPayable: record.totalPayable,
            totalReceivable: record.totalReceivable,
            totalCreditBalance: record.totalCreditBalance,
            totalDebitBalance: record.totalDebitBalance,
            accountType: record.accountType,
            openingBalance: record.openingBalance,
            closingBalance: record.closingBalance,
            odLimit: record.odLimit,
            holdBalance: record.holdBalance,
            ladgerBalance: record.ladgerBalance,
            unclearBalance: record.ladgerBalance,
            bank: record.bank,
            country: record.country,
          },
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

router.post(
  '/dummyServer/json/setup/corporateOnboarding/corporateMain/private/virtualAccountList',
  (req, res) => {
    console.log('reading Virtual Accounts');
    const dataXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    const workbook = XLSX.readFile(dataXlFile);
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets['virtualAccounts']);

    const accountNo = req.body?.dataMap?.accountNo;

    const dataList = [];

    _.forEach(xlData, function (record) {
      if (record.lastAction.indexOf('Authorized') !== -1 && accountNo == record.accountNumber) {
        dataList.push({
          id: record.id,
          displayName: record.virtualAccountNumber,
          enrichments: {
            virtualAccountNumber: record.virtualAccountNumber,
            virtualAccountAliceName: record.virtualAccountAliceName,
            availableLimit: record.availableLimit,
            utilizedLimit: record.utilizedLimit,
            accountNumber: record.accountNumber,
          },
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

router.post(
  '/dummyServer/json/setup/corporateOnboarding/corporateMain/private/allAccountList',
  (req, res) => {
    console.log('reading all Accounts of Corporate ');

    let accountTypes = ['CURRENT', 'SAVING'];

    if (req.body && req.body.dataMap && req.body.dataMap.accountType) {
      accountTypes = [req.body.dataMap.accountType.toUpperCase()];
    }

    var corporateId;
    if (req.body.dataMap && req.body.dataMap.corporateId) {
      corporateId = req.body.dataMap.corporateId;
    } else {
      corporateId = req.session.userDetails.corporateId;
    }
    var dataList = [];

    var accountXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    var accountWorkbook = XLSX.readFile(accountXlFile);
    var accountXlData = XLSX.utils.sheet_to_json(accountWorkbook.Sheets['accounts']);

    accountXlData.forEach((account) => {
      if (
        account.lastAction.indexOf('Authorized') !== -1 &&
        corporateId == account.mstId &&
        accountTypes.includes(account.accountType)
      ) {
        dataList.push({
          id: account.id,
          displayName: account.accountNo + '-' + account.currencyCode,
          enrichments: {
            accountNo: account.accountNo,
            accountTitle: account.accountTitle,
            currencyCode: account.currencyCode,
            currencyId: account.currencyId,
            corporateAccountAlias: account.corporateAccountAlias,
            bank: account.bank,
            country: account.country,
            accountType: account.accountType,
            balance: account.balance,
            type: 'Internal',
          },
        });
      }
    });

    var externalAccountXlFile =
      './dummyServer/json/setup/corporateOnboarding/corporateAccount/data.xlsx';
    var externalAccountWorkbook = XLSX.readFile(externalAccountXlFile);
    var externalAccountXlData = XLSX.utils.sheet_to_json(externalAccountWorkbook.Sheets['Sheet1']);

    externalAccountXlData.forEach((account) => {
      if (
        account.lastAction.indexOf('Authorized') !== -1 &&
        corporateId == account.corporateId &&
        accountTypes.includes(account.accountType)
      ) {
        dataList.push({
          id: account.id,
          displayName: account.accountNo + '-' + account.currency,
          enrichments: {
            accountNo: account.accountNo,
            accountTitle: account.accountTitle,
            currencyCode: account.currency,
            currencyId: account.currencyId,
            corporateAccountAlias: account.corporateAccountAlias,
            bank: account.bank,
            country: account.country,
            accountType: account.accountType,
            balance: account.availableBalance,
            type: 'External',
          },
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

router.post(
  '/dummyServer/json/setup/corporateOnboarding/corporateGroup/private/getGroupList',
  (req, res) => {
    let groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
    let groupWorkbook = XLSX.readFile(groupXlFile);

    let groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['Sheet1']);

    const dataList = [];

    groupData.forEach((data) => {
      dataList.push({
        id: data.id,
        displayName: data.groupName,
        enrichments: {
          ...data,
          corporates: getGroupCorporates(data.id),
        },
      });
    });

    res.json({
      dataList,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

const getGroupCorporates = (groupId) => {
  let groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
  let groupWorkbook = XLSX.readFile(groupXlFile);

  let groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

  let dataList = [];

  let corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
  let corporateWorkbook = XLSX.readFile(corporateXlFile);

  let corporateXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['Sheet1']);

  groupData
    .filter((record) => record.mstId == groupId)
    .forEach((record) => {
      const corporateData = corporateXlData.find((corp) => corp.id == record.corporateId);

      if (corporateData) {
        dataList.push({
          id: corporateData.id,
          name: corporateData.corporateName,
        });
      }
    });

  return dataList;
};

router.post(
  '/dummyServer/json/setup/corporateOnboarding/corporateMain/private/getCorporates',
  (req, res) => {
    const data = [];

    let corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    let corporateWorkbook = XLSX.readFile(corporateXlFile);

    let corporateXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['Sheet1']);

    corporateXlData.forEach((record) => {
      data.push({
        id: record.id,
        corporateCode: record.corporateCode,
        corporateName: record.corporateName,
        enrichments: {
          ...record,
        },
      });
    });

    res.json({
      data: data,
      lastRow: data.length,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

router.post(
  '/dummyServer/json/setup/corporateOnboarding/corporateMain/private/getCorporateList',
  (req, res) => {
    const dataList = [];

    let corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    let corporateWorkbook = XLSX.readFile(corporateXlFile);

    let corporateXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['Sheet1']);

    corporateXlData.forEach((record) => {
      dataList.push({
        id: record.id,
        displayName: record.corporateName,
        enrichments: {
          ...record,
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

router.post('/dummyServer/json/commons/menuService/private/getMenus', (req, res) => {
  let workbook = XLSX.readFile('./dummyServer/json/commons/menuService/bankMenus.xlsx');

  let mainMenus = XLSX.utils.sheet_to_json(workbook.Sheets['modules']);
  let menus = XLSX.utils.sheet_to_json(workbook.Sheets['menus']);
  let links = XLSX.utils.sheet_to_json(workbook.Sheets['links']);
  cleanExtraFeildsFromMenu(menus);

  // get RoleIds from user sheet then below
  let userData = getViewData('./dummyServer/json/setup/securityBank/bankUser/data.xlsx', [
    { name: 'id', value: req.session.userDetails.userId },
  ]);
  let roleIds = [];
  userData.roles.forEach((role) => {
    roleIds.push(role.roleId);
  });
  // reading Role data
  let roleWorkbook = XLSX.readFile('./dummyServer/json/setup/securityBank/bankRole/data.xlsx');
  let allRoleRights = XLSX.utils.sheet_to_json(roleWorkbook.Sheets['assignRightList']);
  allRoleRights = _.filter(allRoleRights, function (r) {
    return roleIds.includes(r.mstId);
  });
  //cleaning unwanted modules
  const moduleIdsFromRoles = _.uniqBy(allRoleRights, 'moduleId');
  for (let i = mainMenus.length - 1; i >= 0; i--) {
    let found = false;
    for (let j = 0; j < moduleIdsFromRoles.length; j++) {
      if (mainMenus[i].moduleId.toString() == moduleIdsFromRoles[j].moduleId.toString()) {
        found = true;
        break;
      }
    }
    if (!found) {
      mainMenus.splice(i, 1);
    }
  }

  mainMenus.forEach((mainMenu) => {
    //setting Parent Menus
    let parentMenus = _.filter(menus, function (m) {
      return m.isParentMenu && m.moduleId == mainMenu.moduleId;
    });
    for (let p = parentMenus.length - 1; p >= 0; p--) {
      //setting Masters to parent menu
      let masters = _.filter(menus, function (m) {
        return (
          !m.isParentMenu && m.moduleId == mainMenu.moduleId && m.parentMenuId == parentMenus[p].id
        );
      });

      for (let i = masters.length - 1; i >= 0; i--) {
        //setting links to masters
        const linkIds = masters[i].linkIds.toString().split(',');
        masters[i].menuLinksDetail = {
          link: _.cloneDeep(
            _.filter(links, function (link) {
              return (
                linkIds.includes(link.id.toString()) &&
                hasAccess(allRoleRights, masters[i].id.toString(), link)
              );
            }),
          ),
        };
        //updating links
        masters[i].menuLinksDetail.link.forEach((link) => {
          link.url = link.url.replace(/<<serviceUrl>>/g, masters[i].serviceUrl);
        });
        delete masters[i].linkIds;
        if (masters[i].menuLinksDetail.link.length == 0) {
          masters.splice(i, 1);
        }
      }

      if (masters.length > 0) {
        parentMenus[p].menus = masters;
        delete parentMenus[p].serviceUrl;
        delete parentMenus[p].linkIds;
      } else {
        parentMenus.splice(p, 1);
      }
    }

    mainMenu.menus = parentMenus;
  });

  //adding reports and Dashboard to final set
  mainMenus.unshift({
    id: '26',
    moduleId: '26',
    moduleName: 'Dashboard',
    icon: 'fa-th-large',
    isShortMenu: true,
    menus: [{ id: '26', displayName: 'consolidated' }],
  });
  mainMenus.push({
    id: '27',
    moduleId: '27',
    moduleName: 'Reports',
    icon: 'fa-chart-bar',
    isShortMenu: false,
    menus: [],
  });
  mainMenus.forEach((mainMenu) => {
    //adding dashboard menus
    if (!['Dashboard', 'Reports'].includes(mainMenu.moduleName)) {
      mainMenus[0].menus.push({ id: mainMenu.id, displayName: mainMenu.moduleName });
    }
    //copy reports from respective modules
    for (let i = mainMenu.menus.length - 1; i >= 0; i--) {
      if (mainMenu.menus[i].displayName == 'Reports') {
        mainMenu.menus[i].displayName = mainMenu.menus[i].moduleName;
        mainMenus[mainMenus.length - 1].menus.push(mainMenu.menus[i]);
        mainMenu.menus.splice(i, 1);
        break;
      }
    }
  });

  res.json(mainMenus);
});

router.post('/dummyServer/json/commons/commonService/private/getProductList', (req, res) => {
  let workbook = XLSX.readFile('./dummyServer/json/commons/menuService/bankMenus.xlsx');
  let mainMenus = XLSX.utils.sheet_to_json(workbook.Sheets['modules']);

  var dataList = [];
  _.forEach(mainMenus, function (menu) {
    dataList.push({
      id: menu.moduleId,
      displayName: menu.moduleName,
      enrichments: {
        icon: menu.icon,
        product: _.camelCase(menu.moduleName),
        productId: menu.moduleId,
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

router.post(
  '/dummyServer/json/commons/commonService/private/getCorporateProductList',
  (req, res) => {
    let workbook = XLSX.readFile('./dummyServer/json/commons/menuService/corporateMenus.xlsx');
    let mainMenus = XLSX.utils.sheet_to_json(workbook.Sheets['modules']);

    var dataList = [];
    _.forEach(mainMenus, function (menu) {
      dataList.push({
        id: menu.moduleId,
        displayName: menu.moduleName,
        enrichments: {
          icon: menu.icon,
          productId: menu.moduleId,
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

router.post('/dummyServer/json/commons/menuService/private/getAccessRightList', (req, res) => {
  var workbook = XLSX.readFile('./dummyServer/json/commons/menuService/bankMenus.xlsx');
  const menus = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[1]]);

  var response = {};
  let records = [
    {
      moduleName: '',
      moduleId: null,
      isParentMenu: null,
      parentMenuId: null,
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
    return m.isParentMenu && m.moduleId == req.body.dataMap.moduleId;
  });
  parentMenus.forEach((parentMenu) => {
    records.push({
      menuId: parentMenu.id,
      moduleName: parentMenu.moduleName,
      moduleId: parentMenu.moduleId,
      isParentMenu: parentMenu.isParentMenu,
      parentMenuId: parentMenu.parentMenuId,
      displayName: [parentMenu.displayName],
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
        p.moduleId == req.body.dataMap.moduleId &&
        p.parentMenuId == parentMenu.id
      );
    });

    masters.forEach((master) => {
      if (master.isAvailable) {
        records.push({
          menuId: master.id,
          moduleName: master.moduleName,
          moduleId: master.moduleId,
          isParentMenu: master.isParentMenu,
          parentMenuId: master.parentMenuId,
          displayName: [parentMenu.displayName, master.displayName],
          isViewApplicable: master.isViewApplicable,
          isDataEntryApplicable: master.isDataEntryApplicable,
          isAuthorizeApplicable: master.isAuthorizeApplicable,
          isEnableDisableApplicable: master.isEnableDisableApplicable,
          isExecuteApplicable: master.isExecuteApplicable,
          isVeriferApplicable: master.isVeriferApplicable,
          isSelfAuthApplicable: master.isSelfAuthApplicable,
        });
      }
    });
  });
  response.dataList = records;

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

router.post(
  '/dummyServer/json/commons/menuService/private/getCorporateAccessRightList',
  (req, res) => {
    var workbook = XLSX.readFile('./dummyServer/json/commons/menuService/corporateMenus.xlsx');
    const menus = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[1]]);

    var response = {};
    let records = [
      {
        moduleName: '',
        moduleId: null,
        isParentMenu: null,
        parentMenuId: null,
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
      return m.isParentMenu && m.moduleId == req.body.dataMap.moduleId;
    });
    parentMenus.forEach((parentMenu) => {
      records.push({
        menuId: parentMenu.id,
        moduleName: parentMenu.moduleName,
        moduleId: parentMenu.moduleId,
        isParentMenu: parentMenu.isParentMenu,
        parentMenuId: parentMenu.parentMenuId,
        displayName: [parentMenu.displayName],
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
          p.moduleId == req.body.dataMap.moduleId &&
          p.parentMenuId == parentMenu.id
        );
      });

      masters.forEach((master) => {
        records.push({
          menuId: master.id,
          moduleName: master.moduleName,
          moduleId: master.moduleId,
          isParentMenu: master.isParentMenu,
          parentMenuId: master.parentMenuId,
          displayName: [parentMenu.displayName, master.displayName],
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

function cleanExtraFeildsFromMenu(menus) {
  for (let i = menus.length - 1; i >= 0; i--) {
    delete menus[i].isViewApplicable;
    delete menus[i].isDataEntryApplicable;
    delete menus[i].isAuthorizeApplicable;
    delete menus[i].isEnableDisableApplicable;
    delete menus[i].isExecuteApplicable;
    delete menus[i].isVeriferApplicable;
    delete menus[i].isSelfAuthApplicable;
  }
  return menus;
}

function hasAccess(allRoleRights, menuId, link) {
  let access = [];
  masterRoles = _.filter(allRoleRights, function (a) {
    return a.menuId.toString() == menuId.toString();
  });

  _.forEach(masterRoles, function (master) {
    if (master.VIEW && access.indexOf('VIEW') == -1) {
      access.push('VIEW');
    }
    if (master.DATA_ENTRY && access.indexOf('DATA_ENTRY') == -1) {
      access.push('DATA_ENTRY');
    }
    if (master.AUTHORIZE && access.indexOf('AUTHORIZE') == -1) {
      access.push('AUTHORIZE');
    }
    if (master.ENABLE_DISABLE && access.indexOf('ENABLE_DISABLE') == -1) {
      access.push('ENABLE_DISABLE');
    }
    if (master.EXECUTE && access.indexOf('EXECUTE') == -1) {
      access.push('EXECUTE');
    }
    if (master.VERIFER && access.indexOf('VERIFER') == -1) {
      access.push('VERIFER');
    }
    if (master.SELFAUTH && access.indexOf('SELFAUTH') == -1) {
      access.push('SELFAUTH');
    }
  });
  return access.includes(link.access.toString());
}

router.post('/dummyServer/json/setup/generalMasters/currency/private/currencyList', (req, res) => {
  console.log('reading currency');
  var dataXlFile = './dummyServer/json/setup/generalMasters/currency/data.xlsx';
  var workbook = XLSX.readFile(dataXlFile);
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['sheet1']);
  var dataList = [];
  _.forEach(xlData, function (record) {
    if (record.lastAction.indexOf('Authorized') !== -1) {
      dataList.push({
        id: record.id,
        displayName: record.currencyCode,
        enrichments: {
          currencyDecimal: record.currencyDecimal,
          flag: record.flag,
          currencyDesc: record.currencyDesc,
          fxRateToBase: record.fxRateToBase,
        },
      });
    }
  });
  res.json({
    dataList: dataList,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

module.exports = router;
