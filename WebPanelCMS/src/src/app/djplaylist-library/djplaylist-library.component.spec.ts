import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DJplaylistLibraryComponent } from './djplaylist-library.component';

describe('DJplaylistLibraryComponent', () => {
  let component: DJplaylistLibraryComponent;
  let fixture: ComponentFixture<DJplaylistLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DJplaylistLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DJplaylistLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
