import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatePaymentPenaltyTemplateComponent } from './late-payment-penalty-template.component';

describe('LatePaymentPenaltyTemplateComponent', () => {
  let component: LatePaymentPenaltyTemplateComponent;
  let fixture: ComponentFixture<LatePaymentPenaltyTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatePaymentPenaltyTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatePaymentPenaltyTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
