import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignvideoclipsComponent } from './assignvideoclips.component';

describe('AssignvideoclipsComponent', () => {
  let component: AssignvideoclipsComponent;
  let fixture: ComponentFixture<AssignvideoclipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignvideoclipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignvideoclipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
