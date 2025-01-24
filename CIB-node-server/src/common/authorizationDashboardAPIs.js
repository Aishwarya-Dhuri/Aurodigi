const express = require('express');
const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');
const getPendingListRecords = require('../listingAPIs').getPendingListRecords;
let getViewData = require('../crudAPIs').getViewData;
let XLSX = require('xlsx');

const router = express.Router();

router.post(
  '/dummyServer/json/**/authorizationDashboardService/private/getPendingCounts',
  (req, res) => {
    console.log('getting Pending counts for : ' + req.body.dataMap.productId);
    const products = getMenus(req);
    // JSON.parse(
    //   fs.readFileSync(
    //     './dummyServer/json/menus-' + req.session.userDetails.corporateType + '.json',
    //     'utf8',
    //   ),
    // );

    const parentMenus = [];

    const defaultReqModel = {
      startRow: 0,
      endRow: 100000,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: {
        modifiedBy: {
          filter: req.session.userDetails.userName,
          filterType: 'text',
          type: 'notContains',
        },
      },
      sortModel: [],
      entityName: '',
    };
    const overallCounts = {
      displayName: '',
      pendingCount: 0,
      justCreatedCount: 0,
      pendingCriticalCount: 0,
      partialAuthorized: 0,
    };

    _.forEach(products, function (product) {
      if (product.moduleId == req.body.dataMap.productId) {
        overallCounts.displayName = product.moduleName;

        _.forEach(product.menus, function (menu) {
          const parentMenu = {
            displayName: menu.displayName,
            pendingCount: 0,
            justCreatedCount: 0,
            pendingCriticalCount: 0,
            partialAuthorized: 0,
            masterList: [],
          };

          _.forEach(menu.menus, function (childMenu) {
            const serviceUrl = childMenu.serviceUrl;

            const menuCategory = childMenu.menuCategory;

            console.log('/dummyServer/json/' + serviceUrl + '/listingTypes.xlsx');
            if (fs.existsSync('./dummyServer/json/' + serviceUrl + '/listingTypes.xlsx')) {
              try {
                const master = {
                  displayName: childMenu.displayName,
                  pendingCount: 0,
                  justCreatedCount: 0,
                  pendingCriticalCount: 0,
                  partialAuthorized: 0,
                  serviceUrl: serviceUrl,
                  pendingListRouteUrl: serviceUrl + '/listing',
                };
                const pendingList = getPendingListRecords(
                  './dummyServer/json/' + serviceUrl + '/data.xlsx',
                  defaultReqModel,
                  req.session.userDetails,
                );

                master.pendingCount = pendingList.lastRow;
                parentMenu.pendingCount += master.pendingCount;

                _.forEach(pendingList.data, function (row) {
                  if (moment(row.modifiedOn).isAfter(moment().add(-2, 'days'))) {
                    master.justCreatedCount++;
                    parentMenu.justCreatedCount++;
                  }
                  if (
                    menuCategory.toUpperCase().indexOf('TRANSACTION') != -1 &&
                    moment(row.modifiedOn).isBefore(moment().add(-5, 'days'))
                  ) {
                    master.pendingCriticalCount++;
                    parentMenu.pendingCriticalCount++;
                  }
                  if (
                    menuCategory.toUpperCase().indexOf('TRANSACTION') != -1 &&
                    moment(row.modifiedOn).isBefore(moment().add(-10, 'days'))
                  ) {
                    master.partialAuthorized++;
                    parentMenu.partialAuthorized++;
                  }
                });

                if (master.pendingCount > 0) parentMenu.masterList.push(master);
              } catch (error) {
                console.log(
                  'Error (no data.xlsx) while getting count for : ' + childMenu.displayName,
                );
              }
            }
          });
          overallCounts.pendingCount += parentMenu.pendingCount;
          overallCounts.justCreatedCount += parentMenu.justCreatedCount;
          overallCounts.pendingCriticalCount += parentMenu.pendingCriticalCount;
          overallCounts.partialAuthorized += parentMenu.partialAuthorized;

          if (parentMenu.pendingCount > 0) {
            parentMenus.push(parentMenu);
          }
        });
      }
    });

    res.json({
      overallCounts: overallCounts,
      pendingCounts: parentMenus,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

const getMenus = (req) => {
  let workbook = XLSX.readFile('./dummyServer/json/commons/menuService/corporateMenus.xlsx');

  let mainMenus = XLSX.utils.sheet_to_json(workbook.Sheets['modules']);
  let menus = XLSX.utils.sheet_to_json(workbook.Sheets['menus']);
  let links = XLSX.utils.sheet_to_json(workbook.Sheets['links']);
  cleanExtraFeildsFromMenu(menus, req.session.userDetails.corporateType, true);

  // get RoleIds from user sheet then below
  console.log(req.session.userDetails.userId);
  let userData = getViewData('./dummyServer/json/setup/security/corporateUser/data.xlsx', [
    { name: 'id', value: req.session.userDetails.userId },
  ]);
  // console.log(userData);
  let roleIds = [];
  if (req.session.userDetails.loginPreferenceDetails.loginType == 'group') {
    userData.groupUserDetails.forEach((groupUserDetail) => {
      if (groupUserDetail.groupId == req.session.userDetails.loginPreferenceDetails.groupId) {
        groupUserDetail.groupRoles.forEach((role) => {
          roleIds.push(role.roleId.toString());
        });
      }
    });
  } else {
    userData.roles.forEach((role) => {
      roleIds.push(role.roleId.toString());
    });
  }
  // reading Role data
  let roleWorkbook = XLSX.readFile('./dummyServer/json/setup/security/corporateRole/data.xlsx');
  let allRoleRights = XLSX.utils.sheet_to_json(roleWorkbook.Sheets['assignRightList']);
  allRoleRights = _.filter(allRoleRights, function (r) {
    return roleIds.includes(r.mstId.toString());
  });
  //cleaning unwanted modules
  const moduleIdsFromRoles = _.uniqBy(allRoleRights, 'moduleId');
  for (let i = mainMenus.length - 1; i >= 0; i--) {
    let found = false;
    for (let j = 0; j < moduleIdsFromRoles.length; j++) {
      if (mainMenus[i].moduleId.toString() == moduleIdsFromRoles[j].moduleId.toString()) {
        found = true;
        break;
      }
    }
    if (!found) {
      mainMenus.splice(i, 1);
    }
  }

  mainMenus.forEach((mainMenu) => {
    //setting Parent Menus
    let parentMenus = _.filter(menus, function (m) {
      return m.isParentMenu && m.moduleId == mainMenu.moduleId;
    });
    for (let p = parentMenus.length - 1; p >= 0; p--) {
      //setting Masters to parent menu
      let masters = _.filter(menus, function (m) {
        return (
          !m.isParentMenu && m.moduleId == mainMenu.moduleId && m.parentMenuId == parentMenus[p].id
        );
      });

      for (let i = masters.length - 1; i >= 0; i--) {
        //setting links to masters
        const linkIds = masters[i].linkIds.toString().split(',');
        masters[i].menuLinksDetail = {
          link: _.cloneDeep(
            _.filter(links, function (link) {
              return (
                linkIds.includes(link.id.toString()) &&
                hasAccess(allRoleRights, masters[i].id.toString(), link)
              );
            }),
          ),
        };
        //updating links
        masters[i].menuLinksDetail.link.forEach((link) => {
          link.url = link.url.replace(/<<serviceUrl>>/g, masters[i].serviceUrl);
        });
        delete masters[i].linkIds;
        if (masters[i].menuLinksDetail.link.length == 0) {
          masters.splice(i, 1);
        }
      }

      if (masters.length > 0) {
        parentMenus[p].menus = masters;
        delete parentMenus[p].serviceUrl;
        delete parentMenus[p].linkIds;
      } else {
        parentMenus.splice(p, 1);
      }
    }

    mainMenu.menus = parentMenus;
  });

  //adding reports and Dashboard to final set
  mainMenus.unshift({
    id: '26',
    moduleId: '26',
    moduleName: 'Dashboard',
    icon: 'fa-th-large',
    isShortMenu: true,
    menus: [
      { id: '26', displayName: 'Consolidated' },
      { id: '50', displayName: 'CXO' },
    ],
  });
  mainMenus.push({
    id: '27',
    moduleId: '27',
    moduleName: 'Reports',
    icon: 'fa-chart-bar',
    isShortMenu: false,
    menus: [],
  });
  mainMenus.forEach((mainMenu) => {
    //adding dashboard menus
    if (!['Dashboard', 'Reports'].includes(mainMenu.moduleName)) {
      mainMenus[0].menus.push({ id: mainMenu.id, displayName: mainMenu.moduleName });
    }
    //copy reports from respective modules
    for (let i = mainMenu.menus.length - 1; i >= 0; i--) {
      if (mainMenu.menus[i].displayName == 'Reports') {
        mainMenu.menus[i].displayName = mainMenu.menus[i].moduleName;
        mainMenus[mainMenus.length - 1].menus.push(mainMenu.menus[i]);
        mainMenu.menus.splice(i, 1);
        break;
      }
    }
  });

  return mainMenus;
};

function cleanExtraFeildsFromMenu(menus, corporateType, deleteUnwanted) {
  for (let i = menus.length - 1; i >= 0; i--) {
    if (!menus[i].isAvailable) {
      menus.splice(i, 1);
    } else if (corporateType == 'S') {
      menus[i].displayName = menus[i].smeDisplayName;
      if (!menus[i].isAvailableForSME) {
        menus.splice(i, 1);
      }
    } else if (corporateType == 'M') {
      menus[i].displayName = menus[i].msmeDisplayName;
      if (!menus[i].isAvailableForMSME) {
        menus.splice(i, 1);
      }
    }

    if (deleteUnwanted) {
      delete menus[i].smeDisplayName;
      delete menus[i].msmeDisplayName;
      delete menus[i].isAvailableForSME;
      delete menus[i].isAvailableForMSME;
      delete menus[i].isViewApplicable;
      delete menus[i].isDataEntryApplicable;
      delete menus[i].isAuthorizeApplicable;
      delete menus[i].isEnableDisableApplicable;
      delete menus[i].isExecuteApplicable;
      delete menus[i].isVeriferApplicable;
      delete menus[i].isSelfAuthApplicable;
      delete menus[i].isApplicableForNormalUser;
      delete menus[i].isApplicableForGroupUser;
    }
  }
  return menus;
}

function hasAccess(allRoleRights, menuId, link) {
  let access = [];
  masterRoles = _.filter(allRoleRights, function (a) {
    return a.menuId.toString() == menuId.toString();
  });

  _.forEach(masterRoles, function (master) {
    if (master.VIEW && access.indexOf('VIEW') == -1) {
      access.push('VIEW');
    }
    if (master.DATA_ENTRY && access.indexOf('DATA_ENTRY') == -1) {
      access.push('DATA_ENTRY');
    }
    if (master.AUTHORIZE && access.indexOf('AUTHORIZE') == -1) {
      access.push('AUTHORIZE');
    }
    if (master.ENABLE_DISABLE && access.indexOf('ENABLE_DISABLE') == -1) {
      access.push('ENABLE_DISABLE');
    }
    if (master.EXECUTE && access.indexOf('EXECUTE') == -1) {
      access.push('EXECUTE');
    }
    if (master.VERIFER && access.indexOf('VERIFER') == -1) {
      access.push('VERIFER');
    }
    if (master.SELFAUTH && access.indexOf('SELFAUTH') == -1) {
      access.push('SELFAUTH');
    }
  });
  return access.includes(link.access.toString());
}

module.exports = router;
