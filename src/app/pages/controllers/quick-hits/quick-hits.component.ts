import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiServicesService } from '../../../apiservice/api-services.service';

interface ProductColor {
  id: number;
  product_id: number;
  color_id: number;
  images?: string[];
  color?: {
    id: number;
    name: string;
    code: string;
  };
  inventories?: {
    id: number;
    size: string;
    sku: string;
    price: string;
    stock: number;
  }[];
}

interface Product {
  id: number;
  name?: string;
  brand?: string;
  selling_price?: string | number;
  actual_price?: string | number;
  discount_percent?: string | number;
  images?: string[];
  colors?: ProductColor[];
}

interface QuickHit {
  id: number;
  product_id: number;
  position: number;
  is_active: boolean;
  product?: Product;
}

@Component({
  selector: 'app-quick-hits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quick-hits.component.html',
  styleUrl: './quick-hits.component.css'
})
export class QuickHitsComponent implements OnInit {
  quickHits: QuickHit[] = [];
  loading = false;

  // action state
  togglingId: number | null = null;
  removingId: number | null = null;
  movingId: number | null = null;

  // add modal
  showAddModal = false;
  saving = false;
  selectedProductId: number | null = null;
  selectedProductLabel = '';

  // product searchable dropdown
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  loadingProducts = false;
  productSearchTerm = '';
  showProductDropdown = false;

  constructor(private apiServices: ApiServicesService) {}

  ngOnInit(): void {
    this.loadQuickHits();
  }

  // ---------------- Data fetching ----------------
  loadQuickHits(): void {
    this.loading = true;
    this.apiServices.getQuickHitsAdmin().subscribe({
      next: (res: any) => {
        const list: QuickHit[] = res?.data || [];
        this.quickHits = [...list].sort((a, b) => a.position - b.position);
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.quickHits = [];
        this.loading = false;
      }
    });
  }

  // ---------------- Helpers ----------------
  trackByQuickHit(index: number, item: QuickHit): number {
    return item.id;
  }

  productName(item: QuickHit): string {
    return item.product?.name || `Product #${item.product_id}`;
  }

  // ✅ Fixed: product-level images can be empty; fall back to first color's images
  productImage(product?: Product): string | null {
    if (!product) return null;
    if (product.images && product.images.length) {
      return product.images[0];
    }
    if (product.colors && product.colors.length) {
      const colorWithImage = product.colors.find(c => c.images && c.images.length);
      if (colorWithImage?.images?.length) {
        return colorWithImage.images[0];
      }
    }
    return null;
  }

  displayPrice(product?: Product): string {
    if (!product?.selling_price) return '—';
    const num = Number(product.selling_price);
    return isNaN(num) ? '—' : `₹${num}`;
  }

  statusClass(item: QuickHit): string {
    return item.is_active ? 'badge badge-success' : 'badge badge-warning';
  }

  // ---------------- Reorder (up / down) ----------------
  moveUp(index: number): void {
    if (index === 0) return;
    this.swapAndPersist(index, index - 1);
  }

  moveDown(index: number): void {
    if (index === this.quickHits.length - 1) return;
    this.swapAndPersist(index, index + 1);
  }

  private swapAndPersist(i: number, j: number): void {
    const arr = [...this.quickHits];
    [arr[i], arr[j]] = [arr[j], arr[i]];

    arr.forEach((item, idx) => (item.position = idx));
    this.quickHits = arr;

    const movedId = arr[j].product_id;
    this.movingId = movedId;

    const order = arr.map(item => ({ product_id: item.product_id, position: item.position }));
    this.apiServices.reorderQuickHits(order).subscribe({
      next: () => {
        this.movingId = null;
      },
      error: (err: any) => {
        console.log(err);
        this.movingId = null;
        this.loadQuickHits();
      }
    });
  }

  // ---------------- Toggle active ----------------
  toggleActive(item: QuickHit): void {
    const nextState = !item.is_active;
    this.togglingId = item.id;
    this.apiServices.toggleQuickHit(item.product_id, nextState).subscribe({
      next: () => {
        item.is_active = nextState;
        this.togglingId = null;
      },
      error: (err: any) => {
        console.log(err);
        this.togglingId = null;
      }
    });
  }

  // ---------------- Remove ----------------
  removeQuickHit(item: QuickHit): void {
    if (!confirm(`Remove "${this.productName(item)}" from Quick Hits?`)) return;
    this.removingId = item.id;
    this.apiServices.removeQuickHit(item.product_id).subscribe({
      next: () => {
        this.quickHits = this.quickHits.filter(q => q.id !== item.id);
        this.removingId = null;
      },
      error: (err: any) => {
        console.log(err);
        this.removingId = null;
      }
    });
  }

  // ---------------- Add modal ----------------
  openAddModal(): void {
    this.selectedProductId = null;
    this.selectedProductLabel = '';
    this.productSearchTerm = '';
    this.showAddModal = true;
    this.loadProducts();
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  submitAddQuickHit(): void {
    if (!this.selectedProductId) return;
    this.saving = true;
    this.apiServices.addQuickHit({ product_id: this.selectedProductId }).subscribe({
      next: () => {
        this.saving = false;
        this.showAddModal = false;
        this.loadQuickHits();
      },
      error: (err: any) => {
        console.log(err);
        this.saving = false;
      }
    });
  }

  // ---------------- Product dropdown ----------------
  loadProducts(): void {
    if (this.allProducts.length) return;
    this.loadingProducts = true;
    this.apiServices.getAllProducts().subscribe({
      next: (res: any) => {
        const list = res?.data?.data || res?.data || res || [];
        const already = new Set(this.quickHits.map(q => q.product_id));
        this.allProducts = (Array.isArray(list) ? list : []).filter((p: Product) => !already.has(p.id));
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
    setTimeout(() => (this.showProductDropdown = false), 150);
  }

  onProductSearch(): void {
    const term = this.productSearchTerm.trim().toLowerCase();
    this.filteredProducts = !term
      ? [...this.allProducts]
      : this.allProducts.filter(p => this.productLabel(p).toLowerCase().includes(term));
  }

  selectProduct(product: Product): void {
    this.selectedProductId = product.id;
    this.selectedProductLabel = `${this.productLabel(product)} (ID: ${product.id})`;
    this.productSearchTerm = '';
    this.filteredProducts = [...this.allProducts];
    this.showProductDropdown = false;
  }

  clearProductSelection(): void {
    this.selectedProductId = null;
    this.selectedProductLabel = '';
  }
}
