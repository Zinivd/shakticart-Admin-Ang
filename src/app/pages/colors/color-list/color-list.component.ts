import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServicesService } from '../../../apiservice/api-services.service';

@Component({
  selector: 'app-color-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-list.component.html',
  styleUrl: './color-list.component.css'
})
export class ColorListComponent implements OnInit {
  colors: any[] = [];
  loading = false;
  deletingId: number | null = null;

  constructor(
    private apiServices: ApiServicesService,
    // private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllColors();
  }

  // ---------------- Data fetching ----------------
  getAllColors(): void {
    this.loading = true;
    this.apiServices.getAllColors().subscribe({
      next: (res: any) => {
        this.colors = res?.data || res || [];
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.loading = false;
        // this.toastr.error('Failed to load colors.');
      }
    });
  }

  // ---------------- Navigation ----------------
  goToAddColor(): void {
    this.router.navigate(['/superadmin/products/colors/add']);
  }

  // ---------------- Delete ----------------
  deleteColor(color: any): void {
    if (!confirm(`Are you sure you want to delete "${color.name}"?`)) {
      return;
    }
    this.deletingId = color.id;
    this.apiServices.deleteColor(color.id).subscribe({
      next: () => {
        // this.toastr.success(`Color "${color.name}" deleted successfully.`);
        this.deletingId = null;
        this.getAllColors();
      },
      error: (err: any) => {
        console.log(err);
        this.deletingId = null;
        // this.toastr.error('Failed to delete color.');
      }
    });
  }
}