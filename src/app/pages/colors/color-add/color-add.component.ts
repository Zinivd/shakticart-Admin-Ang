import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServicesService } from '../../../apiservice/api-services.service';

interface ColorRow {
  name: string;
  code: string;
}

@Component({
  selector: 'app-color-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './color-add.component.html',
  styleUrl: './color-add.component.css'
})
export class ColorAddComponent {
  colorRows: ColorRow[] = [{ name: '', code: '' }];
  isSaving = false;

  constructor(
    private apiService: ApiServicesService,
    // private toastr: ToastrService,
    private router: Router
  ) { }

  // -------------------- ROW MANAGEMENT --------------------
  addColorRow(): void {
    this.colorRows.push({ name: '', code: '' });
  }

  removeColorRow(index: number): void {
    if (this.colorRows.length === 1) return;
    this.colorRows.splice(index, 1);
  }

  // -------------------- NAVIGATION --------------------
  goBack(): void {
    this.router.navigate(['/superadmin/products/colors']);
  }

  // -------------------- SAVE (ADD ONLY) --------------------
  saveColor(): void {
    const validRows = this.colorRows
      .map((r) => ({ name: r.name.trim(), code: r.code.trim() }))
      .filter((r) => r.name && r.code);

    if (validRows.length === 0) {
      // this.toastr.warning('Please add at least one color with name and code.');
      return;
    }

    const payload = { colors: validRows };
    this.isSaving = true;

    this.apiService.addColor(payload).subscribe({
      next: () => {
        this.isSaving = false;
        // this.toastr.success(
        //   validRows.length > 1
        //     ? 'Colors added successfully.'
        //     : `Color "${validRows[0].name}" added successfully.`
        // );
        this.router.navigate(['/superadmin/products/colors']);
      },
      error: (err: any) => {
        this.isSaving = false;
        // this.toastr.error('Failed to add color(s).');
        console.error(err);
      },
    });
  }
}