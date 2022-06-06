import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSbitComponent } from './login-sbit.component';

describe('LoginSbitComponent', () => {
  let component: LoginSbitComponent;
  let fixture: ComponentFixture<LoginSbitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSbitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSbitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
