import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientcontentblockComponent } from './clientcontentblock.component';

describe('ClientcontentblockComponent', () => {
  let component: ClientcontentblockComponent;
  let fixture: ComponentFixture<ClientcontentblockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientcontentblockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientcontentblockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
