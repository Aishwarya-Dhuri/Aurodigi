var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var router = express.Router();

router.post(
  '/dummyServer/json/setup/templates/documentDesigner/private/getProductList',
  (req, res) => {
    let dataXlFile = './dummyServer/json/setup/templates/documentDesigner/dropdowns.xlsx';
    let workbook = XLSX.readFile(dataXlFile);
    let xlData = XLSX.utils.sheet_to_json(workbook.Sheets['product']);
    let productWiseList = _.uniqBy(xlData, 'productId');
    let dataList = [];
    _.forEach(productWiseList, function (product) {
      let moduleWiseList = _.filter(xlData, function (o) {
        return o.productId == product.productId;
      });
      moduleWiseList = _.uniqBy(moduleWiseList, 'moduleName');
      let moduleList = [];
      _.forEach(moduleWiseList, function (module) {
        let documentTemplateTypeWiseList = _.filter(xlData, function (o) {
          return o.moduleName == module.moduleName;
        });
        let documentTemplateTypeList = [];
        _.forEach(documentTemplateTypeWiseList, function (template) {
          let applicableChannels = template.applicableChannels
            ? template.applicableChannels.split(',')
            : [];
          let channelList = [];
          _.forEach(applicableChannels, function (channel) {
            channelList.push({
              id: channel,
              displayName: channel,
            });
          });
          documentTemplateTypeList.push({
            id: template.id,
            displayName: template.documentTemplateType,
            enrichments: {
              triggerPoint: template.triggerPoint,
              channelList: channelList,
            },
          });
        });
        moduleList.push({
          id: module.moduleName,
          displayName: module.moduleName,
          enrichments: {
            documentTemplateTypeList: documentTemplateTypeList,
          },
        });
      });
      dataList.push({
        id: product.productId,
        displayName: product.productName,
        enrichments: {
          moduleList: moduleList,
        },
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

router.post('/dummyServer/json/setup/templates/documentDesigner/private/getTagList', (req, res) => {
  let dataXlFile = './dummyServer/json/setup/templates/documentDesigner/dropdowns.xlsx';
  let workbook = XLSX.readFile(dataXlFile);
  let xlData = XLSX.utils.sheet_to_json(workbook.Sheets['tagList']);
  let dataList = [];
  _.forEach(xlData, function (record) {
    if (record.mstId == req.body.dataMap.docTemplateTypeId) {
      dataList.push({
        id: record.tagKey,
        displayName: record.tagName,
        enrichments: {
          isListTag: record.isListTag,
          availableOnUI: record.availableOnUI,
        },
      });
    }
  });
  res.json({
    dataList: dataList,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

router.post(
  '/dummyServer/json/setup/templates/documentDesigner/private/getCopyFrom',
  (req, res) => {},
);

module.exports = router;
