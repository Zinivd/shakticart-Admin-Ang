import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServicesService } from '../../../apiservice/api-services.service';

interface OrderItem {
  id: number;
  order_id: string;
  shakti_product_id: number;
  product_color_id: number;
  inventory_id: number;
  color_id: number;
  product_name: string;
  brand: string;
  color_name: string;
  sku: string;
  image: string;
  quantity: number;
  size: string;
  price: string | number;
  total: string | number;
  created_at?: string;
  updated_at?: string;
}

interface Transaction {
  id: number;
  order_id: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string | null;
  status: string;
  amount: string | number;
}

interface Order {
  id: number;
  order_id: string;
  user_id: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  items?: OrderItem[];
  transaction?: Transaction;
  payment_mode: string;
  payment_status: string;
  order_status: string;
  total_amount: string | number;
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
          o.user_name?.toLowerCase().includes(term) ||
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
    if (!order.items || order.items.length === 0) return '—';
    return order.items.map(i => i.product_name).join(', ');
  }

  formatAmount(amount: string | number): string {
    if (amount == null) return '—';
    return '₹' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  }

  paymentStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'success' || s === 'paid') return 'badge badge-success';
    if (s === 'pending') return 'badge badge-warning';
    if (s === 'failed') return 'badge badge-danger';
    return 'badge badge-muted';
  }

  orderStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return 'badge badge-success';
    if (s === 'shipped') return 'badge badge-info';
    if (s === 'confirmed' || s === 'created' || s === 'processing' || s === 'pending') return 'badge badge-warning';
    if (s === 'cancelled') return 'badge badge-danger';
    return 'badge badge-muted';
  }

  // ---------------- Actions ----------------
  viewOrder(order: Order): void {
    // ✅ navigate with order_id (string, e.g. ORD1786759598763) — the backend
    // looks orders up by order_id, not the numeric primary key
    this.router.navigate(['/superadmin/orders/view', order.order_id]);
  }
}
