const express = require('express');
const XLSX = require('xlsx');
let _ = require('lodash');
const router = express.Router();

const getViewData = require('./crudAPIs').getViewData;

const updateRecordInExcel = require('./crudAPIs').updateRecordInExcel;

const generateAuthorizeSheetData = require('./crudAPIs').generateAuthorizeSheetData;
const updateWorkbook = require('./crudAPIs').updateWorkbook;

router.post(
  '/dummyServer/json/setup/userPersonalization/private/getUserPersonalizationData',
  (req, res) => {
    const personalizationData = {
      userDetails: getUserDetails(req),
      alertsAndNotificationsDetails: getAlerts(req),
      widgetMappingDetails: getWidgets(req),
      makerCheckerLimitDetails: getMakerCheckerLimit(req),
      authMatrixInfoDetails: getAuthMatrix(req),
      accountWiseAccessInfoDetails: {
        productWiseAccountAccessDetails: getAccountWiseAccessProductData(req),
        accountWiseAccountAccessDetails: getAccountWiseAccessAccountData(req),
      },
    };

    const response = {
      data: personalizationData,
      responseStatus: { message: '', status: '0' },
    };

    res.send(response);
  },
);

const getUserDetails = (req) => {
  const filters = [{ name: 'userId', value: req.session.userDetails.userName }];

  const userData = getViewData(
    './dummyServer/json/setup/security/corporateUser/data.xlsx',
    filters,
  );

  return userData;
};

const getWidgets = (req) => {
  const widgetMappingFilters = [
    { name: 'loginId', value: req.session.userDetails.userName },
    { name: 'requestBy', value: 'CORPORATE' },
  ];

  const widgetMappingData = getViewData(
    './dummyServer/json/commons/dashboardService/usersDashboard/data.xlsx',
    widgetMappingFilters,
  );

  // console.log(widgetMappingFilters, widgetMappingData);

  const products = new Array();

  widgetMappingData.consolidated.forEach((widget) => {
    const i = products.findIndex((product) => product.productId === widget.productId);

    if (i >= 0) {
      products[i].widgets.push(widget);
    } else {
      const product = {
        productId: widget.productId,
        name: widget.productName,
        widgets: [widget],
        isExpand: false,
      };

      products.push(product);
    }
  });

  const mainModules = getMainModules(req);

  let i = products.length;

  while (i--) {
    const module = mainModules.find((m) => m.moduleId == products[i].productId);

    if (!module) {
      products.splice(i, 1);
    }
  }

  if (products.length > 0) {
    products[0].isExpand = true;
  }

  return products;
};

const getAlerts = (req) => {
  const alertWorkbook = XLSX.readFile(
    './dummyServer/json/setup/templateManagement/alert/data.xlsx',
  );

  const alertsData = XLSX.utils.sheet_to_json(alertWorkbook.Sheets['Sheet1']);

  const alertMappingFilters = [{ name: 'corporateId', value: req.session.userDetails.corporateId }];

  const alertMappingData = getViewData(
    './dummyServer/json/setup/templateManagement/alertMapping/data.xlsx',
    alertMappingFilters,
  );

  alertMappingData.alertMappingDetails = alertMappingData.alertMappingDetails.map((curAlert) => {
    const alert = alertsData.find((d) => d.id == curAlert.alertId);
    return alert;
  });

  const mainModules = getMainModules(req);

  const data = [];

  for (let i = 0; i < mainModules.length; i++) {
    data.push({
      moduleId: mainModules[i].moduleId,
      moduleName: mainModules[i].moduleName,
      isExpand: i == 0,
      alerts: alertMappingData.alertMappingDetails
        .filter((alert) => alert.moduleId == mainModules[i].moduleId)
        .map((alert) => {
          alert.channelType = alert.channelType.split(',');
          alert.sendAlertTo = alert.sendAlertTo.split(',');
          alert.actions = getAlertActions(alert.status);
          return alert;
        }),
    });
  }

  return data;
};

const getAuthMatrix = (req) => {
  const authMatrixWorkbook = XLSX.readFile(
    './dummyServer/json/setup/security/corporateAuthorizationMatrix/data.xlsx',
  );

  const authMatrixXlData = XLSX.utils.sheet_to_json(authMatrixWorkbook.Sheets['Sheet1']);

  const data = [];

  authMatrixXlData
    .filter((record) => record.corporateId == req.session.userDetails.corporateId)
    .forEach((record) => {
      const authMatrixFilters = [{ name: 'id', value: record.id }];

      // console.log(record.id);

      const authMatrixData = getViewData(
        './dummyServer/json/setup/security/corporateAuthorizationMatrix/data.xlsx',
        authMatrixFilters,
      );

      const newAuthMatrixData = {
        id: authMatrixData.id,
        product: authMatrixData?.moduleName,
        accounts: authMatrixData?.accountsMapped.split(','),
        slab:
          authMatrixData?.currencyName +
          ' ' +
          authMatrixData.slabs[0]?.slabStartRange +
          ' - ' +
          authMatrixData?.currencyName +
          ' ' +
          authMatrixData.slabs[0]?.slabEndRange,
        authType: authMatrixData?.authorizationLevel,
        additionalInfo:
          'You are the 2 level authorizer. 1 more authorizer is required at your level.',
      };

      const i = data.findIndex((d) => d.productId == record.product);

      if (i >= 0) {
        data[i].authMatrixData.push(newAuthMatrixData);
      } else {
        const authMatrixData = {
          productId: record.product,
          productName: record.productName,
          authMatrixData: [newAuthMatrixData],
          isExpand: false,
        };

        data.push(authMatrixData);
      }
    });

  const mainModules = getMainModules(req);

  let i = data.length;

  while (i--) {
    const module = mainModules.find((m) => m.moduleId == data[i].productId);

    if (!module) {
      data.splice(i, 1);
    }
  }

  if (data.length > 0) {
    data[0].isExpand = true;
  }

  return data;
};

const getMakerCheckerLimit = (req) => {
  const makerCheckerLimitWorkbook = XLSX.readFile(
    './dummyServer/json/commons/makerCheckerLimit/data.xlsx',
  );

  const makerCheckerLimitXlData = XLSX.utils.sheet_to_json(
    makerCheckerLimitWorkbook.Sheets['Sheet1'],
  );

  const makerCheckerLimitData = [];

  makerCheckerLimitXlData
    .filter((record) => record.corporateId == req.session.userDetails.corporateId)
    .forEach((record) => {
      const newMakerCheckerLimitData = {
        subProduct: record.subProduct,
        subProductName: record.subProductName,
        currency: record.currencyName,
        makerAllottedLimit: record.makerAllottedLimit,
        makerAvailableLimit: record.makerAvailableLimit,
        checkerAllottedLimit: record.checkerAllottedLimit,
        checkerAvailableLimit: record.checkerAvailableLimit,
      };

      const i = makerCheckerLimitData.findIndex((d) => d.productId == record.product);

      if (i >= 0) {
        makerCheckerLimitData[i].data.push(newMakerCheckerLimitData);
      } else {
        const makerCheckerLimitProductData = {
          productId: record.product,
          productName: record.productName,
          data: [newMakerCheckerLimitData],
        };

        makerCheckerLimitData.push(makerCheckerLimitProductData);
      }
    });

  const mainModules = getMainModules(req);

  let i = makerCheckerLimitData.length;

  while (i--) {
    const module = mainModules.find((m) => m.moduleId == makerCheckerLimitData[i].productId);

    if (!module) {
      makerCheckerLimitData.splice(i, 1);
    }
  }

  const data = [];

  makerCheckerLimitData.forEach((module, i) => {
    data.push({
      id: module.productId + i,
      product: [module.productName],
      makerAllottedLimit: 0,
      makerAvailableLimit: 0,
      checkerAllottedLimit: 0,
      checkerAvailableLimit: 0,
      currency: '',
    });

    module.data.forEach((product, j) => {
      data.push({
        id: module.productId + product.subProduct + i + j,
        product: [module.productName, product.subProductName],
        makerAllottedLimit: product.makerAllottedLimit,
        makerAvailableLimit: product.makerAvailableLimit,
        checkerAllottedLimit: product.checkerAllottedLimit,
        checkerAvailableLimit: product.checkerAvailableLimit,
        currency: product.currency,
      });

      const index = data.findIndex((d) => d.id == module.productId + i);
      data[index].makerAllottedLimit += +product.makerAllottedLimit;
      data[index].makerAvailableLimit += +product.makerAvailableLimit;
      data[index].checkerAllottedLimit += +product.checkerAllottedLimit;
      data[index].checkerAvailableLimit += +product.checkerAvailableLimit;
      data[index].currency = product.currency;
    });
  });

  return data;
};

const getAccountWiseAccessProductData = (req) => {
  var accountWiseAccessXlFile =
    './dummyServer/json/setup/generalMasters/accountWiseAccess/data.xlsx';
  var accountWiseAccessWorkbook = XLSX.readFile(accountWiseAccessXlFile);

  const accountWiseAccessUsersData = XLSX.utils.sheet_to_json(
    accountWiseAccessWorkbook.Sheets['users'],
  );

  const accountWiseAccessUser = accountWiseAccessUsersData.find(
    (user) =>
      user.uaid == req.session.userDetails.userName && user.lastAction.indexOf('Authorized') !== -1,
  );

  const data = [];

  if (accountWiseAccessUser) {
    const accountWiseAccessFilters = [{ name: 'id', value: accountWiseAccessUser.mstId }];

    const accountWiseAccessData = getViewData(
      './dummyServer/json/setup/generalMasters/accountWiseAccess/data.xlsx',
      accountWiseAccessFilters,
    );

    accountWiseAccessData.products.forEach((product) => {
      const productData = {
        id: product.id,
        label: product.label,
        key: product.key,
        subProducts: [],
        count: 0,
        isExpand: false,
      };

      const subProducts = [];

      product?.children?.forEach((child1) => {
        subProducts.push({
          id: child1.id,
          subProduct: [child1.label],
          accounts: '-',
          rights: 'Maker,Checker',
        });

        if (child1?.children?.length > 0) {
          child1?.children?.forEach((child2) => {
            subProducts.push({
              id: child2.id,
              subProduct: [child1.label, child2.label],
              accounts: '-',
              rights: 'Maker,Checker',
            });

            if (child2?.children?.length > 0) {
              child2?.children?.forEach((child3) => {
                subProducts.push({
                  id: child3.id,
                  subProduct: [child1.label, child2.label, child3.label],
                  accounts: '-',
                  rights: 'Maker,Checker',
                });

                const child3Index = subProducts.findIndex(
                  (subProduct) => subProduct.id == child3.id,
                );

                subProducts[child3Index].accounts = child3.selectedData.length + ' Accounts';
                productData.count += child3.selectedData.length;

                child3.selectedData.forEach((account, c) => {
                  let blankSpaces = '-';
                  for (let i = 0; i < c; i++) {
                    blankSpaces += ' ';
                  }

                  subProducts.push({
                    id: child3.id,
                    subProduct: [child1.label, child2.label, child3.label, blankSpaces],
                    accounts: account.uaid,
                    rights: 'Maker,Checker',
                  });
                });
              });
            } else {
              const child2Index = subProducts.findIndex((subProduct) => subProduct.id == child2.id);

              subProducts[child2Index].accounts = child2.selectedData.length + ' Accounts';
              productData.count += child2.selectedData.length;

              child2.selectedData.forEach((account, c) => {
                let blankSpaces = '-';
                for (let i = 0; i < c; i++) {
                  blankSpaces += ' ';
                }

                subProducts.push({
                  id: child1.id,
                  subProduct: [child1.label, child2.label, blankSpaces],
                  accounts: account.uaid,
                  rights: 'Maker,Checker',
                });
              });
            }
          });
        } else {
          const child1Index = subProducts.findIndex((subProduct) => subProduct.id == child1.id);

          subProducts[child1Index].accounts = child1.selectedData.length + ' Accounts';

          productData.count += child1.selectedData.length;

          child1.selectedData.forEach((account, c) => {
            let blankSpaces = '-';
            for (let i = 0; i < c; i++) {
              blankSpaces += ' ';
            }

            subProducts.push({
              id: child1.id,
              subProduct: [child1.label, blankSpaces],
              accounts: account.uaid,
              rights: 'Maker,Checker',
            });
          });
        }
      });

      productData.subProducts = subProducts;

      data.push(productData);
    });
  }

  if (data.length > 0) {
    data[0].isExpand = true;
  }

  return data;
};

const getAccountWiseAccessAccountData = (req) => {
  var accountWiseAccessXlFile =
    './dummyServer/json/setup/generalMasters/accountWiseAccess/data.xlsx';
  var accountWiseAccessWorkbook = XLSX.readFile(accountWiseAccessXlFile);

  const accountWiseAccessUsersData = XLSX.utils.sheet_to_json(
    accountWiseAccessWorkbook.Sheets['users'],
  );

  const accountWiseAccessUser = accountWiseAccessUsersData.find(
    (user) =>
      user.uaid == req.session.userDetails.userName && user.lastAction.indexOf('Authorized') !== -1,
  );

  const data = [];

  if (accountWiseAccessUser) {
    const accountWiseAccessFilters = [{ name: 'id', value: accountWiseAccessUser.mstId }];

    const accountWiseAccessData = getViewData(
      './dummyServer/json/setup/generalMasters/accountWiseAccess/data.xlsx',
      accountWiseAccessFilters,
    );

    let accounts = [];

    if (req.session.userDetails?.loginPreferenceDetails?.loginType != 'group') {
      let corporateId; //= req.session.userDetails.corporateId;
      if (req.body.dataMap && req.body.dataMap.corporateId) {
        corporateId = req.body.dataMap.corporateId;
      } else {
        corporateId = req.session.userDetails.corporateId;
      }
      accounts = getAccounts(corporateId);
    } else {
      accounts = getGroupAccounts(req.session?.userDetails?.loginPreferenceDetails?.groupId);
    }

    accounts.forEach((account, t) => {
      const accountData = {
        id: new Date().getTime() + t,
        label: account.uaid,
        products: [],
        count: 0,
        isExpand: false,
      };

      const products = [];

      accountWiseAccessData.products.forEach((product, i) => {
        const acc = product.selectedData.find((data) => data.uaid == account.uaid);

        if (acc) {
          products.push({
            id: product.id,
            product: [product.label],
            subProduct: 0,
            rights: 'Maker,Checker',
          });

          const productIndex = products.findIndex((p) => p.id == product.id);

          product?.children?.forEach((child1, j) => {
            const acc = child1.selectedData.find((data) => data.uaid == account.uaid);

            let blankSpace = '-';

            if (acc) {
              for (let b = 0; b < j; b++) {
                blankSpace += ' ';
              }

              products.push({
                id: product.id,
                product: [product.label, blankSpace],
                subProduct: child1.label,
                rights: 'Maker,Checker',
              });

              products[productIndex].subProduct++;

              if (child1?.children?.length > 0) {
                child1?.children?.forEach((child2, k) => {
                  const acc = child2.selectedData.find((data) => data.uaid == account.uaid);

                  let blankSpace = '-';

                  if (acc) {
                    for (let b = 0; b < k + 1; b++) {
                      blankSpace += ' ';
                    }

                    products.push({
                      id: product.id,
                      product: [product.label, child1.label, blankSpace],
                      subProduct: child2.label,
                      rights: 'Maker,Checker',
                    });

                    products[productIndex].subProduct++;

                    if (child2?.children?.length > 0) {
                      child2?.children?.forEach((child3, l) => {
                        const acc = child3.selectedData.find((data) => data.uaid == account.uaid);

                        let blankSpace = '-';

                        if (acc) {
                          for (let b = 0; b < l + 1; b++) {
                            blankSpace += ' ';
                          }

                          products.push({
                            id: product.id,
                            product: [product.label, child1.label, child2.label, blankSpace],
                            subProduct: child3.label,
                            rights: 'Maker,Checker',
                          });

                          products[productIndex].subProduct++;
                        }
                      });
                    }
                  }
                });
              }
            }
          });

          products[productIndex].subProduct = products[productIndex].subProduct + ' Products';
        }
      });

      accountData.products = products;
      accountData.count = products.length;

      data.push(accountData);
    });
  }

  if (data.length > 0) {
    data[0].isExpand = true;
  }

  return data;
};

const getAlertActions = (status) => {
  if (status == 'Enabled') {
    return [
      {
        index: 1,
        methodName: 'viewAlert',
        paramList: 'id',
        displayName: 'View',
        type: 'ICON',
        icon: 'pi pi-eye',
      },
      {
        index: 1,
        methodName: 'disableAlert',
        paramList: 'id',
        displayName: 'Disable',
        type: 'ICON',
        icon: 'pi pi-times-circle',
      },
      {
        index: 1,
        methodName: 'suspendAlert',
        paramList: 'id',
        displayName: 'Suspend',
        type: 'ICON',
        icon: 'pi pi-minus-circle',
      },
    ];
  }
  return [
    {
      index: 1,
      methodName: 'viewAlert',
      paramList: 'id',
      displayName: 'View',
      type: 'ICON',
      icon: 'pi pi-eye',
    },
    {
      index: 1,
      methodName: 'enableAlert',
      paramList: 'id',
      displayName: 'Enable',
      type: 'ICON',
      icon: 'pi pi-play',
    },
  ];
};

const getMainModules = (req) => {
  let mainModuleWorkbook = XLSX.readFile(
    './dummyServer/json/commons/menuService/corporateMenus.xlsx',
  );

  let mainModules = XLSX.utils.sheet_to_json(mainModuleWorkbook.Sheets['modules']);

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
  for (let i = mainModules.length - 1; i >= 0; i--) {
    let found = false;
    for (let j = 0; j < moduleIdsFromRoles.length; j++) {
      if (mainModules[i].moduleId.toString() == moduleIdsFromRoles[j].moduleId.toString()) {
        found = true;
        break;
      }
    }
    if (!found) {
      mainModules.splice(i, 1);
    }
  }

  return mainModules;
};

const getAccounts = (corporateId) => {
  const data = [];

  var accountXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
  var accountWorkbook = XLSX.readFile(accountXlFile);
  const accountData = XLSX.utils.sheet_to_json(accountWorkbook.Sheets['accounts']);

  accountData
    .filter(
      (account) => account.lastAction.indexOf('Authorized') !== -1 && corporateId == account.mstId,
    )
    .forEach((account) => {
      data.push({
        uaid: account.accountNo + '-' + account.currencyCode,
        accountType: account.accountType,
        aliasName: account.corporateAccountAlias,
        currency: account.currencyCode,
        category: 'IA',
      });
    });

  var externalAccountXlFile =
    './dummyServer/json/setup/corporateOnboarding/corporateAccount/data.xlsx';
  var externalAccountWorkbook = XLSX.readFile(externalAccountXlFile);
  var externalAccountXlData = XLSX.utils.sheet_to_json(externalAccountWorkbook.Sheets['Sheet1']);

  externalAccountXlData
    .filter(
      (account) =>
        account.lastAction.indexOf('Authorized') !== -1 && corporateId == account.corporateId,
    )
    .forEach((account) => {
      data.push({
        uaid: account.accountNo + '-' + account.currency,
        accountType: account.accountType,
        aliasName: account.accountName,
        currency: account.currency,
        category: 'EA',
      });
    });

  return data;
};

const getGroupAccounts = (groupId) => {
  const groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
  const groupWorkbook = XLSX.readFile(groupXlFile);
  const groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

  const dataXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
  const workbook = XLSX.readFile(dataXlFile);
  const corporateXlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
  const corporateAccountsXlData = XLSX.utils.sheet_to_json(workbook.Sheets['accounts']);

  const externalAccountXlFile =
    './dummyServer/json/setup/corporateOnboarding/corporateAccount/data.xlsx';
  const externalAccountWorkbook = XLSX.readFile(externalAccountXlFile);
  const externalAccountXlData = XLSX.utils.sheet_to_json(externalAccountWorkbook.Sheets['Sheet1']);

  let accountTypes = ['CURRENT', 'SAVING'];

  let data = [];

  groupData
    .filter((record) => {
      return record.mstId == groupId;
    })
    .forEach((corporate) => {
      const corporateData = corporateXlData.find((corp) => corp.id == corporate.corporateId);

      corporateAccountsXlData
        .filter((record) => {
          return (
            record.lastAction.indexOf('Authorized') !== -1 &&
            corporateData.id == record.mstId &&
            accountTypes.includes(record.accountType)
          );
        })
        .forEach((account) => {
          data.push({
            corporateId: corporateData.id,
            corporateCode: corporateData.corporateCode,
            corporateName: corporateData.corporateName,
            uaid: account.accountNo + '-' + account.currencyCode,
            accountType: account.accountType,
            aliasName: account.corporateAccountAlias,
            currency: account.currencyCode,
            category: 'IA',
          });
        });

      externalAccountXlData
        .filter(
          (account) =>
            account.lastAction.indexOf('Authorized') !== -1 &&
            corporate.corporateId == account.corporateId,
        )
        .forEach((account) => {
          data.push({
            corporateId: corporateData.id,
            corporateCode: corporateData.corporateCode,
            corporateName: corporateData.corporateName,
            uaid: account.accountNo + '-' + account.currency,
            accountType: account.accountType,
            aliasName: account.accountName,
            currency: account.currency,
            category: 'EA',
          });
        });
    });

  return data;
};

router.post(
  '/dummyServer/json/commons/userPersonalization/private/updateUserDetails',
  (req, res) => {
    const dataXlFile = './dummyServer/json/setup/security/corporateUser/data.xlsx';

    const filters = [];

    filters.push({ name: 'userId', value: req.session.userDetails.userName });

    const data = getViewData(dataXlFile, filters);

    const newData = { ...data, ...req.body.dataMap.data };

    updateRecordInExcel(dataXlFile, newData, req.session.userDetails);

    const existingWb = XLSX.readFile(dataXlFile);

    const sheets = generateAuthorizeSheetData(
      req.session.userDetails,
      { ids: [newData.id] },
      existingWb,
    );

    updateWorkbook(existingWb, sheets, dataXlFile);

    res.json({
      data: newData,
      responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' },
    });
  },
);

module.exports = router;
