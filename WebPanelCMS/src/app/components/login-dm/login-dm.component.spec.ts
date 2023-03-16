import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDMComponent } from './login-dm.component';

describe('LoginDMComponent', () => {
  let component: LoginDMComponent;
  let fixture: ComponentFixture<LoginDMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginDMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
