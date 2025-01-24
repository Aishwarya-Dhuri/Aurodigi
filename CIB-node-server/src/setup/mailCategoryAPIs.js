const express = require('express');
const XLSX = require('xlsx');

const router = express.Router();

router.post(
  '/dummyServer/json/setup/generalMasters/mailCategory/private/getCategoryList',
  (req, res) => {
    const dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';

    const existingWb = XLSX.readFile(dataXlFile);

    const data = XLSX.utils.sheet_to_json(existingWb.Sheets['Sheet1']);

    const dataList = data
      .filter((d) => d.typeName == 'Category')
      .map((d) => {
        return {
          id: d.id,
          displayName: d.categoryName,
          enrichments: {
            ...d,
          },
        };
      });

    res.json({ dataList, responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/setup/generalMasters/mailCategory/private/getSubCategoryList',
  (req, res) => {
    const dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';

    const existingWb = XLSX.readFile(dataXlFile);

    const data = XLSX.utils.sheet_to_json(existingWb.Sheets['Sheet1']);

    const dataList = data
      .filter(
        (d) => d.typeName == 'Sub-Category' && d.belongsTo == req.body.dataMap.belongsToCategory,
      )
      .map((d) => {
        return {
          id: d.id,
          displayName: d.categoryName,
          enrichments: {
            ...d,
          },
        };
      });

    res.json({ dataList, responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
  },
);

module.exports = router;
