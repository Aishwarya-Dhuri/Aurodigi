import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilityModalComponent } from './accessibility-modal.component';

describe('AccessibilityModalComponent', () => {
  let component: AccessibilityModalComponent;
  let fixture: ComponentFixture<AccessibilityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccessibilityModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibilityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
