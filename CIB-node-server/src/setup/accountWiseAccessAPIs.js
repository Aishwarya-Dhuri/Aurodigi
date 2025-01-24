var addRecordInExcel = require('../crudAPIs').addRecordInExcel;
var getViewData = require('../crudAPIs').getViewData;
var updateWorkbook = require('../crudAPIs').updateWorkbook;
var generateAuthorizeSheetData = require('../crudAPIs').generateAuthorizeSheetData;
var getAuthorizedListRecords = require('../listingAPIs').getAuthorizedListRecords;
var deleteRecord = require('../crudAPIs').deleteRecord;
const _ = require('lodash');
var express = require('express');
var XLSX = require('xlsx');

var router = express.Router();

router.post(
  '/dummyServer/json/setup/generalMasters/accountWiseAccess/private/authorize',
  (req, res) => {
    console.log('--------');

    var dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
    var existingWb = XLSX.readFile(dataXlFile);

    var sheets = generateAuthorizeSheetData(req.session.userDetails, req.body.dataMap, existingWb);
    updateWorkbook(existingWb, sheets, dataXlFile);

    // const authorizedDataFile =
    //   '.' + req.url.substring(0, req.url.indexOf('private')) + 'authorizedData.xlsx';

    req.body.dataMap.ids.forEach((id) => {
      const filters = [{ name: 'id', value: id }];

      const accountWiseAccessData = getViewData(dataXlFile, filters);

      if (accountWiseAccessData) {
        accountWiseAccessData.users.forEach((user) => {
          const data = _.cloneDeep({ ...accountWiseAccessData });
          data.users = [user];

          data.noOfUsers = 1;

          delete data.id;
          delete data.version;

          const authorizedData = addRecordInExcel(dataXlFile, data, req.session.userDetails);

          var authorizedDataWb = XLSX.readFile(dataXlFile);

          var sheets = generateAuthorizeSheetData(
            req.session.userDetails,
            { ids: [authorizedData.id] },
            authorizedDataWb,
          );
          updateWorkbook(authorizedDataWb, sheets, dataXlFile);
        });

        deleteRecord(dataXlFile, accountWiseAccessData.id);
      }
    });

    res.json({ responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
  },
);

// router.post(
//   '/dummyServer/json/setup/generalMaster/accountWiseAccess/private/getAuthorizedList',
//   (req, res) => {
//     var dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'authorizedData.xlsx';

//     res.json(getAuthorizedListRecords(dataXlFile, req.body, req.session.userDetails));
//   },
// );

router.post(
  '/dummyServer/json/setup/generalMaster/accountWiseAccess/private/getProducts',
  (req, res) => {
    let users = [];
    let accounts = [];

    if (req.session.userDetails?.loginPreferenceDetails?.loginType != 'group') {
      let corporateId; //= req.session.userDetails.corporateId;
      if (req.body.dataMap && req.body.dataMap.corporateId) {
        corporateId = req.body.dataMap.corporateId;
      } else {
        corporateId = req.session.userDetails.corporateId;
      }
      users = getUsers(corporateId);
      accounts = getAccounts(corporateId);
    } else {
      users = getGroupUsers(req.session?.userDetails?.loginPreferenceDetails?.groupId);
      accounts = getGroupAccounts(req.session?.userDetails?.loginPreferenceDetails?.groupId);
    }

    var productXlFile = './dummyServer/json/setup/generalMasters/accountWiseAccess/products.xlsx';
    var productWorkbook = XLSX.readFile(productXlFile);
    const productData = XLSX.utils.sheet_to_json(productWorkbook.Sheets['Sheet1']);

    let products = productData.map((product) => {
      const filters = [{ name: 'id', value: product.id }];

      const data = getViewData(productXlFile, filters);
      return data;
    });

    products = products.map((p) => {
      p['children'] = p.products
        ? p.products.map((pp) => {
            pp['children'] = pp.subProducts
              ? pp.subProducts.map((ppp) => {
                  ppp['children'] = [];

                  return ppp;
                })
              : [];

            delete pp.subProducts;

            return pp;
          })
        : [];

      delete p.products;

      return p;
    });

    res.json({
      data: prepareProductsData(products, users, accounts),
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

const prepareProductsData = (products, users, accounts) => {
  return products.map((product) => {
    if (product.children && product.children.length > 0) {
      product.children = prepareProductsData(product.children, users, accounts);
    }
    product['data'] = '0';
    product['users'] = users;
    product['accounts'] = accounts;
    product['selectedData'] = [];

    return product;
  });
};

router.post(
  '/dummyServer/json/setup/generalMaster/accountWiseAccess/private/getUsers',
  (req, res) => {
    let corporateId; //= req.session.userDetails.corporateId;
    if (req.body.dataMap && req.body.dataMap.corporateId) {
      corporateId = req.body.dataMap.corporateId;
    } else {
      corporateId = req.session.userDetails.corporateId;
    }
    var data = getUsers(corporateId);
    const response = {
      data: data,
      lastRow: data.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    };

    res.json(response);
  },
);

const getUsers = (corporateId) => {
  var userXlFile = './dummyServer/json/setup/security/corporateUser/data.xlsx';
  var userWorkbook = XLSX.readFile(userXlFile);

  const userData = XLSX.utils.sheet_to_json(userWorkbook.Sheets['Sheet1']);
  const userOrganizationData = XLSX.utils.sheet_to_json(userWorkbook.Sheets['organization']);

  var accountWiseAccessXlFile =
    './dummyServer/json/setup/generalMasters/accountWiseAccess/data.xlsx';
  var accountWiseAccessWorkbook = XLSX.readFile(accountWiseAccessXlFile);

  const accountWiseAccessUsersData = XLSX.utils.sheet_to_json(
    accountWiseAccessWorkbook.Sheets['users'],
  );

  const data = [];

  userData
    .filter(
      (user) => user.lastAction.indexOf('Authorized') !== -1 && corporateId == user.corporateId,
    )
    .forEach((user) => {
      const organization = userOrganizationData.find((org) => org.mstId == user.id);

      const awaUser = accountWiseAccessUsersData.find(
        (accountWiseAccessUser) =>
          accountWiseAccessUser.uaid == user.userId &&
          accountWiseAccessUser.lastAction.indexOf('Authorized') !== -1,
      );

      if (!awaUser) {
        data.push({
          uaid: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          profile: organization ? organization.profile : 'Manager',
        });
      }
    });

  return data;
};

const getGroupUsers = (groupId) => {
  var userXlFile = './dummyServer/json/setup/security/corporateUser/data.xlsx';
  var userWorkbook = XLSX.readFile(userXlFile);

  const userData = XLSX.utils.sheet_to_json(userWorkbook.Sheets['Sheet1']);
  const userOrganizationData = XLSX.utils.sheet_to_json(userWorkbook.Sheets['organization']);

  var accountWiseAccessXlFile =
    './dummyServer/json/setup/generalMasters/accountWiseAccess/data.xlsx';
  var accountWiseAccessWorkbook = XLSX.readFile(accountWiseAccessXlFile);

  const accountWiseAccessUsersData = XLSX.utils.sheet_to_json(
    accountWiseAccessWorkbook.Sheets['users'],
  );

  const data = [];

  userData
    .filter((user) => user.lastAction.indexOf('Authorized') !== -1 && groupId == user.groupId)
    .forEach((user) => {
      const organization = userOrganizationData.find((org) => org.mstId == user.id);

      const awaUser = accountWiseAccessUsersData.find(
        (accountWiseAccessUser) =>
          accountWiseAccessUser.uaid == user.userId &&
          accountWiseAccessUser.lastAction.indexOf('Authorized') !== -1,
      );

      if (!awaUser) {
        data.push({
          uaid: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          profile: organization ? organization.profile : 'Manager',
        });
      }
    });

  return data;
};

router.post(
  '/dummyServer/json/setup/generalMaster/accountWiseAccess/private/getAccounts',
  (req, res) => {
    let data = [];

    if (req.session.userDetails?.loginPreferenceDetails?.loginType != 'group') {
      let corporateId; //= req.session.userDetails.corporateId;
      if (req.body.dataMap && req.body.dataMap.corporateId) {
        corporateId = req.body.dataMap.corporateId;
      } else {
        corporateId = req.session.userDetails.corporateId;
      }
      data = getAccounts(corporateId);
    } else {
      data = getGroupAccounts(req.session?.userDetails?.loginPreferenceDetails?.groupId);
    }

    const response = {
      data,
      lastRow: data.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    };

    res.json(response);
  },
);

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

module.exports = router;
