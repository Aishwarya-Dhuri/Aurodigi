import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { StepStatus } from '../../@model/stepper.model';
import { StepperService } from '../../@services/stepper.service';

@Component({
  selector: 'app-stepper-header',
  templateUrl: './stepper-header.component.html',
  styleUrls: ['./stepper-header.component.scss'],
})
export class StepperHeaderComponent implements OnInit, OnChanges {
  @Input('parentRef') parentRef: any;
  viewPort: string = 'web';
  percentageCompletedAngle: number = 270;

  constructor(private viewPortService: ViewportService, private stepperService: StepperService) {}

  ngOnInit(): void {
    this.viewPortService.getViewport().subscribe((viewPort: string) => {
      this.viewPort = viewPort;
    });
    this.stepperService
      .getPercentageCompletedAngle()
      .subscribe((percentageCompletedAngle: number) => {
        this.percentageCompletedAngle = percentageCompletedAngle;
      });

    if (!this.parentRef) {
      console.error("Kindly pass @input('parentRef') to app-stepper-header");
      this.parentRef = { mode: 'VIEW' };
      return;
    }

    if (!this.parentRef.stepperDetails.stepperType) {
      this.parentRef.stepperDetails.stepperType = 'HORIZONTAL';
    }

    if (!this.parentRef.stepperDetails) {
      console.error('Kindly give defination for stepperDetails: Stepper');
      this.parentRef.stepperDetails = {
        currentStep: 1,
        isHideStepFooter: false,
        isSaveDraftApplicable: false,
        isSaveAsTemplateApplicable: false,
        isSecondLastStepLabelAsReview: false,
        isAuthMatrixMaster: false,
        headings: [],
        steps: [],
      };
    }

    // Optional
    if (!this.parentRef.getNoOfSubSteps) {
      //console.warn('Kindly give implementation for getNoOfSubSteps(stepNo: number): number');
      this.parentRef.getNoOfSubSteps = function (stepNo: number) {
        return 0;
      };
    }

    if (!this.parentRef.validateForm) {
      console.warn('Kindly give implementation for validateForm(stepNo: number): boolean');
      this.parentRef.validateForm = function (stepNo: number, subStepNo?: number) {
        return true;
      };
    }

    if (!this.parentRef.getSubHeading) {
      console.warn('Kindly give implementation for getSubHeading(stepNo: number): string');
      this.parentRef.getSubHeading = function (stepNo: number) {
        return 'Step' + stepNo + ' Details';
      };
    }

    if (this.parentRef.stepperDetails.stepperType == 'VERTICAL') {
      if (!this.parentRef.getStepFields) {
        console.warn(
          'Kindly give implementation for getStepFields(stepNo: number): { name: FIELD_NAME, value: FIELD_VALUE }[]',
        );
        this.parentRef.getStepFields = function (stepNo: number) {
          return []; // [{ name: 'FIELD_NAME', value: 'FIELD_VALUE' }];
        };
      }
      if (!this.parentRef.getStepCompletePercentage) {
        console.warn(
          'Kindly give implementation for getStepCompletePercentage(stepNo: number): number',
        );
        this.parentRef.getStepCompletePercentage = function (stepNo: number) {
          return 0;
        };
      }
    }

    //generating Steps start
    this.parentRef.stepperDetails.steps = [];
    this.parentRef.stepperDetails.headings.forEach((heading: string, i: number) => {
      let step: StepStatus = {
        completed: false,
        active: false,
        visited: false,
        stepStatus: 'progress',
        completePercentage: 0,
        subSteps: [],
      };
      const noOfSubStep = this.parentRef.getNoOfSubSteps(i + 1);
      if (noOfSubStep > 0) {
        let subSteps: StepStatus[] = [];
        for (let j = 0; j < noOfSubStep; j++) {
          subSteps.push({
            completed: false,
            active: false,
            visited: false,
            stepStatus: 'progress',
            completePercentage: 0,
            subSteps: [],
          });
        }
        step.subSteps = subSteps;
      }
      this.parentRef.stepperDetails.steps.push(step);
    });
    if (this.parentRef.stepperDetails.steps.length > 0) {
      // this.parentRef.stepperDetails.currentStep = 1;
      this.parentRef.stepperDetails.currentSubStep = 1;
      this.parentRef.stepperDetails.steps[0].active = true;
    }
    if (this.parentRef.stepperDetails.currentStep > 1) {
      this.parentRef.stepperDetails.steps.forEach((step: StepStatus, i: number) => {
        if (i < this.parentRef.stepperDetails.currentStep - 1) {
          step.active = false;
          step.completed = true;
          if (step.subSteps) {
            step.subSteps.forEach((step: StepStatus, i: number) => {
              step.active = false;
              step.completed = true;
            });
          }
        } else if (i == this.parentRef.stepperDetails.currentStep - 1) {
          step.active = true;
        }
      });
    }
    //generating Steps ends
  }

  ngOnChanges(changes: SimpleChanges): void {}

  getStyle(i: number) {
    let width = `calc(${100 / this.parentRef.stepperDetails.steps.length}% + 1.5rem) !important`;

    if (i === this.parentRef.stepperDetails.steps.length - 1) {
      width = `${100 / this.parentRef.stepperDetails.steps.length}% !important`;
    }

    return {
      width,
    };
  }

  onStepClicked(stepNo: number) {
    if (this.parentRef.stepperDetails.steps[stepNo - 1].completed && this.parentRef.onStepChange)
      this.parentRef.stepperDetails.steps[this.parentRef.stepperDetails.currentStep - 1].visited =
        true;
    this.parentRef.stepperDetails.currentStep = stepNo;
    this.parentRef.onStepChange(stepNo, this.parentRef.stepperDetails.currentSubStep);
  }
}
