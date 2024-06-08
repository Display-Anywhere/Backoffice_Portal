import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonsearchComponent } from './commonsearch.component';

describe('CommonsearchComponent', () => {
  let component: CommonsearchComponent;
  let fixture: ComponentFixture<CommonsearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonsearchComponent]
    });
    fixture = TestBed.createComponent(CommonsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
