var express = require('express');
var XLSX = require('xlsx');

var router = express.Router();

router.post(
  '/dummyServer/json/accountServices/services/creditLineSummery/private/getGroupCreditLineDetails',
  (req, res) => {
    let groupId = '1';

    if (req.body?.dataMap?.groupId) {
      groupId = req.body.dataMap.groupId;
    } else if (req.session?.userDetails?.groupId) {
      groupId = req.session.userDetails.groupId;
    }

    let data = getGroupCreditLineDetails(groupId);

    res.json({
      data,
      responseStatus: { message: '', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/accountServices/services/creditLineSummery/private/getCorporateCreditLineDetails',
  (req, res) => {
    let data = getCorporateCreditLineDetails(req.body.dataMap.corporateId);

    res.json({
      data,
      responseStatus: { message: '', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/accountServices/services/creditLineSummery/private/getCreditLineProductDetails',
  (req, res) => {
    let data = getCreditLineProductDetails(req.body.dataMap.productId);

    res.json({
      data,
      responseStatus: { message: '', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/accountServices/services/creditLineDetails/private/subProductData',
  (req, res) => {
    let tradeData = [
      {
        subProducts: ['Trade Finance Limit'],
        level: 0,
        currency: '',
        allocatedLimit: '0',
        utilizedLimit: '0',
        availableLimit: '0',
      },
      {
        subProducts: ['Trade Finance Limit', 'Sight'],
        level: 1,
        records: 2,
        currency: '',
        allocatedLimit: '0',
        utilizedLimit: '0',
        availableLimit: '0',
      },
      {
        subProducts: ['Trade Finance Limit', 'Acceptance'],
        level: 1,
        records: 1,
        currency: '',
        allocatedLimit: '0',
        utilizedLimit: '0',
        availableLimit: '0',
      },
      {
        subProducts: ['Letter of Credit Limit'],
        level: 0,
        currency: '',
        allocatedLimit: '0',
        utilizedLimit: '0',
        availableLimit: '0',
      },
      {
        subProducts: ['Guarantee'],
        level: 0,
        currency: '',
        allocatedLimit: '0',
        utilizedLimit: '0',
        availableLimit: '0',
      },
    ];

    let fscmData = [
      {
        subProducts: ['Supplier Finance'],
        level: 0,
        currency: '',
        allocatedLimit: '0',
        utilizedLimit: '0',
        availableLimit: '0',
      },
      {
        subProducts: ['Supplier Finance', 'With Recourse'],
        level: 1,
        records: 2,
        currency: '',
        allocatedLimit: '0',
        utilizedLimit: '0',
        availableLimit: '0',
      },
      {
        subProducts: ['Supplier Finance', 'Without Recourse'],
        level: 1,
        records: 1,
        currency: '',
        allocatedLimit: '0',
        utilizedLimit: '0',
        availableLimit: '0',
      },
      {
        subProducts: ['Dealer Finance'],
        level: 0,
        currency: '',
        allocatedLimit: '0',
        utilizedLimit: '0',
        availableLimit: '0',
      },
    ];

    let data = [];

    const product = req.body.dataMap.product;

    if (product && product.productId <= 2) {
      data = product.productId == 2 ? fscmData : tradeData;
    }

    if (product && data.length > 0) {
      const level0_records = data.filter((d) => d.level == 0);

      const level0_totalAllocatedLimit = product.totalAllocatedLimit / level0_records.length;
      const level0_availableLimit = product.availableLimit / level0_records.length;
      const level0_utilizedLimit = product.utilizedLimit / level0_records.length;

      data = data.map((d) => {
        if (d.level == 0) {
          d.allocatedLimit = level0_totalAllocatedLimit;
          d.availableLimit = level0_availableLimit;
          d.utilizedLimit = level0_utilizedLimit;
        } else if (d.level == 1) {
          const level1_records = data.filter((d1) =>
            d1.subProducts.includes(d.subProducts[0]),
          ).length;
          d.allocatedLimit = level0_totalAllocatedLimit / level1_records;
          d.availableLimit = level0_availableLimit / level1_records;
          d.utilizedLimit = level0_utilizedLimit / level1_records;
        }
        d.currency = req.body.dataMap.currency;
        return d;
      });
    }

    res.json({
      data: data.map((d) => {
        d['actions'] = [
          {
            index: 1,
            displayName: 'More Options',
            type: 'ICON',
            icon: 'fa-ellipsis-v',
            url: 'route~view',
            methodName: 'onMoreOptions',
            paramList: '',
            color: null,
          },
        ];

        return d;
      }),
      lastRow: data.length,
      responseStatus: { message: '', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/accountServices/services/creditLineDetails/private/subProductTypeDetailsData',
  (req, res) => {
    let data = [];

    const subProduct = req.body.dataMap;

    const fscmSupplierNames = ['DMart', 'Big Bazaar'];

    if (subProduct) {
      for (let i = 0; i < subProduct.records; i++) {
        if (subProduct.product.product == 'FSCM') {
          data.push({
            currency: req.body.dataMap.currency,
            processFinanceBatchNo: 'PF1215452' + (i + 1),
            dealerSupplierName: fscmSupplierNames[i % 2],
            financedAmount: subProduct.availableLimit / subProduct.records,
            financePostingDate: '21 Aug 2022',
          });
        } else {
          data.push({
            currency: req.body.dataMap.currency,
            creditLineOffered: subProduct.availableLimit / subProduct.records,
            fundedLimit: subProduct.allocatedLimit / subProduct.records,
            unfundedLimit: subProduct.utilizedLimit / subProduct.records,
            effectiveDate: '21 Aug 2022',
            expiryDate: '27 Aug 2022',
          });
        }
      }
    } else {
      data = [
        {
          currency: req.body.dataMap.currency,
          creditLineOffered: '0',
          fundedLimit: '0',
          unfundedLimit: '0',
          effectiveDate: '21 Aug 2022',
          expiryDate: '27 Aug 2022',
        },
        {
          currency: req.body.dataMap.currency,
          creditLineOffered: '0',
          fundedLimit: '0',
          unfundedLimit: '0',
          effectiveDate: '21 Aug 2022',
          expiryDate: '27 Aug 2022',
        },
      ];
    }

    res.json({
      data: data.map((d) => {
        d['actions'] = [
          {
            index: 1,
            displayName: 'Repay Now',
            type: 'BUTTON',
            icon: '',
            url: 'route~view',
            methodName: 'onRepayNow',
            paramList: '',
            color: null,
          },
          {
            index: 1,
            displayName: 'Apply Finance',
            type: 'BUTTON',
            icon: '',
            url: 'route~view',
            methodName: 'onApplyFinance',
            paramList: '',
            color: null,
          },
        ];
        return d;
      }),
      lastRow: data.length,
      responseStatus: { message: '', status: '0' },
    });
  },
);

const getGroupCreditLineDetails = (groupId) => {
  let data = {
    totalAllocatedLimit: 0,
    utilizedLimit: 0,
    availableLimit: 0,
    groupName: '',
    groupImage: '',
    corporates: [],
    fundDistributionChartData: [],
  };

  var groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
  var groupWorkbook = XLSX.readFile(groupXlFile);

  const groupsData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['Sheet1']);

  const groupData = groupsData.find((record) => record.id == groupId);

  if (groupData) {
    data.groupName = groupData.groupName;
    data.groupImage = groupData.groupImage;
  }

  var groupCorporatesData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

  groupCorporatesData
    .filter((record) => record.mstId == groupId)
    .forEach((record) => {
      const corporateCreditLineData = getCorporateCreditLineDetails(record.corporateId);

      data.totalAllocatedLimit += corporateCreditLineData.totalAllocatedLimit;
      data.utilizedLimit += corporateCreditLineData.utilizedLimit;
      data.availableLimit += corporateCreditLineData.availableLimit;
      data.corporates.push(corporateCreditLineData);
      data.fundDistributionChartData.push({
        displayName: corporateCreditLineData.corporateName,
        amount: corporateCreditLineData.totalAllocatedLimit,
      });
    });

  return data;
};

const getCorporateCreditLineDetails = (corporateId) => {
  let data = {
    totalAllocatedLimit: 0,
    utilizedLimit: 0,
    availableLimit: 0,
    corporateId: corporateId,
    corporateCode: '',
    corporateName: '',
    corporateImage: '',
    creditLines: [],
  };

  var corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
  var corporateWorkbook = XLSX.readFile(corporateXlFile);

  const corporatesData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['Sheet1']);

  const corporateData = corporatesData.find((corporate) => corporate.id == corporateId);

  if (corporateData) {
    data.corporateCode = corporateData.corporateCode;
    data.corporateName = corporateData.corporateName;
    data.corporateImage = corporateData.corporateImage;
  }

  const cldXlFile =
    './dummyServer/json/accountServices/services/creditLineDetails/creditLineData.xlsx';

  const cldWorkbook = XLSX.readFile(cldXlFile);

  const cldXlData = XLSX.utils.sheet_to_json(cldWorkbook.Sheets['Sheet1']);

  const cldXlProductData = XLSX.utils.sheet_to_json(cldWorkbook.Sheets['products']);

  cldXlData
    .filter((cld) => cld.corporateId == corporateId)
    .forEach((cld) => {
      let creditLine = {
        id: cld.id,
        creditLineNumber: cld.creditLineNumber,
        totalAllocatedLimit: 0,
        utilizedLimit: 0,
        availableLimit: 0,
        products: [],
      };

      cldXlProductData
        .filter((clpd) => cld.creditLineNumber == clpd.creditLineNumber)
        .forEach((clpd) => {
          let product = {
            id: clpd.id,
            productId: clpd.productId,
            product: clpd.product,
            totalAllocatedLimit: clpd.totalAllocatedLimit,
            utilizedLimit: clpd.utilizedLimit,
            availableLimit: clpd.totalAllocatedLimit - clpd.utilizedLimit,
            subProductColDefUrl: clpd.subProductColDefUrl,
            subProductRowDefUrl: clpd.subProductRowDefUrl,
          };

          creditLine.totalAllocatedLimit += product.totalAllocatedLimit;
          creditLine.utilizedLimit += product.utilizedLimit;
          creditLine.availableLimit += product.availableLimit;
          creditLine.products.push(product);
        });

      data.totalAllocatedLimit += creditLine.totalAllocatedLimit;
      data.utilizedLimit += creditLine.utilizedLimit;
      data.availableLimit += creditLine.availableLimit;
      data.creditLines.push(creditLine);
    });

  return data;
};

const getCreditLineProductDetails = (productId) => {
  const cldXlFile =
    './dummyServer/json/accountServices/services/creditLineDetails/creditLineData.xlsx';

  const cldWorkbook = XLSX.readFile(cldXlFile);

  const cldXlProductData = XLSX.utils.sheet_to_json(cldWorkbook.Sheets['products']);

  const product = cldXlProductData.find((clpd) => clpd.id == productId);

  return {
    id: product.id,
    productId: product.productId,
    product: product.product,
    totalAllocatedLimit: product.totalAllocatedLimit,
    utilizedLimit: product.utilizedLimit,
    availableLimit: product.totalAllocatedLimit - product.utilizedLimit,
    subProductColDefUrl: product.subProductColDefUrl,
    subProductRowDefUrl: product.subProductRowDefUrl,
  };
};

module.exports = router;
