import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServicesService } from '../../../apiservice/api-services.service';

interface OrderProduct {
  product_name: string;
}

interface Order {
  id: number;
  order_id: string;
  products?: OrderProduct[];
  customer_name: string;
  amount: number;
  payment_mode: string;
  payment_status: string;
  order_status: string;
  created_at?: string;
}

@Component({
  selector: 'app-all-orders-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-orders-list.component.html',
  styleUrl: './all-orders-list.component.css'
})
export class AllOrdersListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
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
    this.getAllOrders();
  }

  // ---------------- Data fetching ----------------
  getAllOrders(): void {
    this.loading = true;
    this.apiServices.getAllOrders().subscribe({
      next: (res: any) => {
        this.orders = res?.data || res || [];
        this.filteredOrders = [...this.orders];
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
    this.filteredOrders = !term
      ? [...this.orders]
      : this.orders.filter(o =>
          o.order_id?.toLowerCase().includes(term) ||
          o.customer_name?.toLowerCase().includes(term) ||
          o.payment_status?.toLowerCase().includes(term) ||
          o.order_status?.toLowerCase().includes(term) ||
          o.payment_mode?.toLowerCase().includes(term)
        );
    this.page = 1;
  }

  // ---------------- Pagination ----------------
  get pagedOrders(): Order[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredOrders.length / this.pageSize));
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
  trackByOrder(index: number, item: Order): number {
    return item.id;
  }

  productNames(order: Order): string {
    if (!order.products || order.products.length === 0) return '—';
    return order.products.map(p => p.product_name).join(', ');
  }

  formatAmount(amount: number): string {
    if (amount == null) return '—';
    return '₹' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  }

  paymentStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'paid') return 'badge badge-success';
    if (s === 'pending') return 'badge badge-warning';
    if (s === 'failed') return 'badge badge-danger';
    return 'badge badge-muted';
  }

  orderStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return 'badge badge-success';
    if (s === 'shipped') return 'badge badge-info';
    if (s === 'processing' || s === 'pending') return 'badge badge-warning';
    if (s === 'cancelled') return 'badge badge-danger';
    return 'badge badge-muted';
  }

  // ---------------- Actions ----------------
  viewOrder(order: Order): void {
    this.router.navigate(['/superadmin/orders/view', order.id]);
  }
}