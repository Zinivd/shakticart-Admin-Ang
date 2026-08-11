import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiServicesService } from '../../../apiservice/api-services.service';

declare var bootstrap: any;

// ---------------- Interfaces ----------------
interface Inventory {
  id: number;
  size: string;
  sku: string;
  price: string;
  stock: number;
}
interface ColorVariant {
  id: number;             // product_color_id — required for the stock update route
  color_id: number;
  images: string[];
  color: { id: number; name: string; code: string };
  inventories: Inventory[];
}
interface ShaktiProductApi {
  id: number;
  name: string;
  brand: string;
  is_published: boolean;
  category?: { category_name: string };
  colors: ColorVariant[];
}

// Flattened row — one per (product + color + size) combination
interface StockRow {
  productId: number;
  productColorId: number;
  inventoryId: number;
  productName: string;
  brand: string;
  categoryName: string;
  colorName: string;
  colorCode: string;
  image: string | null;
  size: string;
  sku: string;
  price: string;
  stock: number;
  isPublished: boolean;
}

type StockFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';

const LOW_STOCK_THRESHOLD = 5;

@Component({
  selector: 'app-stock-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-manage.component.html',
  styleUrl: './stock-manage.component.css'
})
export class StockManageComponent implements OnInit {
  allRows: StockRow[] = [];
  filteredRows: StockRow[] = [];

  loading = true;
  loadError = '';

  searchTerm = '';
  stockFilter: StockFilter = 'all';

  // client-side pagination (over the flattened rows)
  page = 1;
  pageSize = 10;

  // summary counters
  get totalUnits(): number {
    return this.allRows.reduce((sum, r) => sum + Number(r.stock), 0);
  }
  get outOfStockCount(): number {
    return this.allRows.filter(r => r.stock === 0).length;
  }
  get lowStockCount(): number {
    return this.allRows.filter(r => r.stock > 0 && r.stock <= LOW_STOCK_THRESHOLD).length;
  }

  // ---------------- Update Stock modal ----------------
  @ViewChild('updateStockModal') updateStockModalRef!: ElementRef;
  private updateStockModalInstance: any;
  activeRow: StockRow | null = null;
  newStockValue: number | null = null;
  savingStock = false;
  stockFormError = '';

  constructor(
    private apiServices: ApiServicesService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadAllInventory();
  }

  // =====================================================================
  // ========================= LOAD & FLATTEN ===============================
  // =====================================================================
  loadAllInventory(): void {
    this.loading = true;
    this.loadError = '';
    this.allRows = [];
    this.fetchPage(1);
  }

  private fetchPage(page: number): void {
    this.apiServices.getAllProductspage<any>(page).subscribe({
      next: (res: any) => {
        const paginator = res?.data;
        const products: ShaktiProductApi[] = paginator?.data ?? [];

        this.flattenAndAppend(products);

        const currentPage = paginator?.current_page ?? page;
        const lastPage = paginator?.last_page ?? page;

        if (currentPage < lastPage) {
          this.fetchPage(currentPage + 1);
        } else {
          this.loading = false;
          this.applyFilters();
        }
      },
      error: (err: any) => {
        console.log(err);
        this.loading = false;
        this.loadError = 'Failed to load inventory. Please try again.';
      }
    });
  }

  private flattenAndAppend(products: ShaktiProductApi[]): void {
    products.forEach(product => {
      (product.colors || []).forEach(colorVariant => {
        (colorVariant.inventories || []).forEach(inv => {
          this.allRows.push({
            productId: product.id,
            productColorId: colorVariant.id,
            inventoryId: inv.id,
            productName: product.name,
            brand: product.brand,
            categoryName: product.category?.category_name || '—',
            colorName: colorVariant.color?.name || '—',
            colorCode: colorVariant.color?.code || '#cccccc',
            image: colorVariant.images?.[0] || null,
            size: inv.size,
            sku: inv.sku,
            price: inv.price,
            stock: Number(inv.stock),
            isPublished: !!product.is_published
          });
        });
      });
    });
  }

  // =====================================================================
  // ========================= FILTER / SEARCH ==============================
  // =====================================================================
  onSearch(): void {
    this.applyFilters();
  }

  setStockFilter(filter: StockFilter): void {
    this.stockFilter = filter;
    this.applyFilters();
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredRows = this.allRows.filter(row => {
      const matchesSearch = !term ||
        row.productName.toLowerCase().includes(term) ||
        row.sku.toLowerCase().includes(term) ||
        row.brand.toLowerCase().includes(term) ||
        row.colorName.toLowerCase().includes(term);

      let matchesStock = true;
      if (this.stockFilter === 'in_stock') matchesStock = row.stock > LOW_STOCK_THRESHOLD;
      if (this.stockFilter === 'low_stock') matchesStock = row.stock > 0 && row.stock <= LOW_STOCK_THRESHOLD;
      if (this.stockFilter === 'out_of_stock') matchesStock = row.stock === 0;

      return matchesSearch && matchesStock;
    });

    this.page = 1;
  }

  stockStatus(stock: number): 'out' | 'low' | 'ok' {
    if (stock === 0) return 'out';
    if (stock <= LOW_STOCK_THRESHOLD) return 'low';
    return 'ok';
  }

  // ---------------- Pagination ----------------
  get pagedRows(): StockRow[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
  }
  get pageNumbers(): (number | string)[] {
    const delta = 1;
    const range: number[] = [];
    const withDots: (number | string)[] = [];
    let last: number | undefined;
    for (let i = 1; i <= this.totalPages; i++) {
      if (i === 1 || i === this.totalPages || (i >= this.page - delta && i <= this.page + delta)) {
        range.push(i);
      }
    }
    for (const i of range) {
      if (last !== undefined) {
        if (i - last === 2) withDots.push(last + 1);
        else if (i - last !== 1) withDots.push('...');
      }
      withDots.push(i);
      last = i;
    }
    return withDots;
  }
  goToPage(p: number | string): void {
    if (typeof p !== 'number') return;
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
  }
  onPageSizeChange(): void {
    this.page = 1;
  }

  trackByRow(index: number, row: StockRow): string {
    return `${row.inventoryId}`;
  }

  // =====================================================================
  // ========================= UPDATE STOCK MODAL ============================
  // =====================================================================
  openUpdateStockModal(row: StockRow): void {
    this.activeRow = row;
    this.newStockValue = row.stock;
    this.stockFormError = '';
    this.savingStock = false;

    if (!this.updateStockModalInstance) {
      this.updateStockModalInstance = new bootstrap.Modal(this.updateStockModalRef.nativeElement);
    }
    this.updateStockModalInstance.show();
  }

  adjustStock(delta: number): void {
    const current = this.newStockValue ?? 0;
    const next = current + delta;
    if (next < 0) return;
    this.newStockValue = next;
  }

  submitUpdateStock(): void {
    this.stockFormError = '';

    if (this.newStockValue === null || this.newStockValue === undefined || this.newStockValue < 0) {
      this.stockFormError = 'Enter a valid stock quantity (0 or more).';
      return;
    }
    if (!this.activeRow) return;

    const row = this.activeRow;
    this.savingStock = true;

    this.apiServices.updateStock(
      row.productId,
      row.productColorId,
      row.inventoryId,
      { stock: this.newStockValue }
    ).subscribe({
      next: (res: any) => {
        this.savingStock = false;

        // update in place — both source list and filtered view
        row.stock = this.newStockValue as number;
        const srcRow = this.allRows.find(r => r.inventoryId === row.inventoryId);
        if (srcRow) srcRow.stock = row.stock;

        this.toastr.success('Stock updated successfully.');
        this.updateStockModalInstance?.hide();
      },
      error: (err: any) => {
        console.log(err);
        this.savingStock = false;
        this.stockFormError = err?.error?.message || 'Failed to update stock. Please try again.';
      }
    });
  }
}