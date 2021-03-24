import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadsensortemplateComponent } from './downloadsensortemplate.component';

describe('DownloadsensortemplateComponent', () => {
  let component: DownloadsensortemplateComponent;
  let fixture: ComponentFixture<DownloadsensortemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadsensortemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadsensortemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
