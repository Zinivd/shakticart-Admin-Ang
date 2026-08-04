import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServicesService } from '../../../apiservice/api-services.service';

interface Inventory {
  id: number;
  product_color_id: number;
  size: string;
  sku: string;
  price: string;
  stock: number;
}

interface ColorRef {
  id: number;
  name: string;
  code: string;
}

interface ProductColor {
  id: number;
  product_id: number;
  color_id: number;
  images: string[];
  color: ColorRef;
  inventories: Inventory[];
}

interface CategoryRef {
  id: number;
  category_id: string;
  category_name: string;
  image: string;
}

interface SubCategoryRef {
  id: number;
  sub_category_id: string;
  sub_category_name: string;
  category_id: string;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  category_id: number;
  subcategory_id: number;
  actual_price: string;
  selling_price: string;
  discount_percent: string;
  description: string;
  product_list_type: string; // 'trending_now' | 'best_sellers' | 'top_offers'
  images: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category: CategoryRef;
  subcategory: SubCategoryRef;
  colors: ProductColor[];
}

interface PaginatedPayload {
  current_page: number;
  data: Product[];
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface ProductsResponse {
  success: boolean;
  data: PaginatedPayload;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  // raw + filtered data
  products: Product[] = [];
  filteredProducts: Product[] = [];

  searchTerm = '';
  loading = false;

  // client-side pagination
  page = 1;
  pageSize = 10;

  constructor(
    private apiServices: ApiServicesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  // ---------------- Data fetching ----------------
  getAllProducts(): void {
    this.loading = true;
    this.apiServices.getAllProducts<ProductsResponse>().subscribe({
      next: (res: ProductsResponse) => {
        this.products = res?.data?.data ?? [];
        this.filteredProducts = [...this.products];
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
    this.applyFilter();
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredProducts = !term
      ? [...this.products]
      : this.products.filter(p =>
          p.name?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.category?.category_name?.toLowerCase().includes(term) ||
          p.subcategory?.sub_category_name?.toLowerCase().includes(term)
        );
    this.page = 1;
  }

  // ---------------- Pagination ----------------
  get pagedProducts(): Product[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  get pageNumbers(): (number | string)[] {
    return this.buildPageNumbers(this.page, this.totalPages);
  }

  goToPage(page: number | string): void {
    if (typeof page !== 'number') return;
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
  }

  onPageSizeChange(): void {
    this.page = 1;
  }

  // Builds a compact page list with ellipses, e.g. 1 ... 4 5 6 ... 20
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
  getThumbnail(prod: Product): string {
    if (prod.images && prod.images.length) return prod.images[0];
    const firstColorWithImage = prod.colors?.find(c => c.images?.length);
    return firstColorWithImage ? firstColorWithImage.images[0] : 'assets/images/no-image.png';
  }

  getTotalQuantity(prod: Product): number {
    if (!prod.colors?.length) return 0;
    return prod.colors.reduce((sum, c) => {
      const colorStock = c.inventories?.reduce((s, inv) => s + (inv.stock || 0), 0) ?? 0;
      return sum + colorStock;
    }, 0);
  }

  getColorNames(prod: Product): ColorRef[] {
    return prod.colors?.map(c => c.color).filter(Boolean) ?? [];
  }

  getAllSizes(prod: Product): string {
    if (!prod.colors?.length) return '—';
    const sizeSet = new Set<string>();
    prod.colors.forEach(c => c.inventories?.forEach(inv => sizeSet.add(inv.size)));
    return sizeSet.size ? Array.from(sizeSet).join(', ') : '—';
  }

  listTypeLabel(type: string): string {
    switch (type) {
      case 'trending_now': return 'Trending now';
      case 'best_sellers': return 'Best sellers';
      case 'top_offers': return 'Top offers';
      default: return type;
    }
  }

  listTypeClass(type: string): string {
    switch (type) {
      case 'trending_now': return 'tag-trending';
      case 'best_sellers': return 'tag-bestseller';
      case 'top_offers': return 'tag-offer';
      default: return 'tag-regular';
    }
  }

  publishedClass(isPublished: boolean): string {
    return isPublished ? 'status-active' : 'status-inactive';
  }

  // ---------------- Row identity / actions ----------------
  trackByProduct(index: number, item: Product): number {
    return item.id;
  }

  viewProduct(item: Product): void {
    this.router.navigate(['/superadmin/products/view', item.id]);
  }

  editProduct(item: Product): void {
    this.router.navigate(['/superadmin/products/edit', item.id]);
  }

  goToAddProduct(): void {
    this.router.navigate(['/superadmin/products/list/add']);
  }
}