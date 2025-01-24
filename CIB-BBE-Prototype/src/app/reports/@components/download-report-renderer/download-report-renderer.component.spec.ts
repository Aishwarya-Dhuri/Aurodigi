import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadReportRendererComponent } from './download-report-renderer.component';

describe('DownloadReportRendererComponent', () => {
  let component: DownloadReportRendererComponent;
  let fixture: ComponentFixture<DownloadReportRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadReportRendererComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadReportRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
