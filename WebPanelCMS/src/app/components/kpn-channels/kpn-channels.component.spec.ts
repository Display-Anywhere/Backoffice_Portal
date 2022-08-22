import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpnChannelsComponent } from './kpn-channels.component';

describe('KpnChannelsComponent', () => {
  let component: KpnChannelsComponent;
  let fixture: ComponentFixture<KpnChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpnChannelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpnChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
