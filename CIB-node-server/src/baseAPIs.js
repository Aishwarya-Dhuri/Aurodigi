const express = require('express');
const moment = require('moment');

const XLSX = require('xlsx');
const _ = require('lodash');
const getViewData = require('./crudAPIs').getViewData;

const updateRecordInExcel = require('./crudAPIs').updateRecordInExcel;

const generateAuthorizeSheetData = require('./crudAPIs').generateAuthorizeSheetData;
const updateWorkbook = require('./crudAPIs').updateWorkbook;

const router = express.Router();

router.post('/dummyServer/json/commons/menuService/private/getMenus', (req, res) => {
  let workbook = XLSX.readFile('./dummyServer/json/commons/menuService/corporateMenus.xlsx');

  let mainMenus = XLSX.utils.sheet_to_json(workbook.Sheets['modules']);
  let menus = XLSX.utils.sheet_to_json(workbook.Sheets['menus']);
  let links = XLSX.utils.sheet_to_json(workbook.Sheets['links']);
  cleanExtraFeildsFromMenu(menus, req.session.userDetails.corporateType, true);

  // get RoleIds from user sheet then below
  let userData = getViewData('./dummyServer/json/setup/security/corporateUser/data.xlsx', [
    { name: 'id', value: req.session.userDetails.userId },
  ]);
  let roleIds = [];
  if (req.session.userDetails.loginPreferenceDetails.loginType == 'group') {
    userData.groupUserDetails.forEach((groupUserDetail) => {
      if (groupUserDetail.groupId == req.session.userDetails.loginPreferenceDetails.groupId) {
        groupUserDetail.groupRoles.forEach((role) => {
          roleIds.push(role.roleId.toString());
        });
      }
    });
  } else {
    userData.roles.forEach((role) => {
      roleIds.push(role.roleId.toString());
    });
  }
  // reading Role data
  let roleWorkbook = XLSX.readFile('./dummyServer/json/setup/security/corporateRole/data.xlsx');
  let allRoleRights = XLSX.utils.sheet_to_json(roleWorkbook.Sheets['assignRightList']);
  allRoleRights = _.filter(allRoleRights, function (r) {
    return roleIds.includes(r.mstId.toString());
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

  let fumWorkbook = XLSX.readFile(
    './dummyServer/json/commons/menuService/frequentlyUsedMenus.xlsx',
  );
  let frequentlyUsedMenus = XLSX.utils.sheet_to_json(fumWorkbook.Sheets['Sheet1']);

  let advertisementWorkbook = XLSX.readFile(
    './dummyServer/json/commons/menuService/advertisements.xlsx',
  );
  let advertisements = XLSX.utils.sheet_to_json(advertisementWorkbook.Sheets['Sheet1']);

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

    mainMenu.frequentlyUsedMenus = frequentlyUsedMenus
      .filter((menu) => menu.moduleId == mainMenu.moduleId)
      .map((m) => {
        m.displayName = [m.moduleName, m.menuCategoryName, m.menuName, m.linkName].join(' -> ');
        return m;
      });

    mainMenu.advertisement = advertisements.filter((menu) => menu.moduleId == mainMenu.moduleId);
  });

  //adding reports and Dashboard to final set
  mainMenus.unshift({
    id: '26',
    moduleId: '26',
    moduleName: 'Dashboard',
    icon: 'fa-th-large',
    isShortMenu: true,
    menus: [{ id: '26', displayName: 'Consolidated' }],
  });

  if (
    req.session.userDetails.corporateType == 'L' ||
    req.session.userDetails.corporateType == 'M'
  ) {
    const index = mainMenus.findIndex((menu) => menu.id == '26');
    if (index >= 0) {
   //   mainMenus[index].menus.push({ id: '50', displayName: 'CXO' });
    }
  }

  mainMenus.push({
    id: '27',
    moduleId: '27',
    moduleName: 'Reports',
    icon: 'fa-chart-bar',
    isShortMenu: false,
    menus: [],
    frequentlyUsedMenus: frequentlyUsedMenus.filter((menu) => menu.moduleId == '27'),
    advertisement: advertisements.filter((menu) => menu.moduleId == '27'),
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

function cleanExtraFeildsFromMenu(menus, corporateType, deleteUnwanted) {
  for (let i = menus.length - 1; i >= 0; i--) {
    if (!menus[i].isAvailable) {
      menus.splice(i, 1);
    } else if (corporateType == 'S') {
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

    if (deleteUnwanted) {
      delete menus[i].smeDisplayName;
      delete menus[i].msmeDisplayName;
      delete menus[i].isAvailableForSME;
      delete menus[i].isAvailableForMSME;
      delete menus[i].isViewApplicable;
      delete menus[i].isDataEntryApplicable;
      delete menus[i].isAuthorizeApplicable;
      delete menus[i].isEnableDisableApplicable;
      delete menus[i].isExecuteApplicable;
      delete menus[i].isVeriferApplicable;
      delete menus[i].isSelfAuthApplicable;
      delete menus[i].isApplicableForNormalUser;
      delete menus[i].isApplicableForGroupUser;
    }
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

router.post(
  '/dummyServer/json/setup/corporateOnboarding/corporateMain/private/groupAccountList',
  (req, res) => {
    let dataXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    let workbook = XLSX.readFile(dataXlFile);

    var corporateXlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
    let corporateAccountsXlData = XLSX.utils.sheet_to_json(workbook.Sheets['accounts']);

    let accountTypes = ['CURRENT', 'SAVING'];

    if (req.body && req.body.dataMap && req.body.dataMap.accountType) {
      accountTypes = [req.body.dataMap.accountType.toUpperCase()];
    }

    const dataList = [];

    getGroupCorporates(req.session?.userDetails?.loginPreferenceDetails?.groupId).forEach(
      (corporate) => {
        const corporateData = corporateXlData.find((corp) => corp.id == corporate.id);

        const data = {
          id: corporateData.id,
          displayName: corporateData.corporateName,
          items: [],
        };

        corporateAccountsXlData
          .filter((record) => {
            return (
              record.lastAction.indexOf('Authorized') !== -1 &&
              corporateData.id == record.mstId &&
              accountTypes.includes(record.accountType) &&
              (req.session?.userDetails?.loginPreferenceDetails?.bankType == 'Islamic'
                ? record.bankAccountType == 'ISLAMIC'
                : true)
            );
          })
          .forEach((record) => {
            data.items.push({
              id: record.id,
              displayName: record.accountNo + '-' + record.currencyCode,
              enrichments: {
                corporateId: corporateData.id,
                corporateCode: corporateData.corporateCode,
                corporateName: corporateData.corporateName,
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
          });

        dataList.push(data);
      },
    );

    res.json({
      dataList: dataList,
      lastRow: dataList.length,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

router.post(
  '/dummyServer/json/setup/corporateOnboarding/corporateMain/private/accountList',
  (req, res) => {
    let dataXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    let workbook = XLSX.readFile(dataXlFile);
    let xlData = XLSX.utils.sheet_to_json(workbook.Sheets['accounts']);

    let accountTypes = ['CURRENT', 'SAVING'];

    if (req.body && req.body.dataMap && req.body.dataMap.accountType) {
      accountTypes = [req.body.dataMap.accountType.toUpperCase()];
    }

    let corporateIds = [];
    if (req.session.userDetails?.loginPreferenceDetails?.loginType != 'group') {
      if (req.body.dataMap && req.body.dataMap.corporateId) {
        corporateIds.push(req.body.dataMap.corporateId);
      } else {
        corporateIds.push(req.session.userDetails.corporateId);
      }
    } else {
      getGroupCorporates(req.session?.userDetails?.loginPreferenceDetails?.groupId).forEach(
        (corporate) => {
          corporateIds.push(corporate.id);
        },
      );
    }

    let dataList = [];

    _.forEach(xlData, function (record) {
      if (
        record.lastAction.indexOf('Authorized') !== -1 &&
        corporateIds.includes(record.mstId) &&
        accountTypes.includes(record.accountType) &&
        (req.session.userDetails?.loginPreferenceDetails?.bankType == 'Islamic'
          ? record.bankAccountType == 'ISLAMIC'
          : true)
      ) {
        dataList.push({
          id: record.id,
          displayName: record.accountNo + '-' + record.currencyCode,
          accountTitle: record.accountTitle,
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
            corporateId: record.mstId,
          },
        });
      }
    });
    res.json({
      dataList: dataList,
      lastRow: dataList.length,
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
  '/dummyServer/json/setup/corporateOnboarding/corporateMain/private/allVirtualAccountList',
  (req, res) => {
    console.log('reading Virtual Accounts');
    const dataXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    const workbook = XLSX.readFile(dataXlFile);
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets['accounts']);
    const virtualData = XLSX.utils.sheet_to_json(workbook.Sheets['virtualAccounts']);

    let accountTypes = ['CURRENT', 'SAVING'];

    if (req.body && req.body.dataMap && req.body.dataMap.accountType) {
      accountTypes = [req.body.dataMap.accountType.toUpperCase()];
    }

    let corporateIds = [];
    if (req.session.userDetails?.loginPreferenceDetails?.loginType != 'group') {
      if (req.body.dataMap && req.body.dataMap.corporateId) {
        corporateIds.push(req.body.dataMap.corporateId);
      } else {
        corporateIds.push(req.session.userDetails.corporateId);
      }
    } else {
      getGroupCorporates(req.session?.userDetails?.loginPreferenceDetails?.groupId).forEach(
        (corporate) => {
          corporateIds.push(corporate.id);
        },
      );
    }

    const dataList = [];

    _.forEach(xlData, function (record) {
      if (
        record.lastAction.indexOf('Authorized') !== -1 &&
        corporateIds.includes(record.mstId) &&
        accountTypes.includes(record.accountType) &&
        (req.session.userDetails?.loginPreferenceDetails?.bankType == 'Islamic'
          ? record.bankAccountType == 'ISLAMIC'
          : true)
      ) {
        _.forEach(virtualData, function (virtualAcc) {
          if (
            record.lastAction.indexOf('Authorized') !== -1 &&
            accountNo == virtualAcc.accountNumber
          ) {
            dataList.push({
              id: virtualAcc.id,
              displayName: virtualAcc.virtualAccountNumber,
              enrichments: {
                virtualAccountNumber: virtualAcc.virtualAccountNumber,
                virtualAccountAliceName: virtualAcc.virtualAccountAliceName,
                availableLimit: virtualAcc.availableLimit,
                utilizedLimit: virtualAcc.utilizedLimit,
                accountNumber: virtualAcc.accountNumber,
              },
            });
          }
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
  '/dummyServer/json/setup/corporateOnboarding/corporateMain/private/groupAllAccountList',
  (req, res) => {
    console.log('reading all Accounts of Corporate ');

    const accountXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    const accountWorkbook = XLSX.readFile(accountXlFile);

    const corporateXlData = XLSX.utils.sheet_to_json(accountWorkbook.Sheets['Sheet1']);
    const accountXlData = XLSX.utils.sheet_to_json(accountWorkbook.Sheets['accounts']);

    const externalAccountXlFile =
      './dummyServer/json/setup/corporateOnboarding/corporateAccount/data.xlsx';
    const externalAccountWorkbook = XLSX.readFile(externalAccountXlFile);
    const externalAccountXlData = XLSX.utils.sheet_to_json(
      externalAccountWorkbook.Sheets['Sheet1'],
    );

    let accountTypes = ['CURRENT', 'SAVING'];

    if (req.body && req.body.dataMap && req.body.dataMap.accountType) {
      accountTypes = [req.body.dataMap.accountType.toUpperCase()];
    }

    const dataList = [];

    getGroupCorporates(req.session?.userDetails?.loginPreferenceDetails?.groupId).forEach(
      (corporate) => {
        const corporateData = corporateXlData.find((corp) => corp.id == corporate.id);

        const data = {
          id: corporateData.id,
          displayName: corporateData.corporateName,
          items: [],
        };

        accountXlData.forEach((account) => {
          if (
            account.lastAction.indexOf('Authorized') !== -1 &&
            corporateData.id == account.mstId &&
            accountTypes.includes(account.accountType) &&
            (req.session.userDetails?.loginPreferenceDetails?.bankType == 'Islamic'
              ? record.bankAccountType == 'ISLAMIC'
              : true)
          ) {
            data.items.push({
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

        externalAccountXlData.forEach((account) => {
          if (
            account.lastAction.indexOf('Authorized') !== -1 &&
            corporateData.id == account.corporateId &&
            accountTypes.includes(account.accountType)
          ) {
            data.items.push({
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

        dataList.push(data);
      },
    );

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

    if (req.body && req.body.dataMap && req.body.dataMap?.accountType) {
      accountTypes = [req.body.dataMap.accountType.toUpperCase()];
    }

    let corporateIds = [];

    if (req.session.userDetails?.loginPreferenceDetails?.loginType != 'group') {
      if (req.body.dataMap && req.body.dataMap.corporateId) {
        corporateIds.push(req.body.dataMap.corporateId);
      } else {
        corporateIds.push(req.session.userDetails.corporateId);
      }
    } else {
      getGroupCorporates(req.session?.userDetails?.loginPreferenceDetails?.groupId).forEach(
        (corporate) => {
          corporateIds.push(corporate.id);
        },
      );
    }

    let dataList = [];

    let accountXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    let accountWorkbook = XLSX.readFile(accountXlFile);
    let accountXlData = XLSX.utils.sheet_to_json(accountWorkbook.Sheets['accounts']);

    accountXlData.forEach((account) => {
      if (
        account.lastAction.indexOf('Authorized') !== -1 &&
        corporateIds.includes(account.mstId) &&
        accountTypes.includes(account.accountType) &&
        (req.session.userDetails?.loginPreferenceDetails?.bankType == 'Islamic'
          ? record.bankAccountType == 'ISLAMIC'
          : true)
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

    let externalAccountXlFile =
      './dummyServer/json/setup/corporateOnboarding/corporateAccount/data.xlsx';
    let externalAccountWorkbook = XLSX.readFile(externalAccountXlFile);
    let externalAccountXlData = XLSX.utils.sheet_to_json(externalAccountWorkbook.Sheets['Sheet1']);

    externalAccountXlData.forEach((account) => {
      if (
        account.lastAction.indexOf('Authorized') !== -1 &&
        corporateIds.includes(account.corporateId) &&
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
  '/dummyServer/json/setup/corporateOnboarding/corporateMain/private/ibanAccountList',
  (req, res) => {
    console.log('reading Corporate Accounts');
    let dataXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    let workbook = XLSX.readFile(dataXlFile);
    let xlData = XLSX.utils.sheet_to_json(workbook.Sheets['accounts']);

    let accountTypes = ['CURRENT', 'SAVING'];

    if (req.body && req.body.dataMap && req.body.dataMap.accountType) {
      accountTypes = [req.body.dataMap.accountType.toUpperCase()];
    }

    let corporateIds = [];

    if (req.session.userDetails?.loginPreferenceDetails?.loginType != 'group') {
      if (req.body.dataMap && req.body.dataMap.corporateId) {
        corporateIds.push(req.body.dataMap.corporateId);
      } else {
        corporateIds.push(req.session.userDetails.corporateId);
      }
    } else {
      getGroupCorporates(req.session?.userDetails?.loginPreferenceDetails?.groupId).forEach(
        (corporate) => {
          corporateIds.push(corporate.id);
        },
      );
    }

    let dataList = [];

    _.forEach(xlData, function (record) {
      if (
        record.lastAction.indexOf('Authorized') !== -1 &&
        corporateIds.includes(record.mstId) &&
        accountTypes.includes(record.accountType) &&
        (req.session.userDetails?.loginPreferenceDetails?.bankType == 'Islamic'
          ? record.bankAccountType == 'ISLAMIC'
          : true)
      ) {
        dataList.push({
          id: record.id,
          displayName: record.country + record.id + record.bank + record.accountNo,
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
  '/dummyServer/json/setup/corporateOnboarding/corporateMain/private/allIbanAccountList',
  (req, res) => {
    console.log('reading all Accounts of Corporate ');

    let accountTypes = ['CURRENT', 'SAVING'];

    if (req.body && req.body.dataMap && req.body.dataMap.accountType) {
      accountTypes = [req.body.dataMap.accountType.toUpperCase()];
    }

    let corporateIds = [];

    if (req.session.userDetails?.loginPreferenceDetails?.loginType != 'group') {
      if (req.body.dataMap && req.body.dataMap.corporateId) {
        corporateIds.push(req.body.dataMap.corporateId);
      } else {
        corporateIds.push(req.session.userDetails.corporateId);
      }
    } else {
      getGroupCorporates(req.session?.userDetails?.loginPreferenceDetails?.groupId).forEach(
        (corporate) => {
          corporateIds.push(corporate.id);
        },
      );
    }

    let dataList = [];

    let accountXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    let accountWorkbook = XLSX.readFile(accountXlFile);
    let accountXlData = XLSX.utils.sheet_to_json(accountWorkbook.Sheets['accounts']);

    accountXlData.forEach((account) => {
      if (
        account.lastAction.indexOf('Authorized') !== -1 &&
        corporateIds.includes(account.mstId) &&
        accountTypes.includes(account.accountType) &&
        (req.session.userDetails?.loginPreferenceDetails?.bankType == 'Islamic'
          ? record.bankAccountType == 'ISLAMIC'
          : true)
      ) {
        dataList.push({
          id: account.id,
          displayName: account.country + account.id + account.bank + account.accountNo,
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

    let externalAccountXlFile =
      './dummyServer/json/setup/corporateOnboarding/corporateAccount/data.xlsx';
    let externalAccountWorkbook = XLSX.readFile(externalAccountXlFile);
    let externalAccountXlData = XLSX.utils.sheet_to_json(externalAccountWorkbook.Sheets['Sheet1']);

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
  '/dummyServer/json/setup/corporateOnboarding/corporateMain/private/getAllAccounts',
  (req, res) => {
    console.log('reading all Accounts of Corporate ');

    let accountTypes = ['CURRENT', 'SAVING'];

    if (req.body && req.body.dataMap && req.body.dataMap.accountType) {
      accountTypes = [req.body.dataMap.accountType.toUpperCase()];
    }

    let corporateIds = [];

    if (req.session.userDetails?.loginPreferenceDetails?.loginType != 'group') {
      if (req.body.dataMap && req.body.dataMap.corporateId) {
        corporateIds.push(req.body.dataMap.corporateId);
      } else {
        corporateIds.push(req.session.userDetails.corporateId);
      }
    } else {
      getGroupCorporates(req.session?.userDetails?.loginPreferenceDetails?.groupId).forEach(
        (corporate) => {
          corporateIds.push(corporate.id);
        },
      );
    }

    let data = [];

    let accountXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    let accountWorkbook = XLSX.readFile(accountXlFile);
    let accountXlData = XLSX.utils.sheet_to_json(accountWorkbook.Sheets['accounts']);

    accountXlData.forEach((account) => {
      if (
        account.lastAction.indexOf('Authorized') !== -1 &&
        corporateIds.includes(account.mstId) &&
        accountTypes.includes(account.accountType) &&
        (req.session.userDetails?.loginPreferenceDetails?.bankType == 'Islamic'
          ? record.bankAccountType == 'ISLAMIC'
          : true)
      ) {
        data.push({
          id: account.id,
          accountNumber: account.accountNo + '-' + account.currencyCode,
          accountNo: account.accountNo,
          currencyCode: account.currencyCode,
          currencyId: account.currencyId,
          corporateAccountAlias: account.corporateAccountAlias,
          bank: account.bank,
          country: account.country,
          accountType: account.accountType,
          balance: account.balance,
          type: 'Internal',
        });
      }
    });

    let externalAccountXlFile =
      './dummyServer/json/setup/corporateOnboarding/corporateAccount/data.xlsx';
    let externalAccountWorkbook = XLSX.readFile(externalAccountXlFile);
    let externalAccountXlData = XLSX.utils.sheet_to_json(externalAccountWorkbook.Sheets['Sheet1']);

    externalAccountXlData.forEach((account) => {
      if (
        account.lastAction.indexOf('Authorized') !== -1 &&
        corporateIds.includes(account.corporateId) &&
        accountTypes.includes(account.accountType)
      ) {
        data.push({
          id: account.id,
          accountNumber: account.accountNo + '-' + account.currency,
          accountNo: account.accountNo,
          currencyCode: account.currency,
          currencyId: account.currencyId,
          corporateAccountAlias: account.corporateAccountAlias,
          bank: account.bank,
          country: account.country,
          accountType: account.accountType,
          balance: account.availableBalance,
          type: 'External',
        });
      }
    });

    res.json({
      data,
      lastRow: data.length,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

router.post(
  '/dummyServer/json/setup/corporateOnboarding/corporateMain/private/getUserGroups',
  (req, res) => {
    let dataXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
    let workbook = XLSX.readFile(dataXlFile);

    let xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    let dataList = [];

    _.forEach(xlData, function (record) {
      dataList.push({
        id: record.id,
        displayName: record.groupName,
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

router.post(
  '/dummyServer/json/setup/corporateOnboarding/corporateMain/private/getGroupCorporates',
  (req, res) => {
    let groupId = '1';

    if (req.body?.dataMap?.groupId) {
      groupId = req.body.dataMap.groupId;
    } else if (req.session?.userDetails?.groupId) {
      groupId = req.session.userDetails.groupId;
    }

    const dataList = getGroupCorporates(groupId);

    res.json({
      dataList: dataList.map((data) => {
        return {
          id: data.id,
          displayName: data.name,
          enrichments: {
            ...data,
          },
        };
      }),
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

router.post(
  '/dummyServer/json/setup/corporateOnboarding/corporateMain/private/getAllGroupCorporateList',
  (req, res) => {
    let groupId = '1';

    if (req.body?.dataMap?.groupId) {
      groupId = req.body.dataMap.groupId;
    } else if (req.session?.userDetails?.groupId) {
      groupId = req.session.userDetails.groupId;
    }

    const dataList = getGroupCorporates(groupId);

    res.json({
      dataList: [
        {
          id: 'all',
          displayName: 'All Corporates',
          enrichments: {},
        },
        ...dataList.map((data) => {
          return {
            id: data.id,
            displayName: data.name,
            enrichments: {
              ...data,
            },
          };
        }),
      ],
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

router.post(
  '/dummyServer/json/setup/corporateOnboarding/corporateMain/private/getGroupCorporateList',
  (req, res) => {
    let groupId = '1';

    if (req.body?.dataMap?.groupId) {
      groupId = req.body.dataMap.groupId;
    } else if (req.session?.userDetails?.groupId) {
      groupId = req.session.userDetails.groupId;
    }

    const dataList = getGroupCorporates(groupId);

    res.json({
      dataList: dataList.map((data) => {
        return {
          id: data.id,
          displayName: data.name,
          enrichments: {
            ...data,
          },
        };
      }),
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
  let accountsXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['accounts']);

  groupData
    .filter((record) => record.mstId == groupId)
    .forEach((record) => {
      const corporateData = corporateXlData.find((corp) => corp.id == record.corporateId);

      if (corporateData) {
        let totalBalance = 0;
        let totalLimit = 0;
        let totalAccounts = 0;
        accountsXlData
          .filter((acc) => acc.mstId === corporateData.id)
          .forEach((acc) => {
            if (
              record.lastAction.indexOf('Authorized') !== -1 &&
              ['CURRENT', 'SAVING'].includes(acc.accountType)
            ) {
              totalBalance += acc.balance;
              totalLimit += acc.odLimit;
            }
            totalAccounts++;
          });

        dataList.push({
          id: corporateData.id,
          logo: 'assets/images/' + corporateData.corporateImage,
          name: corporateData.corporateName,
          accounts: totalAccounts,
          availableBalance: totalBalance,
          availableLimit: totalLimit,
        });
      }
    });

  return dataList;
};

router.post(
  '/dummyServer/json/setup/corporateOnboarding/corporateGroup/private/getUserGroupList',
  (req, res) => {
    let userId = req.body?.dataMap?.userId;
    if (!userId) {
      userId = req.session?.userDetails?.userId;
    }

    console.log(userId);

    let userXlFile = './dummyServer/json/setup/security/corporateUser/data.xlsx';
    let userWorkbook = XLSX.readFile(userXlFile);

    let userGroupData = XLSX.utils.sheet_to_json(userWorkbook.Sheets['groupUserDetails']);

    const dataList = [];

    userGroupData.forEach((data) => {
      if (data.mstId == userId) {
        dataList.push({
          id: data.groupId,
          displayName: data.groupName,
          enrichments: {},
        });
      }
    });

    res.json({
      dataList,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

router.post(
  '/dummyServer/json/setup/generalMasters/geography/private/getUserCountriesList',
  (req, res) => {
    const dataFilePath = './dummyServer/json/setup/generalMasters/geography/data.xlsx';

    let workbook = XLSX.readFile(dataFilePath);

    let countriesData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    const dataList = [];

    countriesData.forEach((data) => {
      dataList.push({
        id: data.id,
        displayName: data.country,
        enrichments: {
          ...data,
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

router.post('/dummyServer/json/commons/commonService/private/getProductList', (req, res) => {
  let workbook = XLSX.readFile('./dummyServer/json/commons/menuService/corporateMenus.xlsx');
  let mainMenus = XLSX.utils.sheet_to_json(workbook.Sheets['modules']);
  let dataList = [];
  let corporateType = req.body?.dataMap?.corporateType;
  if (!corporateType) corporateType = req.session.userDetails.corporateType;
  _.forEach(mainMenus, function (menu) {
    if (
      (corporateType == 'S' && menu.availableForSME) ||
      (corporateType == 'M' && menu.availableForMSME) ||
      (corporateType != 'S' && corporateType != 'M')
    ) {
      dataList.push({
        id: menu.moduleId,
        displayName: menu.moduleName,
        enrichments: {
          icon: menu.icon,
          product: _.camelCase(menu.moduleName),
          productId: menu.moduleId,
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

router.post('/dummyServer/json/commons/commonService/private/getCorporates', (req, res) => {
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
});

router.post('/dummyServer/json/commons/commonService/private/getProducts', (req, res) => {
  let workbook = XLSX.readFile('./dummyServer/json/commons/menuService/corporateMenus.xlsx');
  let mainMenus = XLSX.utils.sheet_to_json(workbook.Sheets['modules']);

  let data = [];

  let corporateType = req.body?.dataMap?.corporateType;
  if (!corporateType) corporateType = req.session.userDetails.corporateType;
  _.forEach(mainMenus, function (menu) {
    if (
      (corporateType == 'S' && menu.availableForSME) ||
      (corporateType == 'M' && menu.availableForMSME) ||
      (corporateType != 'S' && corporateType != 'M')
    ) {
      data.push({
        id: menu.id,
        productCode: menu.moduleId,
        productName: menu.moduleName,
      });
    }
  });

  res.json({
    data: data,
    lastRow: data.length,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

router.post('/dummyServer/json/commons/commonService/private/getProductModuleList', (req, res) => {
  console.log(
    'reading Product list based on Corporate Type : ' + req.session.userDetails.corporateType,
  );

  let workbook = XLSX.readFile('./dummyServer/json/commons/menuService/corporateMenus.xlsx');
  let menus = XLSX.utils.sheet_to_json(workbook.Sheets['menus']);
  let dataList = [];

  // let menus = JSON.parse(
  //   fs.readFileSync(
  //     './dummyServer/json/menus-' + req.session.userDetails.corporateType + '.json',
  //     'utf8',
  //   ),
  // );

  // let dataList = [];

  const menu = menus.filter((m) => m.moduleId == req.body.dataMap.module && m.parentMenuId != 0);

  menu.forEach((curMenu) => {
    dataList.push({
      id: _.camelCase(curMenu.displayName),
      displayName: curMenu.displayName,
      enrichments: {},
    });
  });

  res.json({
    dataList: dataList,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

router.post('/dummyServer/json/commons/commonService/private/getUserNotifications', (req, res) => {
  const user = req.session.userDetails.userId;

  const dataFilePath = './dummyServer/json/commons/notificationService/data.xlsx';

  const dataWorkbook = XLSX.readFile(dataFilePath);

  const dataList = XLSX.utils.sheet_to_json(dataWorkbook.Sheets['Sheet1']);

  const toDay = moment(new Date());

  const todayNotifications = [];
  const yesterdayNotifications = [];
  const earlierNotifications = [];

  dataList
    .filter((d) => d.userId == user)
    .forEach((record) => {
      const notificationDate = moment(new Date(record.dateTime));
      const dateDiff = toDay.diff(notificationDate, 'days');

      if (dateDiff == 0) {
        todayNotifications.push(record);
      } else if (dateDiff == 1) {
        yesterdayNotifications.push(record);
      } else {
        earlierNotifications.push(record);
      }
    });

  res.json({
    data: {
      today: todayNotifications,
      yesterday: yesterdayNotifications,
      earlier: earlierNotifications,
    },
    responseStatus: { message: '', status: '0' },
  });
});

router.post('/dummyServer/json/commons/commonService/private/getUserNewsFeed', (req, res) => {
  const dataFilePath = './dummyServer/json/commons/newsFeedService/data.xlsx';

  const dataWorkbook = XLSX.readFile(dataFilePath);

  const dataList = XLSX.utils.sheet_to_json(dataWorkbook.Sheets['Sheet1']);

  console.log(dataList);

  res.json({
    dataList,
    responseStatus: { message: '', status: '0' },
  });
});

router.post('/dummyServer/json/commons/menuService/private/getAccessRightList', (req, res) => {
  let workbook = XLSX.readFile('./dummyServer/json/commons/menuService/corporateMenus.xlsx');
  const menus = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[1]]);

  let response = {};
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

router.post('/dummyServer/json/commons/userService/getCorporateUsers', (req, res) => {
  const dataXlFile = './dummyServer/json/setup/security/corporateUser/data.xlsx';

  const existingWb = XLSX.readFile(dataXlFile);

  const data = XLSX.utils.sheet_to_json(existingWb.Sheets['Sheet1']);

  const dataList = data.map((d) => {
    return {
      id: d.id,
      displayName: d.userId,
      enrichments: {
        userFrom: 'CORPORATE',
        emailAddress: d.email,
        firstName: d.firstName,
        categoryId: d.categoryId,
        category: d.categoryName,
        // ...d,
      },
    };
  });

  res.json({ dataList, responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
});

router.post('/dummyServer/json/commons/userService/updateUserDetails', (req, res) => {
  const userDetails = {
    loginId: 'tovmaker',
    corporateId: '100083',
    corporateCode: '999200',
    corporateName: 'Toyota Motors Malaysia',
    corporateType: 'L',
    applicationDate: '24-Dec-2021',
    smsVerification: true,
    mobileVerification: true,
    deviceVerification: true,
    webVerification: true,
    isSelfAuth: false,
    fullName: 'James Tan',
    firstName: 'James',
    lastName: 'Tan',
    mobileNumber: 9087654321,
    profileName: 'Chief Executive Officer',
    isGroupUser: 'Y',
    authType: ['SOFTTOKEN'],
    landingPage: 'Payments',
    consolidatedwidget: 'Y',
    currentServerTimeSec: '15:20:07',
    currentServerTimeA: '03:20 PM',
    lastLoginDateTime: '24-Dec-2021 01:20 pm',
    lastFailedLogin: '22-Dec-2021 03:20:07',
    lastLoginTime: '01:20 pm',
    lastCorporateLoginDateTime: '02:20 PM, 24 Dec 2021',
    tokenUsed: 'TI12456',
    token: 'xxx12456',
    userImage: './../../../assets/images/avatar.jpg',
    corporateImage: './../../../assets/images/corporate.png',
    quickActions: [
      { displayName: 'Single Payment', link: '' },
      { displayName: 'Add Beneficiary', link: '' },
      { displayName: 'Bulk Payment', link: '' },
      { displayName: 'Apply For Loan', link: '' },
      { displayName: 'Start Investing', link: '' },
      { displayName: 'Create VA', link: '' },
    ],
    accountDetails: {
      accountNumber: 999200000011,
      accountType: 'Business Savings',
      accountBalance: 788800,
    },
  };

  const dataXlFile = './dummyServer/json/setup/security/corporateUser/data.xlsx';

  const filters = [];

  filters.push({ name: 'userId', value: req.body.userId });

  const data = getViewData(dataXlFile, filters);

  data.phishingDetails[0].phishingImageFileName = req.body.phishingImage;
  data.phishingDetails[0].message = req.body.message;

  updateRecordInExcel(dataXlFile, data, userDetails);

  const existingWb = XLSX.readFile(dataXlFile);

  const sheets = generateAuthorizeSheetData(userDetails, { ids: [data.id] }, existingWb);

  updateWorkbook(existingWb, sheets, dataXlFile);

  res.json({
    data: data.phishingDetails,
    responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' },
  });
});

module.exports = router;
