import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqueezeRssComponent } from './squeeze-rss.component';

describe('SqueezeRssComponent', () => {
  let component: SqueezeRssComponent;
  let fixture: ComponentFixture<SqueezeRssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SqueezeRssComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SqueezeRssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
