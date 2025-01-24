var express = require('express');
var router = express.Router();
var getAllList = require('../../listingAPIs').getAllListRecords;
var getRejectedListRecords = require('../../listingAPIs').getRejectedListRecords;

router.post(
  '/dummyServer/json/trade/exportTransactions/advisedLc/private/getAdvisedLcSearchResultTab',
  (req, res) => {
    let allList = getAllList(
      './dummyServer/json/trade/importTransactions/letterOfCredit/data.xlsx',
      req.body,
      req.session.userDetails,
    );

    const searchResultTab = {
      id: 'searchResults',
      displayName: 'Search Results',
      count: allList.lastRow,
      colDefUrl: 'trade/exportTransactions/advisedLc/private/advisedLcColDefs',
      rowDefUrl: 'trade/exportTransactions/advisedLc/private/getSearchResults',
    };

    res.json({ searchResultTab });
  },
);

router.post(
  '/dummyServer/json/trade/exportTransactions/advisedLc/private/getAdvisedLcListingTabs',
  (req, res) => {
    const allList = getAllList(
      './dummyServer/json/trade/importTransactions/letterOfCredit/data.xlsx',
      req.body,
      req.session.userDetails,
    );

    const rejectedList = getRejectedListRecords(
      './dummyServer/json/trade/importTransactions/letterOfCredit/data.xlsx',
      req.body,
      req.session.userDetails,
    );

    const listingTabs = {
      tabs: [
        {
          id: 'advisedLcs',
          displayName: 'Advised LCs',
          count: allList.lastRow,
          colDefUrl: 'trade/exportTransactions/advisedLc/private/advisedLcColDefs',
          rowDefUrl: 'trade/exportTransactions/advisedLc/private/getAdvisedLcList',
        },
        {
          id: 'rejectedLcs',
          displayName: 'Rejected LCs',
          count: rejectedList.lastRow,
          colDefUrl: 'trade/exportTransactions/advisedLc/private/advisedLcColDefs',
          rowDefUrl: 'trade/exportTransactions/advisedLc/private/getRejectedLcList',
        },
      ],
    };

    res.json(listingTabs);
  },
);

router.post(
  '/dummyServer/json/trade/exportTransactions/advisedLc/private/getAdvisedLcList',
  (req, res) => {
    let allList = getAllList(
      './dummyServer/json/trade/importTransactions/letterOfCredit/data.xlsx',
      req.body,
      req.session.userDetails,
    );

    allList.data = allList.data.map((record) => {
      record['advisedLcRefNumber'] = record.id + 54321;
      record['lcAdvisingDate'] = record.modifiedSysOn;
      record['actions'] = [
        {
          index: 0,
          paramList: 'id',
          methodName: 'view',
          type: 'ICON',
          displayName: 'View',
          icon: 'fa-eye text-color-primary',
        },
      ];

      return record;
    });

    res.json(allList);
  },
);

router.post(
  '/dummyServer/json/trade/exportTransactions/advisedLc/private/getSearchResults',
  (req, res) => {
    let allList = getAllList(
      './dummyServer/json/trade/importTransactions/letterOfCredit/data.xlsx',
      req.body,
      req.session.userDetails,
    );

    allList.data = allList.data.map((record) => {
      record['advisedLcRefNumber'] = record.id + 54321;
      record['lcAdvisingDate'] = record.modifiedSysOn;
      record['actions'] = [
        {
          index: 0,
          paramList: 'id',
          methodName: 'view',
          type: 'ICON',
          displayName: 'View',
          icon: 'fa-eye text-color-primary',
        },
      ];

      return record;
    });

    res.json(allList);
  },
);

router.post(
  '/dummyServer/json/trade/exportTransactions/advisedLc/private/getRejectedLcList',
  (req, res) => {
    let rejectedList = getRejectedListRecords(
      './dummyServer/json/trade/importTransactions/letterOfCredit/data.xlsx',
      req.body,
      req.session.userDetails,
    );

    rejectedList.data = rejectedList.data.map((record) => {
      record['advisedLcRefNumber'] = record.id + 54321;
      record['lcAdvisingDate'] = record.modifiedSysOn;
      record['actions'] = [
        {
          index: 0,
          paramList: 'id',
          methodName: 'view',
          type: 'ICON',
          displayName: 'View',
          icon: 'fa-eye text-color-primary',
        },
      ];

      return record;
    });

    res.json(rejectedList);
  },
);

module.exports = router;
