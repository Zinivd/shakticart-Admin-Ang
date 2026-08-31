import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReelsControlComponent } from './reels-control.component';

describe('ReelsControlComponent', () => {
  let component: ReelsControlComponent;
  let fixture: ComponentFixture<ReelsControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReelsControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReelsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
