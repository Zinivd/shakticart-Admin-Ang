import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiServicesService } from '../../../apiservice/api-services.service';

interface ReviewUser {
  name?: string;
  email?: string;
  unique_id?: string;
}

interface Review {
  id: number;
  review_id: string;
  product_id: number;
  user_id?: string | null;
  is_admin: boolean;
  admin_name?: string;
  admin_email?: string;
  title?: string;
  description?: string;
  rating: number;
  is_approved: boolean;
  created_at?: string;
  user?: ReviewUser;
}

interface Product {
  id: number;
  name?: string;
  brand?: string;
}

interface NewAdminReview {
  product_id: number | null;
  name: string;
  email: string;
  rating: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.css'
})
export class ProductReviewComponent implements OnInit {
  productId = '';
  productIdInput = '';

  reviews: Review[] = [];
  filteredReviews: Review[] = [];

  loading = false;
  approvingId: number | null = null;

  searchTerm = '';
  statusFilter: 'all' | 'approved' | 'pending' = 'all';

  // pagination state
  page = 1;
  pageSize = 10;

  // add review modal
  showAddModal = false;
  saving = false;
  newReview: NewAdminReview = {
    product_id: null,
    name: '',
    email: '',
    rating: 5,
    title: '',
    description: ''
  };

  // product searchable dropdown
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  loadingProducts = false;
  productSearchTerm = '';
  showProductDropdown = false;
  selectedProductLabel = '';

  constructor(
    private apiServices: ApiServicesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const routeProductId = this.route.snapshot.paramMap.get('product_id');
    if (routeProductId) {
      this.productId = routeProductId;
      this.productIdInput = routeProductId;
      this.loadReviews();
    }
  }

  // ---------------- Data fetching ----------------
  loadReviews(): void {
    if (!this.productIdInput.trim()) {
      return;
    }
    this.productId = this.productIdInput.trim();
    this.loading = true;
    const status = this.statusFilter === 'all' ? undefined : this.statusFilter;
    this.apiServices.getAdminReviews(this.productId, status).subscribe({
      next: (res: any) => {
        this.reviews = res?.data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.reviews = [];
        this.filteredReviews = [];
        this.loading = false;
      }
    });
  }

  onStatusFilterChange(): void {
    this.page = 1;
    this.loadReviews();
  }

  // ---------------- Search (client side) ----------------
  onSearch(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredReviews = !term
      ? [...this.reviews]
      : this.reviews.filter(r =>
          this.reviewerName(r).toLowerCase().includes(term) ||
          this.reviewerEmail(r).toLowerCase().includes(term) ||
          r.title?.toLowerCase().includes(term) ||
          r.description?.toLowerCase().includes(term) ||
          r.review_id?.toLowerCase().includes(term)
        );
    this.page = 1;
  }

  // ---------------- Pagination ----------------
  get pagedReviews(): Review[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredReviews.slice(start, start + this.pageSize);
  }
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredReviews.length / this.pageSize));
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
  trackByReview(index: number, item: Review): number {
    return item.id;
  }
  reviewerName(review: Review): string {
    return review.is_admin ? (review.admin_name || '—') : (review.user?.name || '—');
  }
  reviewerEmail(review: Review): string {
    return review.is_admin ? (review.admin_email || '—') : (review.user?.email || '—');
  }
  typeClass(review: Review): string {
    return review.is_admin ? 'badge badge-info' : 'badge badge-muted';
  }
  statusClass(review: Review): string {
    return review.is_approved ? 'badge badge-success' : 'badge badge-warning';
  }
  formatDate(date?: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // ---------------- Actions ----------------
  toggleApproval(review: Review): void {
    const nextState = !review.is_approved;
    this.approvingId = review.id;
    this.apiServices.approveReview(review.id, nextState).subscribe({
      next: () => {
        review.is_approved = nextState;
        this.approvingId = null;
      },
      error: (err: any) => {
        console.log(err);
        this.approvingId = null;
      }
    });
  }

  openAddModal(): void {
    this.newReview = {
      product_id: null,
      name: '',
      email: '',
      rating: 5,
      title: '',
      description: ''
    };
    this.selectedProductLabel = '';
    this.productSearchTerm = '';
    this.showAddModal = true;
    this.loadProducts();
  }
  closeAddModal(): void {
    this.showAddModal = false;
  }
  submitAdminReview(): void {
    if (!this.newReview.product_id || !this.newReview.name || !this.newReview.email) {
      return;
    }
    this.saving = true;
    this.apiServices.addAdminReview(this.newReview).subscribe({
      next: () => {
        this.saving = false;
        this.showAddModal = false;
        this.productIdInput = String(this.newReview.product_id);
        this.loadReviews();
      },
      error: (err: any) => {
        console.log(err);
        this.saving = false;
      }
    });
  }

  // ---------------- Product dropdown ----------------
  loadProducts(): void {
    if (this.allProducts.length) return; // already loaded, don't refetch every open
    this.loadingProducts = true;
    this.apiServices.getAllProducts().subscribe({
      next: (res: any) => {
        const list = res?.data?.data || res?.data || res || [];
        this.allProducts = Array.isArray(list) ? list : [];
        this.filteredProducts = [...this.allProducts];
        this.loadingProducts = false;
      },
      error: (err: any) => {
        console.log(err);
        this.allProducts = [];
        this.filteredProducts = [];
        this.loadingProducts = false;
      }
    });
  }

  productLabel(product: Product): string {
    return product.name || `Product #${product.id}`;
  }

  openProductDropdown(): void {
    this.showProductDropdown = true;
    if (!this.allProducts.length) {
      this.loadProducts();
    }
  }

  closeProductDropdownDelayed(): void {
    // delay so a click on an option registers before the dropdown closes
    setTimeout(() => (this.showProductDropdown = false), 150);
  }

  onProductSearch(): void {
    const term = this.productSearchTerm.trim().toLowerCase();
    this.filteredProducts = !term
      ? [...this.allProducts]
      : this.allProducts.filter(p =>
          this.productLabel(p).toLowerCase().includes(term)
        );
  }

  selectProduct(product: Product): void {
    this.newReview.product_id = product.id;
    this.selectedProductLabel = `${this.productLabel(product)} (ID: ${product.id})`;
    this.productSearchTerm = '';
    this.filteredProducts = [...this.allProducts];
    this.showProductDropdown = false;
  }

  clearProductSelection(): void {
    this.newReview.product_id = null;
    this.selectedProductLabel = '';
  }
}
