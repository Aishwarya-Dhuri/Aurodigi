var express = require('express');
var router = express.Router();
const multer = require('multer');
const fs = require('fs');

const filePathMap = {
  uploadedFiles: 'dummyServer/uploadedFiles',
  headerImages: 'dummyServer/directDownload/uiAssets/header-images',
  fonts: 'dummyServer/directDownload/uiAssets/fonts',
  'fonts/fontFiles': 'dummyServer/directDownload/uiAssets/fonts/font-files',
  'setup/securityBank/bankUser/signature':
    'dummyServer/directDownload/uiAssets/setup/security-bank/bank-user/signature',
  'setup/security/corporateUser/signature':
    'dummyServer/directDownload/uiAssets/setup/security-corporate/corporate-user/signature',
  'dashboard/advertisements': 'dummyServer/directDownload/uiAssets/dashboard/advertisements',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Saving Files : ') + file.originalname;
    cb(null, filePathMap[req.url.substring(req.url.indexOf('fileUploadService/') + 18)]);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    cb(null, 'sys_' + Date.now() + '_' + name);
  },
});

router.post(
  '/**/fileUploadService/**',
  multer({ storage: storage }).single('files'),
  (req, res) => {
    const file = req.file;
    file['sysFileName'] = file.filename;
    file['fileName'] = file.originalname;
    file['fileSize'] = file.size;
    file['status'] = 'Complete';
    file['progress'] = 100;
    res.status(200).send({
      dataMap: { file },
      responseStatus: { message: 'FILE_UPLOADED_SUCCESSFULLY', status: '0' },
    });
  },
);

router.post('/**/fileDeleteService/**', (req, res) => {
  console.log('Deleting File : ' + req.body.dataMap.fileName);
  let file =
    filePathMap[req.url.substring(req.url.indexOf('fileDeleteService/') + 18)] +
    '/' +
    req.body.dataMap.fileName;
  try {
    fs.unlinkSync(file);
    console.log('successfully deleted : ' + file);
  } catch (err) {
    console.log('Error While Deleting : ' + file);
  }
  res.status(200).send({ responseStatus: { message: 'FILE_DELETED_SUCCESSFULLY', status: '0' } });
});

module.exports = router;
