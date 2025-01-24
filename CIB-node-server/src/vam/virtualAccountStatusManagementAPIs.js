var express = require('express');
var XLSX = require('xlsx');
var router = express.Router();

const updateRecordInExcel = require('../crudAPIs').updateRecordInExcel;
const generateAuthorizeSheetData = require('../crudAPIs').generateAuthorizeSheetData;
const updateWorkbook = require('../crudAPIs').updateWorkbook;
const getViewData = require('../crudAPIs').getViewData;

router.post(
  '/dummyServer/json/vam/process/virtualAccountStatusManagement/private/dropdown/corporateVAStructure',
  (req, res) => {
    var dataXlFile = './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx';
    var workbook = XLSX.readFile(dataXlFile);

    var xlData = XLSX.utils
      .sheet_to_json(workbook.Sheets['Sheet1'])
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.lastAction.indexOf('Authorized') !== -1,
      );
    var dataList = [];

    _.forEach(xlData, function (record) {
      dataList.push({
        id: record.id,
        displayName: record.corporateStructureName,
        enrichments: { ...record },
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
  '/dummyServer/json/vam/process/virtualAccountStatusManagement/private/getDashboardData',
  (req, res) => {
    console.log(req.body);

    var dataXlFile = './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx';
    var workbook = XLSX.readFile(dataXlFile);

    const vaStatusXlFile =
      './dummyServer/json/vam/process/virtualAccountStatusManagement/data.xlsx';
    var vaStatusWorkbook = XLSX.readFile(vaStatusXlFile);
    var vaStatusData = XLSX.utils
      .sheet_to_json(vaStatusWorkbook.Sheets['Sheet1'])
      .filter(
        (vaStatusRecord) =>
          vaStatusRecord.authorized == 'N' && !vaStatusRecord.lastAction.includes('Rejected'),
      );

    const listingTypes = [
      {
        id: 'Active',
        displayName: 'Active',
        rowDefUrl: 'vam/process/virtualAccountStatusManagement/private/getActiveList',
        count: 0,
      },
      {
        id: 'Inactive',
        displayName: 'Inactive',
        rowDefUrl: 'vam/process/virtualAccountStatusManagement/private/getInactiveList',
        count: 0,
      },
      {
        id: 'Suspended',
        displayName: 'Suspended',
        rowDefUrl: 'vam/process/virtualAccountStatusManagement/private/getSuspendedList',
        count: 0,
      },
      {
        id: 'Closed',
        displayName: 'Closed',
        rowDefUrl: 'vam/process/virtualAccountStatusManagement/private/getClosedList',
        count: 0,
      },
    ];

    const chartData = [
      {
        label: 'Active',
        count: 0,
      },
      {
        label: 'Inactive',
        count: 0,
      },
      {
        label: 'Suspended',
        count: 0,
      },
      {
        label: 'Closed',
        count: 0,
      },
    ];

    let totalVirtualAccountUsed = 0;
    let totalVirtualAccount = 0;

    XLSX.utils
      .sheet_to_json(workbook.Sheets['Sheet1'])
      .filter(
        (record) =>
          record.corporateId == req.body.dataMap.corporate &&
          record.lastAction.indexOf('Authorized') !== -1,
      )
      .forEach((record) => {
        const filters = [{ name: 'id', value: record.id }];

        const vaData = getViewData(
          './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx',
          filters,
        );

        vaData.vAIssuanceAccountDetList
          .filter((vaAccount) => {
            const vaStatusRecord = vaStatusData.find((r) => r.virtualAccountId == vaAccount.id);
            return !vaStatusRecord;
          })
          .forEach((vaAccount) => {
            totalVirtualAccountUsed++;

            if (vaAccount.status == 'active') {
              totalVirtualAccount++;
              listingTypes[0].count++;
              chartData[0].count++;
            } else if (vaAccount.status == 'inactive') {
              listingTypes[1].count++;
              chartData[1].count++;
            } else if (vaAccount.status == 'suspend') {
              listingTypes[2].count++;
              chartData[2].count++;
            } else if (vaAccount.status == 'close') {
              listingTypes[3].count++;
              chartData[3].count++;
            }
          });
      });

    res.json({
      chartData,
      listingTypes,
      totalVirtualAccount,
      totalVirtualAccountUsed,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

router.post(
  '/dummyServer/json/vam/process/virtualAccountStatusManagement/private/getListingTabs',
  (req, res) => {
    var dataXlFile = './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx';
    var workbook = XLSX.readFile(dataXlFile);

    const data = [
      {
        id: 'Active',
        displayName: 'Active',
        rowDefUrl: 'vam/process/virtualAccountStatusManagement/private/getActiveList',
        count: 0,
      },
      {
        id: 'Inactive',
        displayName: 'Inactive',
        rowDefUrl: 'vam/process/virtualAccountStatusManagement/private/getInactiveList',
        count: 0,
      },
      {
        id: 'Suspended',
        displayName: 'Suspended',
        rowDefUrl: 'vam/process/virtualAccountStatusManagement/private/getSuspendedList',
        count: 0,
      },
      {
        id: 'Closed',
        displayName: 'Closed',
        rowDefUrl: 'vam/process/virtualAccountStatusManagement/private/getClosedList',
        count: 0,
      },
    ];

    const vaStatusXlFile =
      './dummyServer/json/vam/process/virtualAccountStatusManagement/data.xlsx';
    var vaStatusWorkbook = XLSX.readFile(vaStatusXlFile);
    var vaStatusData = XLSX.utils
      .sheet_to_json(vaStatusWorkbook.Sheets['Sheet1'])
      .filter(
        (vaStatusRecord) =>
          vaStatusRecord.authorized == 'N' && !vaStatusRecord.lastAction.includes('Rejected'),
      );

    XLSX.utils
      .sheet_to_json(workbook.Sheets['Sheet1'])
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.lastAction.indexOf('Authorized') !== -1,
      )
      .forEach((record) => {
        const filters = [{ name: 'id', value: record.id }];

        const vaData = getViewData(
          './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx',
          filters,
        );

        vaData.vAIssuanceAccountDetList
          .filter((vaAccount) => {
            const vaStatusRecord = vaStatusData.find((r) => r.virtualAccountId == vaAccount.id);
            return !vaStatusRecord;
          })
          .forEach((vaAccount) => {
            if (vaAccount.status == 'active') {
              data[0].count++;
            } else if (vaAccount.status == 'inactive') {
              data[1].count++;
            } else if (vaAccount.status == 'suspend') {
              data[2].count++;
            } else if (vaAccount.status == 'close') {
              data[3].count++;
            }
          });
      });

    res.json({
      data,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

router.post(
  '/dummyServer/json/vam/process/virtualAccountStatusManagement/private/getActiveList',
  (req, res) => {
    var dataXlFile = './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx';
    var workbook = XLSX.readFile(dataXlFile);

    const data = [];

    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    const vaStatusXlFile =
      './dummyServer/json/vam/process/virtualAccountStatusManagement/data.xlsx';
    var vaStatusWorkbook = XLSX.readFile(vaStatusXlFile);
    var vaStatusData = XLSX.utils
      .sheet_to_json(vaStatusWorkbook.Sheets['Sheet1'])
      .filter(
        (vaStatusRecord) =>
          vaStatusRecord.authorized == 'N' && !vaStatusRecord.lastAction.includes('Rejected'),
      );

    xlData
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.lastAction.indexOf('Authorized') !== -1,
      )
      .forEach((record) => {
        const filters = [{ name: 'id', value: record.id }];

        const vaData = getViewData(
          './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx',
          filters,
        );

        vaData.vAIssuanceAccountDetList
          .filter((vaAccount) => {
            const vaStatusRecord = vaStatusData.find((r) => r.virtualAccountId == vaAccount.id);
            return !vaStatusRecord;
          })
          .filter((vaAccount) => vaAccount.status == 'active')
          .forEach((vaAccount) => {
            data.push({
              id: vaAccount.id,
              corporateCode: record.corporateCode,
              corporateClientCode: record.corporateId,
              corporateStructureName: record.corporateStructure,
              virtualAccount: vaAccount.virtualAccountNo,
              vaAliceName: vaAccount.vaAliasName,
              status: vaAccount.status,

              actions: [
                {
                  index: 1,
                  displayName: 'View',
                  type: 'ICON',
                  icon: 'pi pi-eye',
                  url: 'route~view',
                  methodName: 'view',
                  paramList:
                    'id,corporateCode,corporateClientCode,corporateStructureName,virtualAccount,vaAliceName,status',
                  color: null,
                },
                {
                  index: 2,
                  displayName: 'Suspend',
                  type: 'ICON',
                  icon: 'pi pi-ban',
                  url: 'route~view',
                  methodName: 'suspend',
                  paramList:
                    'id,corporateCode,corporateClientCode,corporateStructureName,virtualAccount,vaAliceName,status',
                  color: null,
                },
                {
                  index: 3,
                  displayName: 'close',
                  type: 'ICON',
                  icon: 'pi pi-times-circle',
                  url: 'route~view',
                  methodName: 'close',
                  paramList:
                    'id,corporateCode,corporateClientCode,corporateStructureName,virtualAccount,vaAliceName,status',
                  color: null,
                },
              ],
            });
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
  '/dummyServer/json/vam/process/virtualAccountStatusManagement/private/getInactiveList',
  (req, res) => {
    var dataXlFile = './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx';
    var workbook = XLSX.readFile(dataXlFile);

    const data = [];

    const vaStatusXlFile =
      './dummyServer/json/vam/process/virtualAccountStatusManagement/data.xlsx';
    var vaStatusWorkbook = XLSX.readFile(vaStatusXlFile);
    var vaStatusData = XLSX.utils
      .sheet_to_json(vaStatusWorkbook.Sheets['Sheet1'])
      .filter(
        (vaStatusRecord) =>
          vaStatusRecord.authorized == 'N' && !vaStatusRecord.lastAction.includes('Rejected'),
      );

    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
    xlData
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.lastAction.indexOf('Authorized') !== -1,
      )
      .forEach((record) => {
        const filters = [{ name: 'id', value: record.id }];

        const vaData = getViewData(
          './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx',
          filters,
        );

        vaData.vAIssuanceAccountDetList
          .filter((vaAccount) => {
            const vaStatusRecord = vaStatusData.find((r) => r.virtualAccountId == vaAccount.id);
            return !vaStatusRecord;
          })
          .filter((vaAccount) => vaAccount.status == 'inactive')
          .forEach((vaAccount) => {
            data.push({
              id: vaAccount.id,
              corporateCode: record.corporateCode,
              corporateClientCode: record.corporateId,
              corporateStructureName: record.corporateStructure,
              virtualAccount: vaAccount.virtualAccountNo,
              vaAliceName: vaAccount.vaAliasName,
              status: vaAccount.status,

              actions: [
                {
                  index: 1,
                  displayName: 'View',
                  type: 'ICON',
                  icon: 'pi pi-eye',
                  url: 'route~view',
                  methodName: 'view',
                  paramList:
                    'id,corporateCode,corporateClientCode,corporateStructureName,virtualAccount,vaAliceName,status',
                  color: null,
                },
                {
                  index: 2,
                  displayName: 'Activate',
                  type: 'ICON',
                  icon: 'pi pi-check-circle',
                  url: 'route~view',
                  methodName: 'activate',
                  paramList:
                    'id,corporateCode,corporateClientCode,corporateStructureName,virtualAccount,vaAliceName,status',
                  color: null,
                },
                {
                  index: 3,
                  displayName: 'close',
                  type: 'ICON',
                  icon: 'pi pi-times-circle',
                  url: 'route~view',
                  methodName: 'close',
                  paramList:
                    'id,corporateCode,corporateClientCode,corporateStructureName,virtualAccount,vaAliceName,status',
                  color: null,
                },
              ],
            });
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
  '/dummyServer/json/vam/process/virtualAccountStatusManagement/private/getSuspendedList',
  (req, res) => {
    var dataXlFile = './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx';
    var workbook = XLSX.readFile(dataXlFile);
    const data = [];
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    const vaStatusXlFile =
      './dummyServer/json/vam/process/virtualAccountStatusManagement/data.xlsx';
    var vaStatusWorkbook = XLSX.readFile(vaStatusXlFile);
    var vaStatusData = XLSX.utils
      .sheet_to_json(vaStatusWorkbook.Sheets['Sheet1'])
      .filter(
        (vaStatusRecord) =>
          vaStatusRecord.authorized == 'N' && !vaStatusRecord.lastAction.includes('Rejected'),
      );

    xlData
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.lastAction.indexOf('Authorized') !== -1,
      )
      .forEach((record) => {
        const filters = [{ name: 'id', value: record.id }];

        const vaData = getViewData(
          './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx',
          filters,
        );

        vaData.vAIssuanceAccountDetList
          .filter((vaAccount) => {
            const vaStatusRecord = vaStatusData.find((r) => r.virtualAccountId == vaAccount.id);
            return !vaStatusRecord;
          })
          .filter((vaAccount) => vaAccount.status == 'suspend')
          .forEach((vaAccount) => {
            data.push({
              id: vaAccount.id,
              corporateCode: record.corporateCode,
              corporateClientCode: record.corporateId,
              corporateStructureName: record.corporateStructure,
              virtualAccount: vaAccount.virtualAccountNo,
              vaAliceName: vaAccount.vaAliasName,
              status: vaAccount.status,

              actions: [
                {
                  index: 1,
                  displayName: 'View',
                  type: 'ICON',
                  icon: 'pi pi-eye',
                  url: 'route~view',
                  methodName: 'view',
                  paramList:
                    'id,corporateCode,corporateClientCode,corporateStructureName,virtualAccount,vaAliceName,status',
                  color: null,
                },
                {
                  index: 2,
                  displayName: 'Activate',
                  type: 'ICON',
                  icon: 'pi pi-check-circle',
                  url: 'route~view',
                  methodName: 'activate',
                  paramList:
                    'id,corporateCode,corporateClientCode,corporateStructureName,virtualAccount,vaAliceName,status',
                  color: null,
                },
                {
                  index: 3,
                  displayName: 'close',
                  type: 'ICON',
                  icon: 'pi pi-times-circle',
                  url: 'route~view',
                  methodName: 'close',
                  paramList:
                    'id,corporateCode,corporateClientCode,corporateStructureName,virtualAccount,vaAliceName,status',
                  color: null,
                },
              ],
            });
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
  '/dummyServer/json/vam/process/virtualAccountStatusManagement/private/getClosedList',
  (req, res) => {
    var dataXlFile = './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx';
    var workbook = XLSX.readFile(dataXlFile);
    const data = [];
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    const vaStatusXlFile =
      './dummyServer/json/vam/process/virtualAccountStatusManagement/data.xlsx';
    var vaStatusWorkbook = XLSX.readFile(vaStatusXlFile);
    var vaStatusData = XLSX.utils
      .sheet_to_json(vaStatusWorkbook.Sheets['Sheet1'])
      .filter(
        (vaStatusRecord) =>
          vaStatusRecord.authorized == 'N' && !vaStatusRecord.lastAction.includes('Rejected'),
      );

    xlData
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.lastAction.indexOf('Authorized') !== -1,
      )
      .forEach((record) => {
        const filters = [{ name: 'id', value: record.id }];

        const vaData = getViewData(
          './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx',
          filters,
        );

        vaData.vAIssuanceAccountDetList
          .filter((vaAccount) => {
            const vaStatusRecord = vaStatusData.find((r) => r.virtualAccountId == vaAccount.id);
            return !vaStatusRecord;
          })
          .filter((vaAccount) => vaAccount.status == 'close')
          .forEach((vaAccount) => {
            data.push({
              id: vaAccount.id,
              corporateCode: record.corporateCode,
              corporateClientCode: record.corporateId,
              corporateStructureName: record.corporateStructure,
              virtualAccount: vaAccount.virtualAccountNo,
              vaAliceName: vaAccount.vaAliasName,
              status: vaAccount.status,

              actions: [
                {
                  index: 1,
                  displayName: 'View',
                  type: 'ICON',
                  icon: 'pi pi-eye',
                  url: 'route~view',
                  methodName: 'view',
                  paramList:
                    'id,corporateCode,corporateClientCode,corporateStructureName,virtualAccount,vaAliceName,status',
                  color: null,
                },
              ],
            });
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
  '/dummyServer/json/vam/process/virtualAccountStatusManagement/private/authorize',
  (req, res) => {
    console.log(req.body);

    const vaStatusXlFile =
      './dummyServer/json/vam/process/virtualAccountStatusManagement/data.xlsx';

    const dataXlFile = './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx';
    const workbook = XLSX.readFile(dataXlFile);
    const vaAccountData = XLSX.utils.sheet_to_json(workbook.Sheets['vAIssuanceAccountDetList']);

    for (let id of req.body.dataMap.ids) {
      const vaStatusFilters = [{ name: 'id', value: id }];
      const vaStatusData = getViewData(vaStatusXlFile, vaStatusFilters);

      if (vaStatusData) {
        const vaAccountIndex = vaAccountData.findIndex(
          (vaAccount) => vaAccount.id == vaStatusData.virtualAccountId,
        );

        if (vaAccountIndex >= 0) {
          const vaFilters = [{ name: 'id', value: vaAccountData[vaAccountIndex].mstId }];
          const vaData = getViewData(dataXlFile, vaFilters);

          if (vaData) {
            const index = vaData.vAIssuanceAccountDetList.findIndex(
              (vaAccount) => vaAccount.id == vaStatusData.virtualAccountId,
            );

            if (index >= 0) {
              vaData.vAIssuanceAccountDetList[index].status = vaStatusData.status;

              updateRecordInExcel(dataXlFile, vaData, req.session.userDetails);

              const sheets = generateAuthorizeSheetData(
                req.session.userDetails,
                dataToBeAuthorized,
                workbook,
              );
              updateWorkbook(workbook, sheets, dataXlFile);
            }
          }
        }
      }

      const vaStatusWorkbook = XLSX.readFile(vaStatusXlFile);

      const vaStatusSheets = generateAuthorizeSheetData(
        req.session.userDetails,
        req.body.dataMap,
        vaStatusWorkbook,
      );
      updateWorkbook(vaStatusWorkbook, vaStatusSheets, vaStatusXlFile);
    }

    res.json({
      responseStatus: { message: '', status: '0' },
    });
  },
);

module.exports = router;
