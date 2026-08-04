import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServicesService } from '../../../apiservice/api-services.service';

interface Customer {
  id: number;
  unique_id: string;
  name: string;
  email: string;
  phone: string;
  user_type: string;
  last_login_at?: string;
  created_at?: string;
}

@Component({
  selector: 'app-all-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-customers.component.html',
  styleUrl: './all-customers.component.css'
})
export class AllCustomersComponent implements OnInit {
  email = localStorage.getItem('email');

  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  loading = false;
  deletingId: number | null = null;
  searchTerm = '';

  // pagination state
  page = 1;
  pageSize = 10;

  constructor(
    private apiServices: ApiServicesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllCustomers(this.email);
  }

  // ---------------- Data fetching ----------------
  getAllCustomers(data: any): void {
    this.loading = true;
    this.apiServices.getAllCustomers(data).subscribe({
      next: (res: any) => {
        this.customers = res?.data || res || [];
        this.filteredCustomers = [...this.customers];
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.loading = false;
      }
    });
  }

  // ---------------- Search ----------------
  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredCustomers = !term
      ? [...this.customers]
      : this.customers.filter(c =>
          c.unique_id?.toLowerCase().includes(term) ||
          c.name?.toLowerCase().includes(term) ||
          c.phone?.toLowerCase().includes(term) ||
          c.email?.toLowerCase().includes(term) ||
          c.user_type?.toLowerCase().includes(term)
        );
    this.page = 1;
  }

  // ---------------- Pagination ----------------
  get pagedCustomers(): Customer[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredCustomers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredCustomers.length / this.pageSize));
  }

  get pageNumbers(): (number | string)[] {
    return this.buildPageNumbers(this.page, this.totalPages);
  }

  goToPage(p: number | string): void {
    if (typeof p !== 'number') return;
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
  }

  onPageSizeChange(): void {
    this.page = 1;
  }

  private buildPageNumbers(current: number, total: number): (number | string)[] {
    const delta = 1;
    const range: number[] = [];
    const withDots: (number | string)[] = [];
    let last: number | undefined;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }
    for (const i of range) {
      if (last !== undefined) {
        if (i - last === 2) {
          withDots.push(last + 1);
        } else if (i - last !== 1) {
          withDots.push('...');
        }
      }
      withDots.push(i);
      last = i;
    }
    return withDots;
  }

  // ---------------- Helpers ----------------
  trackByCustomer(index: number, item: Customer): number {
    return item.id;
  }

  formatPhone(phone: string): string {
    if (!phone) return '—';
    return phone.startsWith('+') ? phone : `+91 ${phone}`;
  }

  typeClass(type: string): string {
    const t = (type || '').toLowerCase();
    if (t === 'customer') return 'badge badge-info';
    if (t === 'admin') return 'badge badge-success';
    return 'badge badge-muted';
  }

  // ---------------- Actions ----------------
  viewCustomer(customer: Customer): void {
    this.router.navigate(['/superadmin/customers/view', customer.id]);
  }

  deleteCustomer(customer: Customer): void {
    if (!confirm(`Are you sure you want to delete "${customer.name}"?`)) {
      return;
    }
    this.deletingId = customer.id;
    // this.apiServices.deleteCustomer(customer.id).subscribe({
    //   next: () => {
    //     this.deletingId = null;
    //     this.getAllCustomers(this.email);
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //     this.deletingId = null;
    //   }
    // });
  }
}