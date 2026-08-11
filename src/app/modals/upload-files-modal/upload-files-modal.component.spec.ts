import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFilesModalComponent } from './upload-files-modal.component';

describe('UploadFilesModalComponent', () => {
  let component: UploadFilesModalComponent;
  let fixture: ComponentFixture<UploadFilesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadFilesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadFilesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
