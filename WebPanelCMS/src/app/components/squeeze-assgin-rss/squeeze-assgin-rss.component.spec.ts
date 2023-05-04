import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqueezeAssginRssComponent } from './squeeze-assgin-rss.component';

describe('SqueezeAssginRssComponent', () => {
  let component: SqueezeAssginRssComponent;
  let fixture: ComponentFixture<SqueezeAssginRssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SqueezeAssginRssComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SqueezeAssginRssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
