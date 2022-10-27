import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDisplayAnyWhereComponent } from './login-display-any-where.component';

describe('LoginDisplayAnyWhereComponent', () => {
  let component: LoginDisplayAnyWhereComponent;
  let fixture: ComponentFixture<LoginDisplayAnyWhereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginDisplayAnyWhereComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDisplayAnyWhereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
