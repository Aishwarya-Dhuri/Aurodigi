import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { gridsterConfig } from 'src/app/shared/@config/gridster.config';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ChequeCollectionLimitBurstComponent } from './@components/cheque-collection-limit-burst/cheque-collection-limit-burst.component';
import { DeviationMatrixComponent } from './@components/deviation-matrix/deviation-matrix.component';
import { NewCustomerAcquisitionComponent } from './@components/new-customer-acquisition/new-customer-acquisition.component';
import { OngoingTransactionsComponent } from './@components/ongoing-transactions/ongoing-transactions.component';
import { ProcessingComponent } from './@components/processing/processing.component';
import { ProductWiseDistributionComponent } from './@components/product-wise-distributuin/product-wise-distribution.component';
import { RevenueGeneratedComponent } from './@components/revenue-generated/revenue-generated.component';
import { cloneDeep } from 'lodash';
import { UserDetails } from 'src/app/base/@models/user.details';
import { ColDef } from 'ag-grid-community';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';

@Component({
  selector: 'app-relationship-manager',
  templateUrl: './relationship-manager.component.html',
  styleUrls: ['./relationship-manager.component.scss'],
})
export class RelationshipManagerComponent implements OnInit, OnDestroy {
  @ViewChild('currencySellReview') currencySellReview!: AgGridListingComponent;
  loading: boolean;

  showLimitDetails: boolean = false;
  showLedgerBalance: boolean = false;
  showMonthlyAverageBalance: boolean = false;
  showDeviationMatrix: boolean = false;

  userDetails: any;
  currency: string = '';

  corporateProductWiseDistributionLoading: boolean = true;

  gridsterOptions: any = {
    ...gridsterConfig,
    margin: 16,
    outerMarginTop: 4,
    outerMarginRight: 4,
    outerMarginBottom: 4,
    outerMarginLeft: 4,
    minCols: 12,
    maxCols: 24,
    minRows: 4,
    maxRows: 100,
    maxItemCols: 24,
    minItemCols: 12,
    maxItemRows: 24,
    minItemRows: 4,
    mobileBreakpoint: 768,
  };

  gridComponents: any = {
    newCustomerAcquisition: NewCustomerAcquisitionComponent,
    revenueGenerated: RevenueGeneratedComponent,
    ongoingTransactions: OngoingTransactionsComponent,
    deviationMatrix: DeviationMatrixComponent,
    processing: ProcessingComponent,
    productWiseDistribution: ProductWiseDistributionComponent,
    chequeCollectionLimitBurst: ChequeCollectionLimitBurstComponent,
  };

  overallGridData: any[] = [];

  productWiseGridData: any[] = [];

  isLoadPerformanceOptions: boolean = true;

  selectedPerformanceYear: any = 5;

  tabs: string[] = ['Overall', 'Corporate Wise', 'Product Wise', 'My Performance', 'References'];
  activeTab: string = this.tabs[0];

  rmDetails: any = {
    totalAllocatedLimit: 0,
    utilizedLimit: 0,
    availableLimit: 0,
    ledgerBalance: 0,
    monthlyAverageBalance: 0,
    noOfAccounts: 0,
  };

  rmCorporates: any[] = [
    { id: 'Toyota Auto Body', displayName: 'Toyota Auto Body' },
    { id: 'Toyota Mobility', displayName: 'Toyota Mobility' }
  ];

  rmTasks: any[] = [];
  sanctionedLimit = '4150'
  utilizedLimit = '1150'
  availableLimit = '3000'

  rmReminders: any[] = [];
  rmReminder: any;
  showRmReminderModal: boolean = false;

  selectedCorporate = this.rmCorporates[0].id;
  corporateDetails: any;
  corporateList: any[] = [
    { id: 'Toyota Auto Body', displayName: 'Toyota Auto Body' },
    { id: 'Toyota Mobility', displayName: 'Toyota Mobility' },
    { id: 'Across CLients', displayName: 'Across CLients' }
  ];
  downloadSummary: string = ''
  downloadSummaryTrade: string = ''
  downloadSummarySetup: string = ''
  downloadFormat: string = ''
  downloadFormatTrade: string = ''
  downloadFormatSetup: string = ''
  selectedClient = 'Toyota Auto Body';
  paymentFilterBy: string = 'Today';
  tradeFilterBy: string = 'Today';
  setupFilterBy: string = 'Today';
  fscmFilterBy: string = 'Today';
  paymentProduct: string = 'Vendor Payment';
  tradeProduct: string = 'Import LC';
  setupProduct: string = 'Beneficiary';
  fscmProduct: string = 'Invoice Payment';
  paymentCorporate: string = 'Toyota Auto Body';
  tradeCorporate: string = 'Toyota Auto Body';
  setupCorporate: string = 'Toyota Auto Body';
  fscmCorporate: string = 'Toyota Auto Body';
  exportCorporates: string = this.paymentCorporate
  exportCorporatesTrade: string = this.paymentCorporate
  exportFormat: string = '';
  exportFormatTrade: string = '';
  exportFormatSetup: string = '';
  exportDate: string = '';
  exportDateTrade: string = '';
  exportDateSetup: string = '';

  exportCorporatesList = [
    { displayName: 'Toyota Auto Body', id: 'Toyota Auto Body' },
    { displayName: 'Toyota Mobility', id: 'Toyota Mobility' }
  ]

  exportFormatList = [
    { displayName: 'PDF', id: 'PDF' },
    { displayName: 'Excel', id: 'Excel' },
    { displayName: 'Text', id: 'Text' }
  ]

  exportDateList = [
    { displayName: 'Today', id: 'Today' },
    { displayName: 'This Week', id: 'This Week' },
    { displayName: 'This Month', id: 'This Month' },
    { displayName: 'Last Month', id: 'Last Month' },
    { displayName: 'Date Range', id: 'Date Range' },
  ]

  filterByList = [
    { displayName: 'Today', id: 'Today' },
    { displayName: 'This Week', id: 'This Week' },
    { displayName: 'This Month', id: 'This Month' },
    { displayName: 'Date Range', id: 'Date Range' },
  ]

  productCorporateList = [
    { displayName: 'Across Clients', id: 'Across Clients' },
    { displayName: 'Toyota Auto Body', id: 'Toyota Auto Body' },
    { displayName: 'Toyota Mobility', id: 'Toyota Mobility' },
    { displayName: 'Toyota Motors', id: 'Toyota Motors' }
  ]

  paymentProductList = [
    { displayName: 'Vendor Payment', id: 'Vendor Payment' },
    { displayName: 'Salary Payment', id: 'Salary Payment' },
    { displayName: 'WPS', id: 'WPS' }
  ]

  tradeProductList = [
    { displayName: 'Import LC', id: 'Import LC' },
    { displayName: 'Bank Guarantee', id: 'Bank Guarantee' },
    { displayName: 'Shipping Guarantee', id: 'Shipping Guarantee' }
  ]

  setupProductList = [
    // { displayName: 'All', id: 'All' },
    { displayName: 'Beneficiary', id: 'Beneficiary' },
    { displayName: 'Corporate User', id: 'Corporate User' },
    { displayName: 'Corporate Authorization Matrix', id: 'Corporate Authorization Matrix' }
  ]

  fscmProductList = [
    // { displayName: 'All', id: 'All' },
    { displayName: 'Invoice Entry and Acceptance', id: 'Invoice Entry and Acceptance' },
    { displayName: 'Invoice Payment', id: 'Invoice Payment' },
    { displayName: 'Seller Finance', id: 'Seller Finance' },
    { displayName: 'Dealer Finance', id: 'Dealer Finance' }
  ]

  defaultPerformanceOptions: any = {
    data: [
      {
        xLabel: 'Big Sales',
        yLabel0: 1000,
        yLabel1: 1000,
        yLabel2: 500,
      },
      {
        xLabel: 'Kelly Jones',
        yLabel0: 1000,
        yLabel1: 1000,
        yLabel2: 500,
      },
      {
        xLabel: 'Caroline Jones',
        yLabel0: 1000,
        yLabel1: 1000,
        yLabel2: 0,
      },
      {
        xLabel: 'MB Rep',
        yLabel0: 1000,
        yLabel1: 1000,
        yLabel2: 0,
      },
      {
        xLabel: 'Account Manager 2',
        yLabel0: 1000,
        yLabel1: 1000,
        yLabel2: 0,
      },
      {
        xLabel: 'Orio Ori',
        yLabel0: 1000,
        yLabel1: 1000,
        yLabel2: 0,
      },
      {
        xLabel: 'New Admin Admin2',
        yLabel0: 1000,
        yLabel1: 1000,
        yLabel2: 0,
      },
    ],
    xKey: 'xLabel',
    xLabel: 'Payment Type',
    yKeys: ['yLabel0', 'yLabel1', 'yLabel2'],
    yLabels: ['Target', 'Current Target', 'Actual'],
    chartType: 'groupedColumn',
    chartShadow: false,
    categoryAxesPosition: 'bottom',
    categoryAxesTitle: '',
    categoryAxesRotationAngle: '',
    numberAxesPosition: ['left'],
    numberAxesTitle: [''],
    numberAxesRotationAngle: [''],
    legendPosition: 'bottom',
    legendItemMarkerShape: 'circle',
    legendItemMarkerSize: 8,
    legendItemLabelSize: 12,
    legendItemLabelFormatterMethodname: '',
  };

  performanceOptions = cloneDeep(this.defaultPerformanceOptions);

  showVideo: boolean = false;
  references: string[] = ['Demo Videos', 'Guidelines', 'Presentation', 'MIS List'];
  activeReference: any = this.references[0];

  products: string[] = ['Payments', 'Trade Finance', 'Setup', 'FSCM'];
  activeProduct: any = this.products[0];

  referencesData: any = {
    guidelines: [],
    presentation: [],
    misList: [],
  };

  activeDemoVideo: any;

  corporateInfoTabs: any[] = ['Client Info', 'Account Info', 'Credit Ratings'];
  activeCorporateInfoTab: any = this.corporateInfoTabs[0];

  insights = [
    {
      icon: 'fa-info-circle',
      label: 'Tata Motors has the most credit lines in past 4 weeks',
    },
    {
      icon: 'fa-info-circle',
      label: 'Five corporates have unutilised credit that can be leveraged.',
    },
    {
      icon: 'fa-info-circle',
      label: 'Two corporates have been given credit line enhancements in the past quarter',
    },
  ];

  deviationMatrixColDefs: any = 'commons/relationshipManagerService/private/deviationMatrixColDefs';

  deviationMatrixDataUrl: any = 'dashboard/relationshipManager/private/getDeviationMatrix';

  limitDetailsColDefs: any = 'commons/relationshipManagerService/private/limitDetailsColDefs';
  limitDetailsDataUrl: any = 'dashboard/relationshipManager/private/getLimitData';

  ledgerBalanceColDefs: any = 'commons/relationshipManagerService/private/ledgerBalanceColDefs';

  ledgerBalanceDataUrl: any = 'dashboard/relationshipManager/private/getLedgerBalance';

  monthlyAverageBalanceColDefs: any =
    'commons/relationshipManagerService/private/monthlyAverageBalanceColDefs';

  monthlyAverageBalanceDataUrl: any =
    'dashboard/relationshipManager/private/getMonthlyAverageBalance';

  referencesDataUrl: any = 'dashboard/relationshipManager/private/getReferences';

  corporateProductWiseDistributionOptions: any = {};

  context: any = { componentParent: this };
  fameworkComponents: any = {};

  gridOptions: any = {
    rowModelType: 'clientSide',
    pagination: false,
  };

  gridServerSideOptions: any = {
    rowModelType: 'serverSide',
    pagination: false,
  };

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private currencyService: CurrencyService,
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.userService.getUserDetails().subscribe((userDetails: UserDetails) => {
      this.userDetails = userDetails;
    });
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Relationship Manager',
      subHeading: null,
      widgetsActions: false,
      refresh: true,
      widgets: false,
      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [{ label: 'Dashboard' }, { label: 'Relationship Manager' }];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.httpService
      .httpPost('dashboard/relationshipManager/private/getRmGrid', {
        dataMap: {},
      })
      .subscribe((response: any) => {
        this.overallGridData = response.data.filter((grid: any) => grid.type == 'overall');
        this.productWiseGridData = response.data.filter((grid: any) => grid.type == 'productWise');
      });

    this.resetReminderForm();

    this.getDashboardData();

    this.getRmCorporates();

    this.getRmCorporateBalance(this.selectedCorporate);

    this.loading = false;
  }

  getDashboardData() {
    this.getCorporateProductData('');
    this.getTasks();
    this.getReminders();

    this.httpService
      .httpPost(this.referencesDataUrl, {
        dataMap: {},
      })
      .subscribe((response: any) => {
        this.referencesData = response.data;
      });

    this.httpService
      .httpPost('dashboard/relationshipManager/private/getRmPerformance', {
        dataMap: {},
      })
      .subscribe((response: any) => {
        this.defaultPerformanceOptions = response.data;

        this.onChangeFinancialYear();
      });
  }

  onChangeFinancialYear() {
    this.isLoadPerformanceOptions = true;

    let yearGrowth = 1;

    if (this.selectedPerformanceYear == 1) {
      yearGrowth = 0.5;
    } else if (this.selectedPerformanceYear == 2) {
      yearGrowth = 0.675;
    } else if (this.selectedPerformanceYear == 3) {
      yearGrowth = 0.75;
    } else if (this.selectedPerformanceYear == 4) {
      yearGrowth = 1;
    } else if (this.selectedPerformanceYear == 5) {
      yearGrowth = 1.25;
    }

    const performanceOptions = cloneDeep(this.defaultPerformanceOptions);

    performanceOptions.data = performanceOptions.data.map((option: any) => {
      return {
        ...option,
        yLabel0: option.yLabel0 * yearGrowth * 1.2,
        yLabel1: option.yLabel1 * yearGrowth * 1.4,
        yLabel2: option.yLabel2 * yearGrowth * 1.6,
      };
    });

    this.performanceOptions = performanceOptions;

    console.log(this.performanceOptions.data);

    setTimeout(() => {
      this.isLoadPerformanceOptions = false;
    }, 100);
  }

  downloadLink(link: string) {
    this.httpService.httpDownload(link);
  }

  getAssetUrl(link: string) {
    return this.httpService.getAssetUrl(link);
  }

  playVideo(video: any) {
    this.activeDemoVideo = video;
    this.showVideo = true;
  }

  scroll(corporateInfoTab: any, sectionIndex: number) {
    this.activeCorporateInfoTab = corporateInfoTab;

    const elementId = 'section-' + (sectionIndex + 1);

    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView();
    }
  }

  changeCorporate(corporate: any) {
    this.selectedCorporate = corporate.value;
    this.getRmCorporateBalance(corporate.value);
  }

  changeClient(client: any) {
    if (client.id != 'Across Clients') {
      this.selectedCorporate = client.id;

      this.getCorporateProductData(client.id);

      this.httpService
        .httpPost('dashboard/relationshipManager/private/getCorporateDetails', {
          dataMap: { id: client.id },
        })
        .subscribe((response: any) => {
          this.corporateDetails = response.data;
        });
    } else {
      this.getCorporateProductData('');
    }
  }

  getCorporateProductData(corporateId: string) {
    this.corporateProductWiseDistributionLoading = true;
    this.httpService
      .httpPost('dashboard/relationshipManager/private/getCorporateProductWiseDistribution', {
        dataMap: { corporateId },
      })
      .subscribe((response: any) => {
        const corporateProductWiseDistributionData = response.data;

        this.corporateProductWiseDistributionOptions = {
          data: corporateProductWiseDistributionData,
          formatter: (params: any) => {
            return `${corporateProductWiseDistributionData[params.itemId].label}\t\t\t${'USD'}\t${corporateProductWiseDistributionData[params.itemId].amount
              }`;
          },
          labelKey: 'label',
          angleKey: 'amount',
        };
        this.corporateProductWiseDistributionLoading = false;
      });
  }

  getRmCorporates() {
    this.httpService
      .httpPost('dashboard/relationshipManager/private/getRmCorporates', { dataMap: {} })
      .subscribe((response: any) => {
        // this.rmCorporates = response.dataList;
        // this.corporateList = [...response.dataList];
        console.log("rmdata", response.dataList);


        // this.corporateList[0] = {
        //   id: 'Across Clients', displayName: 'Across Clients'
        // };

        // this.corporateList.splice(0, 1);
      });
  }

  getRmCorporateBalance(corporate: string) {
    this.httpService
      .httpPost('dashboard/relationshipManager/private/getBalances', { dataMap: { corporate } })
      .subscribe((response: any) => {
        this.rmDetails = response.data;
      });
  }

  addNewReminder() {
    this.httpService
      .httpPost('dashboard/relationshipManager/private/addRmReminder', {
        dataMap: this.rmReminder,
      })
      .subscribe((response: any) => {
        this.resetReminderForm();
        this.getReminders();
      });
  }

  resetReminderForm() {
    this.showRmReminderModal = false;
    this.rmReminder = {
      task: '',
      date: '',
      time: '',
    };
  }

  getReminders() {
    this.httpService
      .httpPost('dashboard/relationshipManager/private/getRmReminders', {
        dataMap: {},
      })
      .subscribe((response: any) => {
        this.rmReminders = response.data;
      });
  }

  getTasks() {
    this.httpService
      .httpPost('dashboard/relationshipManager/private/getRmTasks', {
        dataMap: {},
      })
      .subscribe((response: any) => {
        this.rmTasks = response.data;
      });
  }

  ngOnDestroy() {
    const grid = [...this.overallGridData, ...this.productWiseGridData];

    this.httpService
      .httpPost('dashboard/relationshipManager/private/updateRmGrid', {
        grid,
        userDetails: this.userDetails,
      })
      .subscribe((response: any) => {
        console.log(response);
      });
  }


  gridOptions1: any = {
    pagination: false
  }

  //--------------PAYMENT SUCCESS GRID START------------------
  showSuccessfullPaymentsModal: boolean = false;
  paymentSuccessfulColDefUrl: ColDef[] = [
    { field: 'corporates' },
    { field: 'overallTransactionsCount' },
    { field: 'successfulCount' },
    { field: 'successCountPercentage' },
    { field: 'overallTransactionsAmount' },
    { field: 'successfulAmount' },
    { field: 'successAmountPercentage' }
  ]
  paymentSuccessfulDataUrl = [
    {
      corporates: 'Toyota Auto Body',
      overallTransactionsCount: '350',
      successfulCount: '250',
      successCountPercentage: '71.43',
      overallTransactionsAmount: '5,30,000.00',
      successfulAmount: '5,00,000.00',
      successAmountPercentage: '94.34'
    },
    {
      corporates: 'Toyota Mobility',
      overallTransactionsCount: '150',
      successfulCount: '150',
      successCountPercentage: '100.00',
      overallTransactionsAmount: '4,00,000.00',
      successfulAmount: '4,00,000.00',
      successAmountPercentage: '100.00',
    },
    {
      corporates: 'Toyota Motors',
      overallTransactionsCount: '120',
      successfulCount: '100',
      successCountPercentage: '83.33',
      overallTransactionsAmount: '1,30,000.00',
      successfulAmount: '1,00,000.00',
      successAmountPercentage: '76.92',
    }
  ]

  onDownloadPayments() {
    this.showSuccessfullPaymentsModal = false
  }
  onExportPayments() {
    this.showSuccessfullPaymentsModal = false
  }
  //--------------PAYMENT SUCCESS GRID END------------------


  //--------------PAYMENT FAILED GRID START------------------
  showFailedPaymentsModal: boolean = false
  paymentFailedColDefUrl: ColDef[] = [
    { field: 'corporates' },
    { field: 'overallTransactionsCount' },
    { field: 'failedCount' },
    { field: 'failedCountPercentage' },
    { field: 'overallTransactionsAmount' },
    { field: 'failedAmount' },
    { field: 'failedAmountPercentage' }
  ]
  paymentFailedDataUrl = [
    {
      corporates: 'Toyota Auto Body',
      overallTransactionsCount: '350',
      failedCount: '250',
      failedCountPercentage: '71.43',
      overallTransactionsAmount: '5,30,000.00',
      failedAmount: '5,00,000.00',
      failedAmountPercentage: '94.34'
    },
    {
      corporates: 'Toyota Mobility',
      overallTransactionsCount: '150',
      failedCount: '150',
      failedCountPercentage: '100.00',
      overallTransactionsAmount: '4,00,000.00',
      failedAmount: '4,00,000.00',
      failedAmountPercentage: '100.00',
    }
  ]
  //--------------PAYMENT FAILED GRID END------------------


  //--------------PAYMENT PENDING GRID END------------------
  showPendingPaymentsModal: boolean = false
  paymentPendingColDefUrl: ColDef[] = [
    { field: 'corporates' },
    { field: 'overallTransactionsCount' },
    { field: 'failedCount' },
    { field: 'failedCountPercentage' },
    { field: 'overallTransactionsAmount' },
    { field: 'failedAmount' },
    { field: 'failedAmountPercentage' }
  ]
  paymentPendingDataUrl = [
    {
      corporates: 'Toyota Auto Body',
      overallTransactionsCount: '350',
      failedCount: '250',
      failedCountPercentage: '71.43',
      overallTransactionsAmount: '5,30,000.00',
      failedAmount: '5,00,000.00',
      failedAmountPercentage: '94.34'
    },
    {
      corporates: 'Toyota Mobility',
      overallTransactionsCount: '150',
      failedCount: '150',
      failedCountPercentage: '100.00',
      overallTransactionsAmount: '4,00,000.00',
      failedAmount: '4,00,000.00',
      failedAmountPercentage: '100.00',
    }
  ]
  //--------------PAYMENT PENDING GRID END------------------


  //--------------TRADE ISSUED GRID START------------------
  showIssuedTradeModal: boolean = false;
  tradeIssuedColDefUrl: ColDef[] = [
    { field: 'corporates' },
    { field: 'overallTransactionsCount' },
    { field: 'LCIssued' },
    { field: 'LCIssuedCountPercentage' },
    { field: 'overallTransactionsAmount' },
    { field: 'LCIssuedAmount' },
    { field: 'LCIssuedAmountPercentage' }
  ]
  tradeIssuedDataUrl = [
    {
      corporates: 'Toyota Auto Body',
      overallTransactionsCount: '350',
      LCIssued: '250',
      LCIssuedCountPercentage: '71.43',
      overallTransactionsAmount: '5,30,000.00',
      LCIssuedAmount: '5,00,000.00',
      LCIssuedAmountPercentage: '94.34'
    },
    {
      corporates: 'Toyota Mobility',
      overallTransactionsCount: '150',
      LCIssued: '150',
      LCIssuedCountPercentage: '100.00',
      overallTransactionsAmount: '4,00,000.00',
      LCIssuedAmount: '4,00,000.00',
      LCIssuedAmountPercentage: '100.00',
    },
    {
      corporates: 'Toyota Motors',
      overallTransactionsCount: '120',
      LCIssued: '100',
      LCIssuedCountPercentage: '83.33',
      overallTransactionsAmount: '1,30,000.00',
      LCIssuedAmount: '1,00,000.00',
      LCIssuedAmountPercentage: '76.92',
    }
  ]
  onDownload() {
    this.showIssuedTradeModal = false;
  }
  onExport() {
    this.showIssuedTradeModal = false;
  }
  //--------------TRADE ISSUED GRID END------------------

  //--------------TRADE AMENDED GRID START------------------
  showAmendedTradeModal: boolean = false;
  tradeAmendedColDefUrl: ColDef[] = [
    { field: 'corporates' },
    { field: 'overallTransactionsCount' },
    { field: 'LCIssued' },
    { field: 'LCIssuedCountPercentage' },
    { field: 'overallTransactionsAmount' },
    { field: 'LCIssuedAmount' },
    { field: 'LCIssuedAmountPercentage' }
  ]
  tradeAmendedDataUrl = [
    {
      corporates: 'Toyota Auto Body',
      overallTransactionsCount: '350',
      LCIssued: '250',
      LCIssuedCountPercentage: '71.43',
      overallTransactionsAmount: '5,30,000.00',
      LCIssuedAmount: '5,00,000.00',
      LCIssuedAmountPercentage: '94.34'
    },
    {
      corporates: 'Toyota Mobility',
      overallTransactionsCount: '150',
      LCIssued: '150',
      LCIssuedCountPercentage: '100.00',
      overallTransactionsAmount: '4,00,000.00',
      LCIssuedAmount: '4,00,000.00',
      LCIssuedAmountPercentage: '100.00',
    },
    {
      corporates: 'Toyota Motors',
      overallTransactionsCount: '120',
      LCIssued: '100',
      LCIssuedCountPercentage: '83.33',
      overallTransactionsAmount: '1,30,000.00',
      LCIssuedAmount: '1,00,000.00',
      LCIssuedAmountPercentage: '76.92',
    }
  ]
  //--------------TRADE AMENDED GRID END------------------

  //--------------TRADE EXPIRED GRID START------------------
  showExpiredTradeModal: boolean = false;
  tradeExpiredColDefUrl: ColDef[] = [
    { field: 'corporates' },
    { field: 'overallTransactionsCount' },
    { field: 'LCIssued' },
    { field: 'LCIssuedCountPercentage' },
    { field: 'overallTransactionsAmount' },
    { field: 'LCIssuedAmount' },
    { field: 'LCIssuedAmountPercentage' }
  ]
  tradeExpiredDataUrl = [
    {
      corporates: 'Toyota Auto Body',
      overallTransactionsCount: '350',
      LCIssued: '250',
      LCIssuedCountPercentage: '71.43',
      overallTransactionsAmount: '5,30,000.00',
      LCIssuedAmount: '5,00,000.00',
      LCIssuedAmountPercentage: '94.34'
    },
    {
      corporates: 'Toyota Mobility',
      overallTransactionsCount: '150',
      LCIssued: '150',
      LCIssuedCountPercentage: '100.00',
      overallTransactionsAmount: '4,00,000.00',
      LCIssuedAmount: '4,00,000.00',
      LCIssuedAmountPercentage: '100.00',
    },
    {
      corporates: 'Toyota Motors',
      overallTransactionsCount: '120',
      LCIssued: '100',
      LCIssuedCountPercentage: '83.33',
      overallTransactionsAmount: '1,30,000.00',
      LCIssuedAmount: '1,00,000.00',
      LCIssuedAmountPercentage: '76.92',
    }
  ]
  //--------------TRADE EXPIRED GRID END------------------

  //--------------TRADE CANCELLED GRID START------------------
  showCancelledTradeModal: boolean = false;
  tradeCancelledColDefUrl: ColDef[] = [
    { field: 'corporates' },
    { field: 'overallTransactionsCount' },
    { field: 'LCIssued' },
    { field: 'LCIssuedCountPercentage' },
    { field: 'overallTransactionsAmount' },
    { field: 'LCIssuedAmount' },
    { field: 'LCIssuedAmountPercentage' }
  ]
  tradeCancelledDataUrl = [
    {
      corporates: 'Toyota Auto Body',
      overallTransactionsCount: '350',
      LCIssued: '250',
      LCIssuedCountPercentage: '71.43',
      overallTransactionsAmount: '5,30,000.00',
      LCIssuedAmount: '5,00,000.00',
      LCIssuedAmountPercentage: '94.34'
    },
    {
      corporates: 'Toyota Mobility',
      overallTransactionsCount: '150',
      LCIssued: '150',
      LCIssuedCountPercentage: '100.00',
      overallTransactionsAmount: '4,00,000.00',
      LCIssuedAmount: '4,00,000.00',
      LCIssuedAmountPercentage: '100.00',
    },
    {
      corporates: 'Toyota Motors',
      overallTransactionsCount: '120',
      LCIssued: '100',
      LCIssuedCountPercentage: '83.33',
      overallTransactionsAmount: '1,30,000.00',
      LCIssuedAmount: '1,00,000.00',
      LCIssuedAmountPercentage: '76.92',
    }
  ]
  //--------------TRADE CANCELLED GRID END------------------

  //--------------SETUP AUTHORIZE GRID START------------------
  showSetupAuthorizedModal: boolean = false;
  setupAuthorizedColDefUrl: ColDef[] = [
    { field: 'corporates' },
    { field: 'overallTransactionsCount' },
    { field: 'successfulCount' },
    { field: 'successCountPercentage' },
    { field: 'overallTransactionsAmount' },
    { field: 'successfulAmount' },
    { field: 'successAmountPercentage' }
  ]
  setupAuthorizedDataUrl = [
    {
      corporates: 'Toyota Auto Body',
      overallTransactionsCount: '350',
      successfulCount: '250',
      successCountPercentage: '71.43',
      overallTransactionsAmount: '5,30,000.00',
      successfulAmount: '5,00,000.00',
      successAmountPercentage: '94.34'
    },
    {
      corporates: 'Toyota Mobility',
      overallTransactionsCount: '150',
      successfulCount: '150',
      successCountPercentage: '100.00',
      overallTransactionsAmount: '4,00,000.00',
      successfulAmount: '4,00,000.00',
      successAmountPercentage: '100.00',
    }
  ]
  //--------------SETUP AUTHORIZE GRID END------------------

  //--------------SETUP PENDING GRID START------------------
  showSetupPendingModal: boolean = false;
  tradePendingColDefUrl: ColDef[] = [
    { field: 'corporates' },
    { field: 'overallTransactionsCount' },
    { field: 'successfulCount' },
    { field: 'successCountPercentage' },
    { field: 'overallTransactionsAmount' },
    { field: 'successfulAmount' },
    { field: 'successAmountPercentage' }
  ]
  tradePendingDataUrl = [
    {
      corporates: 'Toyota Auto Body',
      overallTransactionsCount: '350',
      successfulCount: '250',
      successCountPercentage: '71.43',
      overallTransactionsAmount: '5,30,000.00',
      successfulAmount: '5,00,000.00',
      successAmountPercentage: '94.34'
    },
    {
      corporates: 'Toyota Mobility',
      overallTransactionsCount: '150',
      successfulCount: '150',
      successCountPercentage: '100.00',
      overallTransactionsAmount: '4,00,000.00',
      successfulAmount: '4,00,000.00',
      successAmountPercentage: '100.00',
    }
  ]
  //--------------SETUP PENDING GRID END------------------

  //--------------SETUP REJECTED GRID START------------------
  showSetupRejectedModal: boolean = false;
  setupRejectedColDefUrl: ColDef[] = [
    { field: 'corporates' },
    { field: 'overallTransactionsCount' },
    { field: 'successfulCount' },
    { field: 'successCountPercentage' },
    { field: 'overallTransactionsAmount' },
    { field: 'successfulAmount' },
    { field: 'successAmountPercentage' }
  ]
  setupRejectedDataUrl = [
    {
      corporates: 'Toyota Auto Body',
      overallTransactionsCount: '350',
      successfulCount: '250',
      successCountPercentage: '71.43',
      overallTransactionsAmount: '5,30,000.00',
      successfulAmount: '5,00,000.00',
      successAmountPercentage: '94.34'
    },
    {
      corporates: 'Toyota Mobility',
      overallTransactionsCount: '150',
      successfulCount: '150',
      successCountPercentage: '100.00',
      overallTransactionsAmount: '4,00,000.00',
      successfulAmount: '4,00,000.00',
      successAmountPercentage: '100.00',
    }
  ]
  //--------------SETUP REJECTED GRID END------------------

  //--------------FSCM INVOICE ENTERED GRID START------------------
  showfscmInvoiceEnteredModal: boolean = false;
  fscmInvoiceEnteredColDefUrl: ColDef[] = [
    { field: 'corporates' },
    { field: 'overallTransactionsCount' },
    { field: 'successfulCount' },
    { field: 'successCountPercentage' },
    { field: 'overallTransactionsAmount' },
    { field: 'successfulAmount' },
    { field: 'successAmountPercentage' }
  ]
  fscmInvoiceEnteredDataUrl = [
    {
      corporates: 'Toyota Auto Body',
      overallTransactionsCount: '350',
      successfulCount: '250',
      successCountPercentage: '71.43',
      overallTransactionsAmount: '5,30,000.00',
      successfulAmount: '5,00,000.00',
      successAmountPercentage: '94.34'
    },
    {
      corporates: 'Toyota Mobility',
      overallTransactionsCount: '150',
      successfulCount: '150',
      successCountPercentage: '100.00',
      overallTransactionsAmount: '4,00,000.00',
      successfulAmount: '4,00,000.00',
      successAmountPercentage: '100.00',
    }
  ]
  //--------------FSCM INVOICE ENTERED GRID END------------------

  //--------------FSCM INVOICE ACCEPTED GRID START------------------
  showfscmInvoiceAcceptedModal: boolean = false;
  fscmInvoiceAcceptedColDefUrl: ColDef[] = [
    { field: 'corporates' },
    { field: 'overallTransactionsCount' },
    { field: 'successfulCount' },
    { field: 'successCountPercentage' },
    { field: 'overallTransactionsAmount' },
    { field: 'successfulAmount' },
    { field: 'successAmountPercentage' }
  ]
  fscmInvoiceAcceptedDataUrl = [
    {
      corporates: 'Toyota Auto Body',
      overallTransactionsCount: '350',
      successfulCount: '250',
      successCountPercentage: '71.43',
      overallTransactionsAmount: '5,30,000.00',
      successfulAmount: '5,00,000.00',
      successAmountPercentage: '94.34'
    },
    {
      corporates: 'Toyota Mobility',
      overallTransactionsCount: '150',
      successfulCount: '150',
      successCountPercentage: '100.00',
      overallTransactionsAmount: '4,00,000.00',
      successfulAmount: '4,00,000.00',
      successAmountPercentage: '100.00',
    }
  ]
  //--------------FSCM INVOICE ACCEPTED GRID END------------------

  //--------------FSCM INVOICE REJECTED GRID START------------------
  showfscmInvoiceRejectedModal: boolean = false;
  fscmInvoiceRejectedColDefUrl: ColDef[] = [
    { field: 'corporates' },
    { field: 'overallTransactionsCount' },
    { field: 'successfulCount' },
    { field: 'successCountPercentage' },
    { field: 'overallTransactionsAmount' },
    { field: 'successfulAmount' },
    { field: 'successAmountPercentage' }
  ]
  fscmInvoiceRejectedDataUrl = [
    {
      corporates: 'Toyota Auto Body',
      overallTransactionsCount: '350',
      successfulCount: '250',
      successCountPercentage: '71.43',
      overallTransactionsAmount: '5,30,000.00',
      successfulAmount: '5,00,000.00',
      successAmountPercentage: '94.34'
    },
    {
      corporates: 'Toyota Mobility',
      overallTransactionsCount: '150',
      successfulCount: '150',
      successCountPercentage: '100.00',
      overallTransactionsAmount: '4,00,000.00',
      successfulAmount: '4,00,000.00',
      successAmountPercentage: '100.00',
    }
  ]
  //--------------FSCM INVOICE REJECTED GRID END------------------

}
