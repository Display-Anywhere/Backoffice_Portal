import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanitizerLogsComponent } from './sanitizer-logs.component';

describe('SanitizerLogsComponent', () => {
  let component: SanitizerLogsComponent;
  let fixture: ComponentFixture<SanitizerLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SanitizerLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SanitizerLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
