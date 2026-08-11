import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServicesService } from '../../../apiservice/api-services.service';

interface Color {
  id: number;
  code: string;
  name: string;
}

interface Inventory {
  id: number;
  size: string;
  sku: string;
  price: string;
  stock: number;
}

interface ProductColor {
  id: number;
  color_id: number;
  images: string[];
  color: Color;
  inventories: Inventory[];
}

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent implements OnInit {
  productId: any;
  product: any = null;

  loading = true;
  errorMsg = '';

  selectedColor: ProductColor | null = null;
  selectedImage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiServices: ApiServicesService,
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.productviewbyID(this.productId);
  }

  productviewbyID(data: any): void {
    this.loading = true;
    this.errorMsg = '';
    this.apiServices.getAllProductsbyid(data).subscribe({
      next: (res: any) => {
        if (res?.success && res?.data) {
          this.product = res.data;
          if (this.product.colors?.length) {
            this.selectColor(this.product.colors[0]);
          }
        } else {
          this.errorMsg = 'Product not found.';
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.errorMsg = 'Failed to load product details. Please try again.';
        this.loading = false;
      }
    });
  }

  selectColor(color: ProductColor): void {
    this.selectedColor = color;
    this.selectedImage = color.images?.[0] || '';
  }

  selectImage(img: string): void {
    this.selectedImage = img;
  }

  get discountPercent(): number {
    return this.product ? Math.round(parseFloat(this.product.discount_percent)) : 0;
  }

  get savedAmount(): string {
    if (!this.product) return '0';
    const saved = parseFloat(this.product.actual_price) - parseFloat(this.product.selling_price);
    return saved.toFixed(0);
  }

  get totalStock(): number {
    if (!this.product?.colors?.length) return 0;
    return this.product.colors.reduce((sum: number, c: ProductColor) => {
      return sum + c.inventories.reduce((s, inv) => s + Number(inv.stock), 0);
    }, 0);
  }

  stockClass(stock: number): string {
    if (stock === 0) return 'stock-out';
    if (stock <= 3) return 'stock-low';
    return 'stock-ok';
  }

  // ---- Admin actions ----
  editProduct(): void {
    this.router.navigate(['/superadmin/products/list/update-product/', this.product.id]);
    // adjust route to match your actual edit route
  }

  togglePublish(): void {
    const newStatus = !this.product.is_published;
    // this.apiServices.updateProductStatus(this.product.id, newStatus).subscribe({
    //   next: () => this.product.is_published = newStatus,
    //   error: (err: any) => console.log(err)
    // });
    this.product.is_published = newStatus; // optimistic update, remove once API wired
  }

  deleteProduct(): void {
    if (!confirm('Are you sure you want to delete this product?')) return;
    // this.apiServices.deleteProduct(this.product.id).subscribe({
    //   next: () => this.router.navigate(['/admin/products']),
    //   error: (err: any) => console.log(err)
    // });
    console.log('Delete product:', this.product.id);
  }

  goBack(): void {
    this.router.navigate(['/superadmin/products/list']);
  }
}