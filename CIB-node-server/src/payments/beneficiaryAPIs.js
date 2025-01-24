const express = require('express');
const XLSX = require('xlsx');

const getViewData = require('./../crudAPIs').getViewData;

const router = express.Router();

router.post(
  '/dummyServer/json/payments/masters/beneficiary/private/getBeneficiaryList',
  (req, res) => {
    const dataFile = './dummyServer/json/payments/masters/beneficiary/data.xlsx';

    const workbook = XLSX.readFile(dataFile);

    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    const beneficiaries = excelData.filter(
      (record) =>
        req.session?.userDetails?.loginPreferenceDetails &&
        ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
          record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
          (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
            record.corporateId == req.session?.userDetails?.corporateId)) &&
        record.enabled == 'Y' &&
        record.authorized == 'Y',
    );

    let beneList = [];

    let i = 1;

    beneficiaries.forEach((bene, i) => {
      bene = getViewData(dataFile, [{ name: 'id', value: bene.id }]);

      if (bene) {
        bene.paymentMethods
          .filter((paymentMethod) => paymentMethod.isElectronicPaymentMethod)
          .forEach((paymentMethod) => {
            paymentMethod.accounts.forEach((account) => {
              beneList.push({
                ...bene,
                id: +bene.id + i,
                beneficiaryCode: bene.beneficiaryCode,
                paymentMethodId: paymentMethod.pmid,
                paymentMethod: paymentMethod.label,
                beneficiaryName: bene.beneficiaryName,
                isPaperBasedTransaction: paymentMethod.isElectronicPaymentMethod,
                corporateProductId: paymentMethod.corporateProductId,
                accountNo: account.accountNumber,
                bank: account.beneficiaryBank ? account.beneficiaryBank : bene.bank,
                pinCode: bene.zipCode,
                phoneNo: bene.contactNumber,
                email: bene.emailId,
                beneficiaryAddress1: bene.address1,
                beneficiaryAddress2: bene.address2,
                beneficiaryAddress3: bene.address3,
                isFavorite: account.isFavorite ? account.isFavorite : 'N',
              });

              i++;
            });
          });
      }
    });

    if (req.body?.dataMap?.paymentMethodName && req.body?.dataMap?.paymentMethodId) {
      beneList = beneList.filter(
        (bene) =>
          bene.paymentMethodId == req.body.dataMap.paymentMethodId &&
          bene.paymentMethod == req.body.dataMap.paymentMethodName,
      );
    }

    res.json({
      data: beneList.sort((a, b) => b.id - a.id),
      lastRow: beneList.length,
      responseStatus: { message: '', status: '0' },
    });
  },
);

router.post('/dummyServer/json/payments/masters/beneficiary/private/getBeneList', (req, res) => {
  const beneList = getBeneList(req).map((bene) => {
    return {
      id: bene.id,
      displayName: bene.beneficiaryName,
      enrichments: {
        ...bene,
      },
    };
  });
  res.json({
    dataList: beneList,
    lastRow: beneList.length,
    responseStatus: { message: '', status: '0' },
  });
});

router.post('/dummyServer/json/payments/masters/beneficiary/private/getBeneList', (req, res) => {
  const beneList = getBeneList(req).map((bene) => {
    return {
      id: bene.id,
      displayName: bene.beneficiaryName,
      enrichments: {
        ...bene,
      },
    };
  });

  res.json({
    dataList: beneList,
    lastRow: beneList.length,
    responseStatus: { message: '', status: '0' },
  });
});

const getBeneList = (req) => {
  const dataFile = './dummyServer/json/payments/masters/beneficiary/data.xlsx';

  const workbook = XLSX.readFile(dataFile);

  const excelData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

  const beneficiaries = excelData.filter(
    (record) =>
      req.session?.userDetails?.loginPreferenceDetails &&
      ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
        record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
        (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
          record.corporateId == req.session?.userDetails?.corporateId)) &&
      record.enabled == 'Y' &&
      record.authorized == 'Y',
  );

  const beneList = [];

  let i = 1;

  beneficiaries.forEach((bene) => {
    bene = getViewData(dataFile, [{ name: 'id', value: bene.id }]);

    if (bene) {
      bene.paymentMethods
        .filter((paymentMethod) => paymentMethod.isElectronicPaymentMethod)
        .forEach((paymentMethod) => {
          paymentMethod.accounts.forEach((account) => {
            beneList.push({
              ...bene,
              id: +bene.id + i,
              beneficiaryCode: bene.beneficiaryCode,
              paymentMethod: paymentMethod.label,
              beneficiaryName: bene.beneficiaryName,
              accountNo: account.accountNumber,
              bank: account.beneficiaryBank ? account.beneficiaryBank : bene.bank,
              pinCode: bene.zipCode,
              phoneNo: bene.contactNumber,
              email: bene.emailId,
              beneficiaryAddress1: bene.address1,
              beneficiaryAddress2: bene.address2,
              beneficiaryAddress3: bene.address3,
              isFavorite: account.isFavorite ? account.isFavorite : 'N',
            });

            i++;
          });
        });
    }
  });

  return beneList;
};

module.exports = router;
