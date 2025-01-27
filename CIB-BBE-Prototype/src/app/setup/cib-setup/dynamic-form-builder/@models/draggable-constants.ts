import { DraggableItem } from './dynamic-form-builder';

export const draggableItemList: DraggableItem[] = [
  {
    displayName: 'Heading',
    itemType: 'GENERIC',
    componentClassName: 'HEADING',
    value: 'Sample Heading',
    isConfigurable: true,
    icon: 'fa fa-h1',
    x: 0,
    y: 0,
    rows: 2,
    cols: 12,
    configurationFields: [
      {
        name: 'text',
        displayName: 'Heading Text',
        type: 'TEXT',
        valueFieldName: 'value',
      },
    ],
  },
  {
    displayName: 'Sub Heading',
    itemType: 'GENERIC',
    componentClassName: 'SUB_HEADING',
    value: 'Sample Sub Heading',
    isConfigurable: true,
    icon: 'fa fa-h3',
    x: 0,
    y: 0,
    rows: 2,
    cols: 12,
    configurationFields: [
      {
        name: 'text',
        displayName: 'Heading Text',
        type: 'TEXT',
        valueFieldName: 'value',
      },
    ],
  },
  {
    displayName: 'Card',
    itemType: 'CARD',
    componentClassName: 'CARD',
    isConfigurable: false,
    icon: 'fa fa-columns',
    x: 0,
    y: 0,
    rows: 6,
    cols: 6,
    minItemRows: 4,
    minItemCols: 2,
  },
  {
    displayName: 'Text Input',
    itemType: 'FIELD',
    componentClassName: 'FORM_INPUT',
    value: '',
    label: 'Sample Text Input',
    required: true,
    isShowInListing: false,
    inputType: 'normal',
    isConfigurable: true,
    icon: 'fa fa-keyboard',
    x: 0,
    y: 0,
    rows: 2,
    cols: 4,
    minItemRows: 2,
    minItemCols: 2,
    configurationFields: [
      {
        name: 'label',
        displayName: 'Label Text',
        type: 'TEXT',
        valueFieldName: 'label',
      },
      {
        name: 'inputType',
        displayName: 'Data Type',
        type: 'SELECT',
        valueFieldName: 'inputType',
        configSelectOptionList: [
          { id: 'normal', displayName: 'Normal' },
          { id: 'numeric', displayName: 'Numeric' },
          { id: 'alphaNumeric', displayName: 'Alpha Numeric' },
          { id: 'noSpaceAlphaNumeric', displayName: 'Alpha Numeric without Space' },
          { id: 'noSpace', displayName: 'No Space' },
          { id: 'currencyFormatNotZero', displayName: 'Currency Format without Zero' },
        ],
      },
      {
        name: 'required',
        displayName: 'Is Required',
        type: 'TOGGLE_SWITCH',
        valueFieldName: 'required',
      },
      {
        name: 'isShowInListing',
        displayName: 'Is Show In Listing',
        type: 'TOGGLE_SWITCH',
        valueFieldName: 'isShowInListing',
      },
    ],
  },
  {
    displayName: 'Calender Input',
    itemType: 'FIELD',
    componentClassName: 'FORM_CALENDER',
    value: '',
    label: 'Sample Calender',
    numberOfMonths: '1',
    selectionMode: 'single',
    required: true,
    isShowInListing: false,
    isConfigurable: true,
    icon: 'fa fa-calendar-alt',
    x: 0,
    y: 0,
    rows: 2,
    cols: 4,
    minItemRows: 2,
    minItemCols: 2,
    configurationFields: [
      {
        name: 'label',
        displayName: 'Label Text',
        type: 'TEXT',
        valueFieldName: 'label',
      },
      {
        name: 'numberOfMonths',
        displayName: 'Number Of Months to Show',
        type: 'SELECT',
        valueFieldName: 'numberOfMonths',
        configSelectOptionList: [
          { id: '1', displayName: '1' },
          { id: '2', displayName: '2' },
          { id: '3', displayName: '3' },
        ],
      },
      {
        name: 'selectionMode',
        displayName: 'Selection Mode',
        type: 'SELECT',
        valueFieldName: 'selectionMode',
        configSelectOptionList: [
          { id: 'single', displayName: 'Single' },
          { id: 'range', displayName: 'Range' },
        ],
      },
      {
        name: 'required',
        displayName: 'Is Required',
        type: 'TOGGLE_SWITCH',
        valueFieldName: 'required',
      },
      {
        name: 'isShowInListing',
        displayName: 'Is Show In Listing',
        type: 'TOGGLE_SWITCH',
        valueFieldName: 'isShowInListing',
      },
    ],
  },
  {
    displayName: 'Time Input',
    itemType: 'FIELD',
    componentClassName: 'FORM_TIME',
    value: '',
    label: 'Sample Time',
    required: true,
    isShowInListing: false,
    isConfigurable: true,
    icon: 'fa fa-clock',
    x: 0,
    y: 0,
    rows: 2,
    cols: 4,
    minItemRows: 2,
    minItemCols: 2,
    configurationFields: [
      {
        name: 'label',
        displayName: 'Label Text',
        type: 'TEXT',
        valueFieldName: 'label',
      },
      {
        name: 'required',
        displayName: 'Is Required',
        type: 'TOGGLE_SWITCH',
        valueFieldName: 'required',
      },
      {
        name: 'isShowInListing',
        displayName: 'Is Show In Listing',
        type: 'TOGGLE_SWITCH',
        valueFieldName: 'isShowInListing',
      },
    ],
  },
  {
    displayName: 'Dropdown Input',
    itemType: 'FIELD',
    componentClassName: 'FORM_SELECT',
    value: '',
    label: 'Sample Dropdown',
    required: true,
    isShowInListing: false,
    isConfigurable: true,
    icon: 'fa fa-list-ul',
    isApiBasedOptions: false,
    dataUrl: '',
    fieldOptionList: [
      { id: '1', displayName: 'Option 1' },
      { id: '2', displayName: 'Option 2' },
    ],
    x: 0,
    y: 0,
    rows: 4,
    cols: 4,
    minItemRows: 2,
    minItemCols: 2,
    configurationFields: [
      {
        name: 'label',
        displayName: 'Label Text',
        type: 'TEXT',
        valueFieldName: 'label',
      },
      {
        name: 'required',
        displayName: 'Is Required',
        type: 'TOGGLE_SWITCH',
        valueFieldName: 'required',
      },
      {
        name: 'isApiBasedOptions',
        displayName: 'Is Api Based Options',
        type: 'TOGGLE_SWITCH',
        valueFieldName: 'isApiBasedOptions',
      },
      {
        name: 'isShowInListing',
        displayName: 'Is Show In Listing',
        type: 'TOGGLE_SWITCH',
        valueFieldName: 'isShowInListing',
      },
      {
        name: 'dataUrl',
        displayName: 'API Url',
        type: 'TEXT',
        valueFieldName: 'dataUrl',
        basedOn: 'isApiBasedOptions',
      },
      {
        name: 'fieldOptionList',
        displayName: 'Dropdown Options',
        type: 'FIELD_OPTION',
        valueFieldName: 'fieldOptionList',
        basedOnNotEquals: 'isApiBasedOptions',
      },
    ],
  },
  {
    displayName: 'Checkbox Input',
    itemType: 'FIELD',
    componentClassName: 'FORM_CHECKBOX',
    value: '',
    label: 'Sample Checkbox',
    fieldOptionList: [
      { id: '1', displayName: 'Option 1' },
      { id: '2', displayName: 'Option 2' },
    ],
    isConfigurable: true,
    icon: 'fa fa-check-square',
    x: 0,
    y: 0,
    rows: 2,
    cols: 4,
    minItemRows: 2,
    minItemCols: 4,
    configurationFields: [
      {
        name: 'label',
        displayName: 'Label Text',
        type: 'TEXT',
        valueFieldName: 'label',
      },
      {
        name: 'required',
        displayName: 'Is Required',
        type: 'TOGGLE_SWITCH',
        valueFieldName: 'required',
      },
      {
        name: 'fieldOptionList',
        displayName: 'Checkbox details',
        type: 'FIELD_OPTION',
        valueFieldName: 'fieldOptionList',
      },
    ],
  },
  {
    displayName: 'Radio Input',
    itemType: 'FIELD',
    componentClassName: 'FORM_RADIO',
    value: '1',
    displayValue: 'Option 1',
    label: 'Sample Radio',
    fieldOptionList: [
      { id: '1', displayName: 'Option 1' },
      { id: '2', displayName: 'Option 2' },
    ],
    isConfigurable: true,
    icon: 'fa fa-dot-circle',
    x: 0,
    y: 0,
    rows: 2,
    cols: 4,
    minItemRows: 2,
    minItemCols: 4,
    configurationFields: [
      {
        name: 'label',
        displayName: 'Label Text',
        type: 'TEXT',
        valueFieldName: 'label',
      },
      {
        name: 'required',
        displayName: 'Is Required',
        type: 'TOGGLE_SWITCH',
        valueFieldName: 'required',
      },
      {
        name: 'fieldOptionList',
        displayName: 'Radio details',
        type: 'FIELD_OPTION',
        valueFieldName: 'fieldOptionList',
      },
    ],
  },
  {
    displayName: 'Toggle Switch',
    itemType: 'FIELD',
    componentClassName: 'FORM_TOGGLE_SWITCH',
    label: 'Sample Toggle Switch',
    value: false,
    displayValue: 'No',
    isConfigurable: true,
    icon: 'fa fa-toggle-on',
    x: 0,
    y: 0,
    rows: 2,
    cols: 3,
    configurationFields: [
      {
        name: '11toggleSwitch',
        displayName: 'Label Text',
        type: 'TEXT',
        valueFieldName: 'label',
      },
    ],
  },
  {
    displayName: 'Lable & Value',
    itemType: 'GENERIC',
    componentClassName: 'LABEL_VALUE',
    label: 'Sample Label',
    value: 'Sample Value',
    isConfigurable: true,
    icon: 'fa fa-eye',
    x: 0,
    y: 0,
    rows: 2,
    cols: 3,
    configurationFields: [
      {
        name: '11label',
        displayName: 'Label Text',
        type: 'TEXT',
        valueFieldName: 'label',
      },
      {
        name: '11value',
        displayName: 'Value Text',
        type: 'TEXT',
        valueFieldName: 'value',
      },
    ],
  },
  {
    displayName: 'Table/Grid',
    itemType: 'GENERIC',
    componentClassName: 'AG_GRID',
    value: '',
    isConfigurable: true,
    icon: 'fa fa-table',
    isApiBasedColDefs: false,
    isApiBasedRowDefs: false,
    colDefUrl: 'commons/searchService/private/corporateSearchColDefs',
    rowDefUrl: 'setup/corporateOnboarding/corporateMain/private/getAuthorizedList',
    isLoaded: true,
    colDefs: [
      { headerName: 'Id', field: 'id', hide: true, filter: 'agTextColumnFilter' },
      { headerName: 'Column 1', field: 'column1', sortable: true, filter: 'agTextColumnFilter' },
      { headerName: 'Column 2', field: 'column2', sortable: true, filter: 'agTextColumnFilter' },
    ],
    rowData: [
      { id: '1', column1: 'data11', column2: 'data12' },
      { id: '2', column1: 'data21', column2: 'data22' },
    ],
    pagination: true,
    paginationAutoPageSize: false,
    paginationPageSize: 10,
    enableCharts: true,
    x: 0,
    y: 0,
    rows: 6,
    cols: 12,
    minItemRows: 3,
    minItemCols: 4,
    configurationFields: [
      {
        name: 'isApiBasedColDefs',
        displayName: 'Is Api Based ColDefs',
        type: 'TOGGLE_SWITCH',
        valueFieldName: 'isApiBasedColDefs',
      },
      {
        name: 'colDefUrl',
        displayName: 'ColDef Url',
        type: 'TEXT',
        valueFieldName: 'colDefUrl',
        basedOn: 'isApiBasedColDefs',
      },
      {
        name: 'colDefs',
        displayName: 'Column Details',
        type: 'GRID_COLDEFS',
        valueFieldName: 'colDefs',
        basedOnNotEquals: 'isApiBasedColDefs',
      },
      {
        name: 'isApiBasedRowDefs',
        displayName: 'Is Api Based RowDefs',
        type: 'TOGGLE_SWITCH',
        valueFieldName: 'isApiBasedRowDefs',
      },
      {
        name: 'rowDefUrl',
        displayName: 'RowDef Url',
        type: 'TEXT',
        valueFieldName: 'rowDefUrl',
        basedOn: 'isApiBasedRowDefs',
      },
      {
        name: 'rowData',
        displayName: 'Row Data',
        type: 'GRID_ROWDATA',
        valueFieldName: 'rowData',
        basedOnNotEquals: 'isApiBasedRowDefs',
      },
      {
        name: 'pagination',
        displayName: 'Pagination',
        type: 'TOGGLE_SWITCH',
        valueFieldName: 'pagination',
      },
      {
        name: 'paginationAutoPageSize',
        displayName: 'Auto Page Size',
        type: 'TOGGLE_SWITCH',
        valueFieldName: 'paginationAutoPageSize',
      },
      {
        name: 'paginationPageSize',
        displayName: 'Records Per Page',
        type: 'SELECT',
        valueFieldName: 'paginationPageSize',
        basedOnNotEquals: 'paginationAutoPageSize',
        configSelectOptionList: [
          { id: 5, displayName: '5' },
          { id: 10, displayName: '10' },
          { id: 15, displayName: '15' },
          { id: 20, displayName: '20' },
        ],
      },
      {
        name: 'enableCharts',
        displayName: 'Runtime Charts',
        type: 'TOGGLE_SWITCH',
        valueFieldName: 'enableCharts',
      },
    ],
  },
];
