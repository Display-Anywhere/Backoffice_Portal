import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerIPAddressLogsComponent } from './player-ipaddress-logs.component';

describe('PlayerIPAddressLogsComponent', () => {
  let component: PlayerIPAddressLogsComponent;
  let fixture: ComponentFixture<PlayerIPAddressLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerIPAddressLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerIPAddressLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
