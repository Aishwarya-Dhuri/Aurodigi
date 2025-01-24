import { DisplayGrid, GridsterConfig, GridType } from 'angular-gridster2';

export const DEFAULT_FORM_BUILDER_GRIDSTER_CONFIG: GridsterConfig = {
  gridType: GridType.Fit,
  displayGrid: DisplayGrid.OnDragAndResize,
  pushItems: true,
  swap: true,
  margin: 0,
  outerMargin: false,
  useBodyForBreakpoint: true,
  minCols: 12,
  maxCols: 12,
  maxRows: 100,
  maxItemCols: 12,
  minItemCols: 2,
  minItemRows: 1,
  defaultItemCols: 2,
  defaultItemRows: 2,
  draggable: {
    ignoreContent: true,
  },
};
