import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaLibraryWithTabComponent } from './media-library-with-tab.component';

describe('MediaLibraryWithTabComponent', () => {
  let component: MediaLibraryWithTabComponent;
  let fixture: ComponentFixture<MediaLibraryWithTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaLibraryWithTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaLibraryWithTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
