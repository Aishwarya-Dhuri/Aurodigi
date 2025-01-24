import { ComponentFixture, TestBed } from '@angular/core/testing';

import { <%=componentName%>Component } from './<%=masterNameUiFileCase%>.component';

describe('<%=componentName%>Component', () => {
  let component: <%=componentName%>Component;
  let fixture: ComponentFixture<<%=componentName%>Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ <%=componentName%>Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(<%=componentName%>Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
