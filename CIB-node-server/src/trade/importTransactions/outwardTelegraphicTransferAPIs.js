const xlsx = require('xlsx');
var express = require('express');

var getAuthorizedList = require('../../listingAPIs').getAuthorizedListRecords;
var getPendingList = require('../../listingAPIs').getPendingListRecords;
var getFutureDatedList = require('../../listingAPIs').getFutureDatedList

var router = express.Router();

const defaultReqModel = {
  startRow: 0,
  endRow: 1,
  rowGroupCols: [],
  valueCols: [],
  pivotCols: [],
  pivotMode: false,
  groupKeys: [],
  filterModel: {},
  sortModel: [],
  entityName: '',
};

router.post(
  '/dummyServer/json/trade/importTransactions/outwardTelegraphTransfer/private/getAuthorizedList',
  (req, res) => {
    const authorizedList = getAuthorizedList(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );

    authorizedList.data = authorizedList.data.map((record) => {
      record['actions'] = [
        {
          index: 1,
          paramList: 'id',
          methodName: 'view',
          type: 'ICON',
          displayName: 'View',
          icon: 'fa-eye',
        },
        {
          index: 2,
          paramList: 'id',
          methodName: 'onDownload',
          type: 'ICON',
          displayName: 'Download',
          icon: 'fa-file-download',
        }
      ];

      return record;
    });

    res.json(authorizedList);
  },
);

router.post(
  '/dummyServer/json/trade/importTransactions/outwardTelegraphTransfer/private/getRepairList',
  (req, res) => {
    let authorizedList = getAuthorizedList(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );

    authorizedList.data = authorizedList.data.map((record) => {
      record['actions'] = [
        {
          index: 1,
          paramList: 'id',
          methodName: 'view',
          type: 'ICON',
          displayName: 'View',
          icon: 'fa-eye',
        },
        {
          index: 2,
          paramList: 'id',
          methodName: 'repair',
          type: 'BUTTON',
          displayName: 'REPAIR',
          icon: '',
        },
        {
          index: 3,
          paramList: 'id',
          methodName: 'accept',
          type: 'BUTTON',
          displayName: 'ACCEPT',
          icon: '',
        },
      ];

      return record;
    });

    res.json(authorizedList);
  },
);

router.post(
  '/dummyServer/json/trade/importTransactions/outwardTelegraphTransfer/private/getRecentList',
  (req, res) => {
    let pendingList = getPendingList(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );

    pendingList.data = pendingList.data.map((record) => {
      record['actions'] = [
        {
          index: 0,
          paramList: 'id',
          methodName: 'history',
          type: 'ICON',
          displayName: 'History',
          icon: 'fas fa-history',
        },
        {
          index: 1,
          paramList: 'id',
          methodName: 'copy',
          type: 'ICON',
          displayName: 'Copy',
          icon: 'fa-copy',
        },
        {
          index: 2,
          paramList: 'id',
          methodName: 'edit',
          type: 'ICON',
          displayName: 'Edit',
          icon: 'fa-pencil',
        },
      ];

      return record;
    });

    res.json(pendingList);
  },
);


router.post(
  '/dummyServer/json/trade/importTransactions/outwardTelegraphTransfer/private/futureDatedList',
  (req, res) => {
    try {
      // Construct the path to the data.xlsx file
      const filePath =
        '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';

      // Load the Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Filter the records to include only those with future dates
      const currentDate = new Date(); // Get the current date
      const futureDatedRecords = sheetData.filter((record) => {
        const recordDate = new Date(record.effectiveDate); // Ensure effectiveDate field exists in the file
        return recordDate > currentDate; // Include only future-dated records
      });

      // Add actions metadata to the filtered data
      const result = futureDatedRecords.map((record) => {
        record['actions'] = [
          // {
          //   index: 0,
          //   paramList: 'id',
          //   methodName: 'history',
          //   type: 'ICON',
          //   displayName: 'History',
          //   icon: 'fas fa-history',
          // },
          // {
          //   index: 1,
          //   paramList: 'id',
          //   methodName: 'copy',
          //   type: 'ICON',
          //   displayName: 'Copy',
          //   icon: 'fa-copy',
          // },
          {
            index: 2,
            displayName: 'AMEND',
            type: 'BUTTON',
            methodName: 'edit',
            icon: '',
            paramList: 'id',
            color: 'primary'
          },
        ];
        return record;
      });

      // Respond with the filtered list
      res.json(
        {
          data: result,
          count: result.length
        }
      );
    } catch (error) {
      // Catch and handle any unexpected errors
      console.error('Error processing futureDatedList request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

router.post(
  '/dummyServer/json/trade/importTransactions/outwardTelegraphTransfer/private/getFutureDatedList',
  (req, res) => {
    try {
      // Construct the path to the data.xlsx file
      const filePath =
        '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';

      // Load the Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Filter the records to include only those with future dates
      const currentDate = new Date(); // Get the current date
      const futureDatedRecords = sheetData.filter((record) => {
        const recordDate = new Date(record.effectiveDate); // Ensure effectiveDate field exists in the file
        return recordDate > currentDate; // Include only future-dated records
      });

      // Add actions metadata to the filtered data
      const result = futureDatedRecords.map((record) => {
        record['actions'] = [
          {
            index: 1,
            paramList: 'id',
            methodName: 'view',
            type: 'ICON',
            displayName: 'View',
            icon: 'fa-eye',
          },
          {
            index: 2,
            displayName: 'AMEND',
            type: 'BUTTON',
            methodName: 'edit',
            icon: '',
            paramList: 'id',
            color: 'primary'
          },
          {
            index: 3,
            displayName: 'Cancel',
            type: 'ICON',
            icon: 'fas fa-times',
            methodName: 'onCancel',
            paramList: 'id',
            color: 'warn'
          },
        ];
        return record;
      });

      // Respond with the filtered list
      res.json(
        {
          data: result,
          count: futureDatedRecords.length
        }
      );
    } catch (error) {
      // Catch and handle any unexpected errors
      console.error('Error processing futureDatedList request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);




module.exports = router;
