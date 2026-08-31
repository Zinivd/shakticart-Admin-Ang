import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiServicesService } from '../../../apiservice/api-services.service';

interface Product {
  id: number;
  name: string;
  brand?: string;
  selling_price?: string;
  actual_price?: string;
  colors?: { images?: string[] }[];
  images?: string[];
}

interface Reel {
  id: number;
  title: string;
  video_url: string;
  is_published: boolean;
  created_at?: string;
  product: {
    id: number;
    name: string;
    selling_price?: string;
    actual_price?: string;
    category?: { category_name?: string };
    subcategory?: { sub_category_name?: string };
  } | null;
}

@Component({
  selector: 'app-reels-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reels-control.component.html',
  styleUrl: './reels-control.component.css',
})
export class ReelsControlComponent implements OnInit {
  reels: Reel[] = [];
  products: Product[] = [];
  loading = false;
  submitting = false;

  // form state
  showModal = false;
  editingId: number | null = null;
  title = '';
  selectedProduct: Product | null = null;
  videoFile: File | null = null;
  videoPreviewUrl: string | null = null;
  isPublished = true;

  // dropdown state
  showProductDropdown = false;
  productSearch = '';

  constructor(private apiService: ApiServicesService) {}

  ngOnInit(): void {
    this.fetchReels();
    this.fetchProducts();
  }

  // ---------------- Fetch reels ----------------
  fetchReels() {
    this.loading = true;
    this.apiService.getAllReels<any>().subscribe({
      next: (res) => {
        this.reels = res?.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('fetchReels error', err);
        this.loading = false;
      },
    });
  }

  // ---------------- Fetch products for dropdown ----------------
  fetchProducts() {
    this.apiService.getAllProducts<any>().subscribe({
      next: (res) => {
        const list = res?.data?.data || res?.data || [];
        this.products = Array.isArray(list) ? list : [];
      },
      error: (err) => console.error('fetchProducts error', err),
    });
  }

  productImage(p: Product): string {
    return p.colors?.[0]?.images?.[0] || p.images?.[0] || '/placeholder.png';
  }

  get filteredProducts(): Product[] {
    const q = this.productSearch.trim().toLowerCase();
    if (!q) return this.products;
    return this.products.filter((p) => p.name?.toLowerCase().includes(q));
  }

  toggleProductDropdown() {
    this.showProductDropdown = !this.showProductDropdown;
  }

  selectProduct(p: Product) {
    this.selectedProduct = p;
    this.showProductDropdown = false;
    this.productSearch = '';
  }

  // ---------------- Modal open/close ----------------
  openCreateModal() {
    this.editingId = null;
    this.title = '';
    this.selectedProduct = null;
    this.videoFile = null;
    this.videoPreviewUrl = null;
    this.isPublished = true;
    this.showModal = true;
  }

  openEditModal(reel: Reel) {
    this.editingId = reel.id;
    this.title = reel.title;
    this.selectedProduct = reel.product
      ? ({ id: reel.product.id, name: reel.product.name } as Product)
      : null;
    this.videoFile = null;
    this.videoPreviewUrl = reel.video_url;
    this.isPublished = reel.is_published;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // ---------------- Video select ----------------
  onVideoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.videoFile = file;
    if (file) {
      this.videoPreviewUrl = URL.createObjectURL(file);
    }
  }

  // ---------------- Save (create / update) ----------------
  saveReel() {
    if (!this.title || !this.selectedProduct) {
      alert('Please enter a title and select a product.');
      return;
    }

    if (!this.editingId && !this.videoFile) {
      alert('Please select a video file.');
      return;
    }

    const formData = new FormData();

    // PRODUCT ID
    formData.append('id', String(this.selectedProduct.id));

    formData.append('title', this.title);

    if (this.videoFile) {
      formData.append('video', this.videoFile);
    }

    // CREATE
    if (!this.editingId) {
      formData.append('is_published', this.isPublished ? '1' : '0');
    }

    // UPDATE
    else {
      formData.append('reel_id', String(this.editingId));
    }

    this.submitting = true;

    const request$ = this.editingId
      ? this.apiService.updateReel<any>(formData)
      : this.apiService.createReel<any>(formData);

    request$.subscribe({
      next: (res) => {
        this.submitting = false;

        if (res?.success) {
          this.closeModal();

          this.fetchReels();
        } else {
          alert(
            typeof res?.message === 'string'
              ? res.message
              : 'Something went wrong',
          );
        }
      },

      error: (err) => {
        this.submitting = false;

        console.error('saveReel error', err);

        const message = err?.error?.message;

        if (message && typeof message === 'object') {
          const errors = Object.values(message).flat().join('\n');

          alert(errors);
        } else {
          alert(message || 'Error saving reel');
        }
      },
    });
  }

  // ---------------- Toggle publish ----------------
  togglePublish(reel: Reel) {
    const newStatus = !reel.is_published;
    this.apiService.updateReelStatus<any>(reel.id, newStatus).subscribe({
      next: (res) => {
        if (res?.success) {
          reel.is_published = newStatus;
        }
      },
      error: (err) => console.error('togglePublish error', err),
    });
  }

  // ---------------- Delete ----------------
  deleteReel(reel: Reel) {
    if (!confirm(`Delete reel "${reel.title}"?`)) return;
    this.apiService.deleteReel<any>(reel.id).subscribe({
      next: (res) => {
        if (res?.success) {
          this.reels = this.reels.filter((r) => r.id !== reel.id);
        }
      },
      error: (err) => console.error('deleteReel error', err),
    });
  }
}
