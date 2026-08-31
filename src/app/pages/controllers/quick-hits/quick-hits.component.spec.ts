import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickHitsComponent } from './quick-hits.component';

describe('QuickHitsComponent', () => {
  let component: QuickHitsComponent;
  let fixture: ComponentFixture<QuickHitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickHitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickHitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
