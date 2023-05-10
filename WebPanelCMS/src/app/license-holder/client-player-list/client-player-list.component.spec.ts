import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPlayerListComponent } from './client-player-list.component';

describe('ClientPlayerListComponent', () => {
  let component: ClientPlayerListComponent;
  let fixture: ComponentFixture<ClientPlayerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientPlayerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
