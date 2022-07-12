import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeSSOComponent } from './authorize-sso.component';

describe('AuthorizeSSOComponent', () => {
  let component: AuthorizeSSOComponent;
  let fixture: ComponentFixture<AuthorizeSSOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizeSSOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizeSSOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
