import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpnchannelComponent } from './kpnchannel.component';

describe('KpnchannelComponent', () => {
  let component: KpnchannelComponent;
  let fixture: ComponentFixture<KpnchannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KpnchannelComponent]
    });
    fixture = TestBed.createComponent(KpnchannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
