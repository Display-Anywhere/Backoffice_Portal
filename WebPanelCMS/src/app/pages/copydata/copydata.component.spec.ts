import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopydataComponent } from './copydata.component';

describe('CopydataComponent', () => {
  let component: CopydataComponent;
  let fixture: ComponentFixture<CopydataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CopydataComponent]
    });
    fixture = TestBed.createComponent(CopydataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
