import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockManageComponent } from './stock-manage.component';

describe('StockManageComponent', () => {
  let component: StockManageComponent;
  let fixture: ComponentFixture<StockManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
