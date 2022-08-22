import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpnSummaryComponent } from './kpn-summary.component';

describe('KpnSummaryComponent', () => {
  let component: KpnSummaryComponent;
  let fixture: ComponentFixture<KpnSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpnSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpnSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
