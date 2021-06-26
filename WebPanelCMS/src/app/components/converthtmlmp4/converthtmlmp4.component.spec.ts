import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Converthtmlmp4Component } from './converthtmlmp4.component';

describe('Converthtmlmp4Component', () => {
  let component: Converthtmlmp4Component;
  let fixture: ComponentFixture<Converthtmlmp4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Converthtmlmp4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Converthtmlmp4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
