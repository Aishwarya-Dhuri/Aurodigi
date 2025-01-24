const express = require('express');
const XLSX = require('xlsx');

const getViewData = require('./../crudAPIs').getViewData;
const updateRecordInExcel = require('./../crudAPIs').updateRecordInExcel;

const router = express.Router();

router.post('/dummyServer/json/commons/emailServices/private/getBankUsers', (req, res) => {
  const dataXlFile = './dummyServer/json/setup/securityBank/bankUser/data.xlsx';

  const existingWb = XLSX.readFile(dataXlFile);

  const data = XLSX.utils.sheet_to_json(existingWb.Sheets['Sheet1']);

  const dataList = data.map((d) => {
    return {
      id: d.id,
      displayName: d.loginId,
      enrichments: {
        userFrom: 'BANK',
        emailAddress: d.email,
        firstName: d.firstName,
        category: d.category,
        // ...d,
      },
    };
  });

  res.json({ dataList, responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
});

router.post('/dummyServer/json/commons/emailServices/private/getCorporateUsers', (req, res) => {
  const dataXlFile = './dummyServer/json/setup/security/corporateUser/data.xlsx';

  const existingWb = XLSX.readFile(dataXlFile);

  const data = XLSX.utils.sheet_to_json(existingWb.Sheets['Sheet1']);

  const dataList = data.map((d) => {
    return {
      id: d.id,
      displayName: d.userId,
      enrichments: {
        userFrom: 'CORPORATE',
        emailAddress: d.email,
        firstName: d.firstName,
        categoryId: d.categoryId,
        category: d.categoryName,
        // ...d,
      },
    };
  });

  res.json({ dataList, responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
});

router.post('/dummyServer/json/commons/emailServices/private/getUnreadList', (req, res) => {
  const dataXlFile = './dummyServer/json/commons/emailServices/data.xlsx';

  const existingWb = XLSX.readFile(dataXlFile);

  const xlData = XLSX.utils.sheet_to_json(existingWb.Sheets['Sheet1']);

  const data = xlData
    .filter((d) => d.isRead == false)
    .map((d) => {
      return {
        id: d.id,
        fromUserName: d.fromUserName,
        fromUserImage: d.fromUserImage,
        category: d.category,
        subCategory: d.subCategory,
        subject: d.subject,
        attachmentFiles: d.attachmentFiles ? d.attachmentFiles : 0,
        dateTime: d.modifiedSysOn,
      };
    });

  const response = {
    data,
    lastRow: data.length,
    responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' },
  };

  res.json(response);
});

router.post('/dummyServer/json/commons/emailServices/private/getSendList', (req, res) => {
  const dataXlFile = './dummyServer/json/commons/emailServices/data.xlsx';

  const existingWb = XLSX.readFile(dataXlFile);

  const xlData = XLSX.utils.sheet_to_json(existingWb.Sheets['Sheet1']);

  const data = xlData
    .filter((d) => d.mailStatus == 'send')
    .map((d) => {
      return {
        id: d.id,
        category: d.category,
        subCategory: d.subCategory,
        subject: d.subject,
        attachmentFiles: d.attachmentFiles ? d.attachmentFiles : 0,
        dateTime: d.modifiedSysOn,
        isRead: d.isRead,
        actions: [
          {
            index: 1,
            displayName: 'Read',
            type: 'ICON',
            icon: d.isRead ? 'far fa-envelope-open' : 'far fa-envelope',
            url: null,
            paramList: 'id',
            methodName: 'markAsRead',
            color: null,
          },
          {
            index: 2,
            displayName: 'Star',
            icon: d.isStarred ? 'fas fa-star' : 'far fa-star',
            url: null,
            type: 'ICON',
            paramList: 'id',
            methodName: 'markAsStar',
            class: d.isStarred ? 'text-color-warning' : '',
          },
          {
            index: 2,
            displayName: 'Delete',
            icon: 'far fa-trash-alt',
            url: null,
            type: 'ICON',
            paramList: 'id',
            methodName: 'deleteMail',
          },
        ],
      };
    });

  const response = {
    data,
    lastRow: data.length,
    responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' },
  };

  res.json(response);
});

router.post('/dummyServer/json/commons/emailServices/private/getDraftList', (req, res) => {
  const dataXlFile = './dummyServer/json/commons/emailServices/data.xlsx';

  const existingWb = XLSX.readFile(dataXlFile);

  const xlData = XLSX.utils.sheet_to_json(existingWb.Sheets['Sheet1']);

  const data = xlData
    .filter((d) => d.isDraft || d.mailStatus == 'draft')
    .map((d) => {
      return {
        id: d.id,
        category: d.category,
        subCategory: d.subCategory,
        subject: d.subject,
        attachmentFiles: d.attachmentFiles ? d.attachmentFiles : 0,
        dateTime: d.modifiedSysOn,
        isRead: d.isRead,
        actions: [
          {
            index: 1,
            displayName: 'Read',
            type: 'ICON',
            icon: d.isRead ? 'far fa-envelope-open' : 'far fa-envelope',
            url: null,
            paramList: 'id',
            methodName: 'markAsRead',
            color: null,
          },
          {
            index: 2,
            displayName: 'Star',
            icon: d.isStarred ? 'fas fa-star' : 'far fa-star',
            url: null,
            type: 'ICON',
            paramList: 'id',
            methodName: 'markAsStar',
            class: d.isStarred ? 'text-color-warning' : '',
          },
          {
            index: 2,
            displayName: 'Delete',
            icon: 'far fa-trash-alt',
            url: null,
            type: 'ICON',
            paramList: 'id',
            methodName: 'deleteMail',
          },
        ],
      };
    });

  const response = {
    data,
    lastRow: data.length,
    responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' },
  };

  res.json(response);
});

router.post('/dummyServer/json/commons/emailServices/private/getStarredList', (req, res) => {
  const dataXlFile = './dummyServer/json/commons/emailServices/data.xlsx';

  const existingWb = XLSX.readFile(dataXlFile);

  const xlData = XLSX.utils.sheet_to_json(existingWb.Sheets['Sheet1']);

  const data = xlData
    .filter((d) => d.isStarred)
    .map((d) => {
      return {
        id: d.id,
        category: d.category,
        subCategory: d.subCategory,
        subject: d.subject,
        attachmentFiles: d.attachmentFiles ? d.attachmentFiles : 0,
        dateTime: d.modifiedSysOn,
        isRead: d.isRead,
        actions: [
          {
            index: 1,
            displayName: 'Read',
            type: 'ICON',
            icon: d.isRead ? 'far fa-envelope-open' : 'far fa-envelope',
            url: null,
            paramList: 'id',
            methodName: 'markAsRead',
            color: null,
          },
          {
            index: 2,
            displayName: 'Star',
            icon: d.isStarred ? 'fas fa-star' : 'far fa-star',
            url: null,
            type: 'ICON',
            paramList: 'id',
            methodName: 'markAsStar',
            class: d.isStarred ? 'text-color-warning' : '',
          },
          {
            index: 2,
            displayName: 'Delete',
            icon: 'far fa-trash-alt',
            url: null,
            type: 'ICON',
            paramList: 'id',
            methodName: 'deleteMail',
          },
        ],
      };
    });

  const response = {
    data,
    lastRow: data.length,
    responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' },
  };

  res.json(response);
});

router.post('/dummyServer/json/commons/emailServices/private/getEmailInboxList', (req, res) => {
  const dataXlFile = './dummyServer/json/commons/emailServices/data.xlsx';

  const existingWb = XLSX.readFile(dataXlFile);

  const xlData = XLSX.utils.sheet_to_json(existingWb.Sheets['Sheet1']);

  const links = [];

  const data = xlData
    .filter((d) => d.mailStatus != 'deleted')
    .map((d) => {
      return {
        id: d.id,
        category: d.category,
        subCategory: d.subCategory,
        subject: d.subject,
        attachmentFiles: d.attachmentFiles ? d.attachmentFiles : 0,
        dateTime: d.modifiedSysOn,
        isRead: d.isRead,
        actions: [
          {
            index: 1,
            displayName: 'Read',
            type: 'ICON',
            icon: d.isRead ? 'far fa-envelope-open' : 'far fa-envelope',
            url: null,
            paramList: 'id',
            methodName: 'markAsRead',
            color: null,
          },
          {
            index: 2,
            displayName: 'Star',
            icon: d.isStarred ? 'fas fa-star' : 'far fa-star',
            url: null,
            type: 'ICON',
            paramList: 'id',
            methodName: 'markAsStar',
            class: d.isStarred ? 'text-color-warning' : '',
          },
          {
            index: 2,
            displayName: 'Delete',
            icon: 'far fa-trash-alt',
            url: null,
            type: 'ICON',
            paramList: 'id',
            methodName: 'deleteMail',
          },
        ],
      };
    });

  const response = {
    data,
    lastRow: data.length,
    responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' },
  };

  res.json(response);
});

router.post('/dummyServer/json/commons/emailServices/private/getDeletedList', (req, res) => {
  const dataXlFile = './dummyServer/json/commons/emailServices/data.xlsx';

  const existingWb = XLSX.readFile(dataXlFile);

  const xlData = XLSX.utils.sheet_to_json(existingWb.Sheets['Sheet1']);

  const links = [];

  const data = xlData
    .filter((d) => d.mailStatus == 'deleted')
    .map((d) => {
      return {
        id: d.id,
        category: d.category,
        subCategory: d.subCategory,
        subject: d.subject,
        attachmentFiles: d.attachmentFiles ? d.attachmentFiles : 0,
        dateTime: d.modifiedSysOn,
        isRead: d.isRead,
        actions: [
          {
            index: 1,
            displayName: 'Read',
            type: 'ICON',
            icon: d.isRead ? 'far fa-envelope-open' : 'far fa-envelope',
            url: null,
            paramList: 'id',
            methodName: 'markAsRead',
            color: null,
          },
          {
            index: 2,
            displayName: 'Star',
            icon: d.isStarred ? 'fas fa-star' : 'far fa-star',
            url: null,
            type: 'ICON',
            paramList: 'id',
            methodName: 'markAsStar',
            class: d.isStarred ? 'text-color-warning' : '',
          },
          {
            index: 2,
            displayName: 'Delete',
            icon: 'far fa-trash-alt',
            url: null,
            type: 'ICON',
            paramList: 'id',
            methodName: 'deleteMail',
          },
        ],
      };
    });

  const response = {
    data,
    lastRow: data.length,
    responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' },
  };

  res.json(response);
});

router.post('/dummyServer/json/commons/emailServices/private/markAsRead', (req, res) => {
  const dataXlFile = './dummyServer/json/commons/emailServices/data.xlsx';

  const data = getViewData(dataXlFile, [{ name: 'id', value: req.body.dataMap.id }]);

  if (data) {
    data.isRead = true;
    updateRecordInExcel(dataXlFile, data, req.session.userDetails);
  }

  const response = {
    responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' },
  };

  res.json(response);
});

router.post('/dummyServer/json/commons/emailServices/private/markAllAsRead', (req, res) => {
  const dataXlFile = './dummyServer/json/commons/emailServices/data.xlsx';

  const n = req.body.dataMap.ids.length;

  for (let i = 0; i < n; i++) {
    const data = getViewData(dataXlFile, [{ name: 'id', value: req.body.dataMap.ids[i] }]);

    if (data) {
      data.isRead = true;
      updateRecordInExcel(dataXlFile, data, req.session.userDetails);
    }
  }

  const response = {
    responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' },
  };

  res.json(response);
});

router.post('/dummyServer/json/commons/emailServices/private/markAsStar', (req, res) => {
  const dataXlFile = './dummyServer/json/commons/emailServices/data.xlsx';

  const data = getViewData(dataXlFile, [{ name: 'id', value: req.body.dataMap.id }]);

  if (data) {
    data.isStarred = !data.isStarred;
    updateRecordInExcel(dataXlFile, data, req.session.userDetails);
  }

  const response = {
    responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' },
  };

  res.json(response);
});

router.post('/dummyServer/json/commons/emailServices/private/markAllAsStar', (req, res) => {
  const dataXlFile = './dummyServer/json/commons/emailServices/data.xlsx';

  const n = req.body.dataMap.ids.length;

  for (let i = 0; i < n; i++) {
    const data = getViewData(dataXlFile, [{ name: 'id', value: req.body.dataMap.ids[i] }]);

    if (data) {
      data.isStarred = true;
      updateRecordInExcel(dataXlFile, data, req.session.userDetails);
    }
  }

  const response = {
    responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' },
  };

  res.json(response);
});

router.post('/dummyServer/json/commons/emailServices/private/markAsDelete', (req, res) => {
  const dataXlFile = './dummyServer/json/commons/emailServices/data.xlsx';

  const data = getViewData(dataXlFile, [{ name: 'id', value: req.body.dataMap.id }]);

  if (data) {
    data.mailStatus = 'deleted';

    updateRecordInExcel(dataXlFile, data, req.session.userDetails);
  }

  const response = {
    responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' },
  };

  res.json(response);
});

router.post('/dummyServer/json/commons/emailServices/private/markAllAsDelete', (req, res) => {
  const dataXlFile = './dummyServer/json/commons/emailServices/data.xlsx';

  const n = req.body.dataMap.ids.length;

  for (let i = 0; i < n; i++) {
    const data = getViewData(dataXlFile, [{ name: 'id', value: req.body.dataMap.ids[i] }]);

    if (data) {
      data.mailStatus = 'deleted';

      updateRecordInExcel(dataXlFile, data, req.session.userDetails);
    }
  }

  const response = {
    responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' },
  };

  res.json(response);
});

router.post('/dummyServer/json/commons/emailServices/private/getMailDetails', (req, res) => {
  const dataXlFile = './dummyServer/json/commons/emailServices/data.xlsx';

  const data = getViewData(dataXlFile, [{ name: 'id', value: req.body.dataMap.id }]);

  console.log(data);

  const response = {};

  if (data) {
    response.data = {
      ...data,
      dateTime: data.modifiedSysOn,
      categoryName: data.category,
      subCategoryName: data.subCategory,
      senderFirstName: data.firstName,
      senderUserCategory: data.userCategory,
      sendersCorporateId: data.corporateId,
      sendersCorporateName: data.corporateName,
      actionLinks: [
        {
          index: 1,
          displayName: 'Reply',
          icon: 'fas fa-reply',
          url: null,
          onClick: 'replyMail',
        },
        {
          index: 2,
          displayName: 'Forward',
          icon: 'fas fa-share',
          url: null,
          onClick: 'forwardMail',
        },
        {
          index: 3,
          displayName: 'Print',
          icon: 'fas fa-print',
          url: null,
          onClick: 'printMail',
        },
        {
          index: 4,
          displayName: 'Star',
          icon: 'far fa-star',
          url: null,
          onClick: 'markAsRead',
        },
        {
          index: 5,
          displayName: 'Delete',
          icon: 'far fa-trash-alt',
          url: null,
          onClick: 'deleteMail',
        },
      ],
      attachments: data.attachment ? data.attachment : [],
    };
  }
  response.responseStatus = { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' };

  res.json(response);
});

module.exports = router;
