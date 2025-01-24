const express = require('express');
const XLSX = require('xlsx');
const _ = require('lodash');
const router = express.Router();
const FakeServer = require('./fakeServer').FakeServer;

router.post(
  '/dummyServer/json/payments/transactions/cancelPaymentRequest/private/rowData/:productType',
  (req, res) => {
    const productType = req.params.productType;

    let excelLocation;

    if (productType === 'paymentRequest') {
      excelLocation = 'dummyServer/json/payments/transactions/singlePaymentRequest';
    } else if (productType === 'statutoryPayment') {
      excelLocation = 'dummyServer/json/payments/transactions/statutoryPayment';
    } else if (productType === 'ownAccountTransfer') {
      excelLocation = 'dummyServer/json/payments/transactions/ownAccountTransfer';
    } else if (productType === 'wps') {
      excelLocation = 'dummyServer/json/payments/transactions/wpsPayment';
    } else if (productType === 'billPayment') {
      excelLocation = 'dummyServer/json/payments/billPayments/payBill';
    }

    let response = [];

    if (excelLocation) {
      const workbook = XLSX.readFile('./' + excelLocation + '/data.xlsx');
      const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      setSortCondition(req.body, req.session.userDetails, excelData);

      let reqModel = req.body;

      const fakeServer = FakeServer(excelData);

      if (!reqModel.sortModel) reqModel.sortModel = [];
      if (reqModel.sortModel.length == 0)
        reqModel.sortModel.push({ sort: 'desc', colId: 'modifiedSysOn' });
      if (!reqModel.filterModel) reqModel.filterModel = {};

      if (
        req.session?.userDetails?.loginPreferenceDetails &&
        req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group'
      ) {
        reqModel.filterModel.groupId = {
          filterType: 'number',
          type: 'equals',
          filter: req.session?.userDetails?.loginPreferenceDetails?.groupId,
        };
      }
      if (
        req.session?.userDetails?.loginPreferenceDetails &&
        req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group'
      ) {
        reqModel.filterModel.corporateId = {
          filterType: 'number',
          type: 'equals',
          filter: req.session?.userDetails?.corporateId,
        };
      }

      reqModel.filterModel.enabled = { filterType: 'text', type: 'equals', filter: 'Y' };
      reqModel.filterModel.authorized = { filterType: 'text', type: 'equals', filter: 'Y' };

      response = fakeServer.getData(reqModel);

      let paramList;

      if (productType === 'paymentRequest') {
        paramList = 'id,entryType,beneficiary,activationDate,corporateRefNo,batchNo';
      } else if (productType === 'statutoryPayment') {
        paramList = 'id,entryType,beneficiary,activationDate,corporateRefNo';
      } else if (productType === 'ownAccountTransfer') {
        paramList = 'id,entryType,beneficiary,activationDate,corporateRefNo';
      } else if (productType === 'wps') {
        paramList = 'id,entryType,beneficiary,activationDate,corporateRefNo';
      } else if (productType === 'billPayment') {
        paramList = 'id,entryType,beneficiary,activationDate,corporateRefNo';
      }

      _.forEach(response.data, function (row) {
        row.entryType = row.entryType ? row.entryType : 'SINGLE';
        row.beneficiary = row.beneficiaryName ? row.beneficiaryName : '';
        row.corporateRefNo = row.corporateRefNo
          ? row.corporateRefNo
          : row.id.toString().substring(3, 8);

        row.activationDate = row.modifiedSysOn;
        row.batchNo = row.id;

        row.actions = [
          {
            index: 1,
            displayName: 'View',
            type: 'ICON',
            icon: 'pi pi-eye',
            url: 'route~view',
            methodName: 'view',
            paramList: 'id',
            color: null,
          },
          {
            index: 1,
            displayName: 'Cancel Request',
            type: 'BUTTON',
            icon: '',
            url: 'route~view',
            methodName: 'cancelRequest',
            paramList: paramList,
            color: null,
          },
        ];
      });
    }

    if (productType === 'paymentRequest') {
      excelLocation = 'dummyServer/json/payments/transactions/bulkPaymentRequest';

      const workbook = XLSX.readFile('./' + excelLocation + '/data.xlsx');

      const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

      setSortCondition(req.body, req.session.userDetails, excelData);

      let reqModel = req.body;

      const fakeServer = FakeServer(excelData);

      if (!reqModel.sortModel) reqModel.sortModel = [];
      if (reqModel.sortModel.length == 0)
        reqModel.sortModel.push({ sort: 'desc', colId: 'modifiedSysOn' });
      if (!reqModel.filterModel) reqModel.filterModel = {};

      if (
        req.session?.userDetails?.loginPreferenceDetails &&
        req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group'
      ) {
        reqModel.filterModel.groupId = {
          filterType: 'number',
          type: 'equals',
          filter: req.session?.userDetails?.loginPreferenceDetails?.groupId,
        };
      }
      if (
        req.session?.userDetails?.loginPreferenceDetails &&
        req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group'
      ) {
        reqModel.filterModel.corporateId = {
          filterType: 'number',
          type: 'equals',
          filter: req.session?.userDetails?.corporateId,
        };
      }

      reqModel.filterModel.enabled = { filterType: 'text', type: 'equals', filter: 'Y' };
      reqModel.filterModel.authorized = { filterType: 'text', type: 'equals', filter: 'Y' };

      const bulkResponse = fakeServer.getData(reqModel);

      let paramList = 'id,entryType,activationDate,corporateRefNo,batchNo';

      _.forEach(bulkResponse.data, function (row) {
        row.entryType = row.entryType ? row.entryType : 'MULTIPLE';
        row.corporateRefNo = row.corporateRefNo
          ? row.corporateRefNo
          : row.id.toString().substring(3, 8);

        row.activationDate = row.modifiedSysOn;
        row.batchNo = row.id;

        row.actions = [
          {
            index: 1,
            displayName: 'View',
            type: 'ICON',
            icon: 'pi pi-eye',
            url: 'route~view',
            methodName: 'view',
            paramList: 'id,entryType',
            color: null,
          },
          {
            index: 1,
            displayName: 'Cancel Batch',
            type: 'BUTTON',
            icon: '',
            url: 'route~view',
            methodName: 'cancelBatch',
            paramList: paramList,
            color: null,
          },
          {
            index: 2,
            displayName: 'Cancel Request',
            type: 'BUTTON',
            icon: '',
            url: 'route~view',
            methodName: 'cancelRequest',
            paramList: paramList,
            color: null,
          },
        ];
      });

      response.data = [...response.data, ...bulkResponse.data].sort((a, b) => {
        return a.id - b.id;
      });
    }

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
    res.json(response);
  },
);

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

module.exports = router;
