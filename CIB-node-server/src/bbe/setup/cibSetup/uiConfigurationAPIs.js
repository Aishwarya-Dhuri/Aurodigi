var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var getViewData = require('../../../crudAPIs').getViewData;
var router = express.Router();
const fs = require('fs');
var ip = require('ip');

router.post(
  '/dummyServer/json/setup/cibSetup/uiConfiguration/private/getConfigDropdownLists',
  (req, res) => {
    let response = {};
    const dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'dropdowns.xlsx';
    const dropdownNames = [
      'menuTypes',
      'formControlStyles',
      'toasterPositions',
      'toasterTimes',
      'iconStyles',
      'buttonStyles',
      'formCardStyles',
    ];
    let workbook = XLSX.readFile(dataXlFile);
    _.forEach(dropdownNames, function (sheetName) {
      let xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      let dataList = [];
      _.forEach(xlData, function (record) {
        var tempRecord = {
          id: record.id,
          displayName: record.displayName,
        };
        var enrichments = {};
        _.forEach(_.keys(record), function (field) {
          if (field != 'id' && field != 'displayName') {
            enrichments[field] = record[field];
          }
        });
        tempRecord.enrichments = enrichments;
        dataList.push(tempRecord);
      });
      response[sheetName] = dataList;
    });
    //theme
    let dataXlFile1 =
      './dummyServer/json/setup/cibSetup/uiConfiguration/themeConfiguration/data.xlsx';
    var workbook1 = XLSX.readFile(dataXlFile1);
    var xlData = XLSX.utils.sheet_to_json(workbook1.Sheets['sheet1']);
    response.themes = [{ id: '1', displayName: 'Aurionpro' }];
    _.forEach(xlData, function (record) {
      response.themes.push({
        id: record.id,
        displayName: record.name,
      });
    });

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/setup/cibSetup/uiConfiguration/themeConfiguration/private/getThemeList',
  (req, res) => {
    let response = { themes: [] };
    let dataXlFile1 =
      './dummyServer/json/setup/cibSetup/uiConfiguration/themeConfiguration/data.xlsx';
    var workbook1 = XLSX.readFile(dataXlFile1);
    var xlData = XLSX.utils.sheet_to_json(workbook1.Sheets['Sheet1']);
    _.forEach(xlData, function (record) {
      if (record.isAvailable) {
        response.themes.push({
          id: record.id,
          displayName: record.name,
          enrichments: {
            themeImage: record.themeImage,
          },
        });
      }
    });

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/setup/cibSetup/uiConfiguration/themeConfiguration/private/getDefaultTheme',
  (req, res) => {
    const dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'default.xlsx';
    let filters = [{ name: 'id', value: 1 }];
    res.json(getViewData(dataXlFile, filters));
  },
);

router.post(
  '/dummyServer/json/setup/cibSetup/uiConfiguration/fontConfiguration/private/getFontList',
  (req, res) => {
    let response = { fonts: [] };
    let dataXlFile1 =
      './dummyServer/json/setup/cibSetup/uiConfiguration/fontConfiguration/data.xlsx';
    var workbook1 = XLSX.readFile(dataXlFile1);
    var xlData = XLSX.utils.sheet_to_json(workbook1.Sheets['Sheet1']);
    _.forEach(xlData, function (record) {
      response.fonts.push({
        id: record.id,
        displayName: record.name,
        enrichments: {
          fontFileName: record.fontFileName,
        },
      });
    });

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/setup/cibSetup/uiConfiguration/fontConfiguration/private/createFontFile',
  (req, res) => {
    const fontFileRootPath = 'http://' + ip.address() + ':3000/assets/fonts/font-files/';
    let cssTemplate = fs.readFileSync(
      './src/bbe/setup/cibSetup/uiConfiguration/fontTemplate.css',
      'utf8',
    );
    let regularFontFileUrls = '';
    _.forEach(req.body.regularFontFileList, function (font, index) {
      regularFontFileUrls =
        regularFontFileUrls + ' url(' + fontFileRootPath + font.sysFileName + ')';
      if (font.sysFileName.endsWith('woff')) {
        regularFontFileUrls = regularFontFileUrls + " format('woff')";
      } else if (font.sysFileName.endsWith('woff2')) {
        regularFontFileUrls = regularFontFileUrls + " format('woff2')";
      } else if (font.sysFileName.endsWith('ttf')) {
        regularFontFileUrls = regularFontFileUrls + " format('truetype')";
      }
      if (index != req.body.regularFontFileList.length - 1) {
        regularFontFileUrls = regularFontFileUrls + ',';
      }
    });
    cssTemplate = cssTemplate.replace(/<<regularFontUrls>>/g, regularFontFileUrls);

    let lightFontFileUrls = '';
    if (!req.body.isLightAsRegular) {
      _.forEach(req.body.lightFontFileList, function (font, index) {
        lightFontFileUrls = lightFontFileUrls + ' url(' + fontFileRootPath + font.sysFileName + ')';
        if (font.sysFileName.endsWith('woff')) {
          lightFontFileUrls = lightFontFileUrls + " format('woff')";
        } else if (font.sysFileName.endsWith('woff2')) {
          lightFontFileUrls = lightFontFileUrls + " format('woff2')";
        } else if (font.sysFileName.endsWith('ttf')) {
          lightFontFileUrls = lightFontFileUrls + " format('truetype')";
        }
        if (index != req.body.lightFontFileList.length - 1) {
          lightFontFileUrls = lightFontFileUrls + ',';
        }
      });
    } else {
      lightFontFileUrls = _.cloneDeep(regularFontFileUrls);
    }
    cssTemplate = cssTemplate.replace(/<<lightFontUrls>>/g, lightFontFileUrls);

    let semiBoldFontFileUrls = '';
    if (!req.body.isSemiBoldAsRegular) {
      _.forEach(req.body.semiBoldFontFileList, function (font, index) {
        semiBoldFontFileUrls =
          semiBoldFontFileUrls + ' url(' + fontFileRootPath + font.sysFileName + ')';
        if (font.sysFileName.endsWith('woff')) {
          semiBoldFontFileUrls = semiBoldFontFileUrls + " format('woff')";
        } else if (font.sysFileName.endsWith('woff2')) {
          semiBoldFontFileUrls = semiBoldFontFileUrls + " format('woff2')";
        } else if (font.sysFileName.endsWith('ttf')) {
          semiBoldFontFileUrls = semiBoldFontFileUrls + " format('truetype')";
        }
        if (index != req.body.semiBoldFontFileList.length - 1) {
          semiBoldFontFileUrls = semiBoldFontFileUrls + ',';
        }
      });
    } else {
      semiBoldFontFileUrls = _.cloneDeep(regularFontFileUrls);
    }
    cssTemplate = cssTemplate.replace(/<<semiBoldFontUrls>>/g, semiBoldFontFileUrls);

    let boldFontFileUrls = '';
    if (!req.body.isBoldAsRegular) {
      _.forEach(req.body.boldFontFileList, function (font, index) {
        boldFontFileUrls = boldFontFileUrls + ' url(' + fontFileRootPath + font.sysFileName + ')';
        if (font.sysFileName.endsWith('woff')) {
          boldFontFileUrls = boldFontFileUrls + " format('woff')";
        } else if (font.sysFileName.endsWith('woff2')) {
          boldFontFileUrls = boldFontFileUrls + " format('woff2')";
        } else if (font.sysFileName.endsWith('ttf')) {
          boldFontFileUrls = boldFontFileUrls + " format('truetype')";
        }
        if (index != req.body.boldFontFileList.length - 1) {
          boldFontFileUrls = boldFontFileUrls + ',';
        }
      });
    } else {
      boldFontFileUrls = _.cloneDeep(regularFontFileUrls);
    }
    cssTemplate = cssTemplate.replace(/<<boldFontUrls>>/g, boldFontFileUrls);

    let fontFileName = req.body.name.toLowerCase().split(' ').join('_');
    fontFileName = 'sys_' + Date.now() + '_' + fontFileName + '.css';
    fs.writeFileSync('./dummyServer/directDownload/uiAssets/fonts/' + fontFileName, cssTemplate);

    res.json({
      dataMap: { fontFileName: fontFileName },
      responseStatus: { message: 'FONT_CREATED_SUCCESSFULLY', status: '0' },
    });
  },
);

module.exports = router;
