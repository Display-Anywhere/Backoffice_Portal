import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignageContentUploadComponent } from './signage-content-upload.component';

describe('SignageContentUploadComponent', () => {
  let component: SignageContentUploadComponent;
  let fixture: ComponentFixture<SignageContentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignageContentUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignageContentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
