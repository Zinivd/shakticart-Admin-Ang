import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
}

interface Transaction {
  id: number;
  order_id: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  amount: string | number;
  gateway?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

interface Order {
  id: number;
  order_id: string;
  user_id: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  address_building: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  district: string;
  state: string;
  pincode: string;
  landmark: string | null;
  address_type: string;
  payment_id: string | null;
  payment_mode: string;
  payment_status: string;
  total_amount: string | number;
  order_status: string;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  transaction?: Transaction;
}

interface StatusOption {
  value: string;   // what gets sent to the API
  label: string;   // what's shown in the dropdown
}

@Component({
  selector: 'app-view-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-order.component.html',
  styleUrl: './view-order.component.css'
})
export class ViewOrderComponent implements OnInit {
  order: Order | null = null;
  loading = false;
  errorMessage = '';

  // status update state
  selectedStatus = '';
  updatingStatus = false;
  statusUpdateSuccess = false;
  statusUpdateError = '';

  // Backend's updateOrderStatus() only special-cases the exact strings
  // 'Shipped' / 'Delivered' / 'Cancelled' (sets shipped_at/delivered_at,
  // restocks inventory on cancel). Keep these values Title-Case so those
  // side effects still fire correctly.
  statusOptions: StatusOption[] = [
    { value: 'Created', label: 'Created' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiServices: ApiServicesService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    if (!orderId) {
      this.errorMessage = 'No order specified.';
      return;
    }
    this.fetchOrder(orderId);
  }

  fetchOrder(orderId: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.apiServices.getOrderByOrderId<any>(orderId).subscribe({
      next: (res: any) => {
        if (res?.success && res?.data) {
          this.order = res.data;
          this.selectedStatus = this.normalizeStatus(this.order!.order_status);
        } else {
          this.errorMessage = res?.message || 'Order not found.';
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.errorMessage = err?.error?.message || 'Failed to load order.';
        this.loading = false;
      }
    });
  }

  // Match whatever case the backend currently stores (e.g. "CREATED") to
  // one of our Title-Case dropdown values so the select shows the right option.
  private normalizeStatus(status: string): string {
    const match = this.statusOptions.find(
      o => o.value.toLowerCase() === (status || '').toLowerCase()
    );
    return match ? match.value : status;
  }

  updateStatus(): void {
    if (!this.order || !this.selectedStatus) return;
    if (this.selectedStatus === this.normalizeStatus(this.order.order_status)) return;

    this.updatingStatus = true;
    this.statusUpdateSuccess = false;
    this.statusUpdateError = '';

    this.apiServices.updateOrderStatus<any>(this.order.order_id, this.selectedStatus).subscribe({
      next: (res: any) => {
        this.updatingStatus = false;
        if (res?.success) {
          this.statusUpdateSuccess = true;
          if (this.order) {
            this.order.order_status = this.selectedStatus;
          }
          setTimeout(() => (this.statusUpdateSuccess = false), 3000);
        } else {
          this.statusUpdateError = res?.message || 'Failed to update status.';
        }
      },
      error: (err: any) => {
        console.log(err);
        this.updatingStatus = false;
        this.statusUpdateError = err?.error?.message || 'Failed to update status.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/superadmin/orders/all']);
  }

  // ---------------- Helpers ----------------
  formatAmount(amount: string | number | undefined | null): string {
    if (amount == null) return '—';
    return '₹' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  }

  formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  paymentStatusClass(status: string | undefined): string {
    const s = (status || '').toLowerCase();
    if (s === 'success' || s === 'paid') return 'badge badge-success';
    if (s === 'pending') return 'badge badge-warning';
    if (s === 'failed') return 'badge badge-danger';
    return 'badge badge-muted';
  }

  orderStatusClass(status: string | undefined): string {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return 'badge badge-success';
    if (s === 'shipped') return 'badge badge-info';
    if (s === 'confirmed' || s === 'created' || s === 'processing' || s === 'pending') return 'badge badge-warning';
    if (s === 'cancelled') return 'badge badge-danger';
    return 'badge badge-muted';
  }

  fullAddress(order: Order): string {
    return [
      order.address_building,
      order.address_line1,
      order.address_line2,
      order.city,
      order.district,
      order.state,
      order.pincode
    ].filter(Boolean).join(', ');
  }

  get subtotal(): number {
    if (!this.order?.items) return 0;
    return this.order.items.reduce((sum, item) => sum + Number(item.total || 0), 0);
  }

  get deliveryFee(): number {
    if (!this.order) return 0;
    return Number(this.order.total_amount) - this.subtotal;
  }
}
