export interface StepStatus {
  displayLabel?: string;
  completed?: boolean;
  stepStatus?: 'error' | 'progress' | 'success' | 'repair' | 'amend';
  completePercentage?: number;
  active?: boolean;
  visited?: boolean;
  subSteps?: StepStatus[];
}

export interface Stepper {
  masterName: string;
  stepperType?: 'HORIZONTAL' | 'VERTICAL' | 'ACCORDIAN' | 'TABS' | 'OPEN_ACCORDIAN';
  currentStep?: number;
  currentSubStep?: number;
  isOnlyFooter?: boolean;
  isHideStepFooter?: boolean;
  isSaveDraftApplicable?: boolean;
  isUpdateDraft?: boolean;
  saveAsDraftTemplateRef?: any;
  isSaveAsTemplateApplicable?: boolean;
  isUpdateTemplate?: boolean;
  saveAsTemplateRef?: any;
  isSecondLastStepLabelAsReview?: boolean;
  isAuthMatrixMaster?: boolean;
  isCancelOnRight?: boolean;
  isHideLastStep?: boolean;
  headings: string[];
  steps?: StepStatus[];
}
