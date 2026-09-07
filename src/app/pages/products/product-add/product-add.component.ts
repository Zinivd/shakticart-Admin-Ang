import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServicesService } from '../../../apiservice/api-services.service';
// ---------------- Interfaces ----------------
interface SubCategoryOpt {
  id: number;
  sub_category_name: string;
}
interface CategoryOpt {
  id: number;
  category_name: string;
  subcategories: SubCategoryOpt[];
}
interface ColorOpt {
  id: number;
  name: string;
  code: string;
}
interface SizeRow {
  size: string;
  sku: string;
  price: number | null;
  stock: number | null;
}
interface ColorVariant {
  color_id: number;
  name: string;
  code: string;
  images: string[];
  selectedSizes: string[];
  sizeRows: SizeRow[];
}
interface LibraryFile {
  id: number;
  name: string;
  size: string;
  url: string;
  isImage: boolean;
}
interface PendingUpload {
  name: string;
  size: string;
  preview: string | null;
  isImage: boolean;
  file: File;
}
type PickerTarget = 'main' | number; // 'main' or variant index
type PickerTab = 'select' | 'upload';
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const PRODUCT_LIST_TYPES = [
  { value: 'trending_now', label: 'Trending now' },
  { value: 'best_sellers', label: 'Best sellers' },
  { value: 'top_offers', label: 'Top offers' }
];
const MAX_TAGS = 5;
@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css'
})
export class ProductAddComponent implements OnInit {
  // ---------------- Static lists ----------------
  allSizes = ALL_SIZES;
  productListTypes = PRODUCT_LIST_TYPES;
  // ---------------- Master data ----------------
  categories: CategoryOpt[] = [];
  colors: ColorOpt[] = [];
  loadingCategories = false;
  loadingColors = false;
  // ---------------- Form fields ----------------
  name = '';
  brand = '';
  category_id: number | null = null;
  subcategory_id: number | null = null;
  actual_price: number | null = null;
  selling_price: number | null = null;
  discount_percent: number | null = null;
  description = '';
  product_list_type = 'trending_now';
  is_published = true;
  mainImages: string[] = [];
  // ---------------- Tags ----------------
  tags: string[] = [];
  tagInput = '';
  // ---------------- Variants ----------------
  variants: ColorVariant[] = [];
  submitting = false;
  formError = '';
  // ---------------- Image library / picker modal ----------------
  showPicker = false;
  pickerTarget: PickerTarget = 'main';
  pickerTab: PickerTab = 'select';
  pickerMaxSelectable = 5; // used for color gallery; main has no strict cap but we reuse this UI
  libraryFiles: LibraryFile[] = [];
  loadingLibrary = false;
  librarySearch = '';
  selectedLibraryIds: number[] = [];
  // upload tab
  dragOver = false;
  uploading = false;
  pendingFiles: PendingUpload[] = [];
  constructor(
    private apiServices: ApiServicesService,
    private toastr: ToastrService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.getAllCategories();
    this.getAllColors();
  }
  // =====================================================================
  // ========================= MASTER DATA ================================
  // =====================================================================
  getAllCategories(): void {
    this.loadingCategories = true;
    this.apiServices.getAllCategories().subscribe({
      next: (res: any) => {
        this.categories = res?.data ?? [];
        this.loadingCategories = false;
      },
      error: (err: any) => {
        console.log(err);
        this.loadingCategories = false;
      }
    });
  }
  getAllColors(): void {
    this.loadingColors = true;
    this.apiServices.getAllColors().subscribe({
      next: (res: any) => {
        this.colors = res?.data || res || [];
        this.loadingColors = false;
      },
      error: (err: any) => {
        console.log(err);
        this.loadingColors = false;
        this.toastr.error('Failed to load colors.');
      }
    });
  }
  get subcategoriesForSelectedCategory(): SubCategoryOpt[] {
    const cat = this.categories.find(c => c.id === this.category_id);
    return cat?.subcategories ?? [];
  }
  onCategoryChange(): void {
    this.subcategory_id = null;
  }
  // =====================================================================
  // ========================= PRICING =====================================
  // =====================================================================
  recalculateDiscount(): void {
    if (this.actual_price && this.selling_price && this.actual_price > 0) {
      const diff = this.actual_price - this.selling_price;
      this.discount_percent = Math.round((diff / this.actual_price) * 100);
    }
  }
  // =====================================================================
  // ========================= TAGS =========================================
  // =====================================================================
  addTag(event: Event): void {
    event.preventDefault();
    const value = this.tagInput.trim();
    if (!value) return;
    if (this.tags.length >= MAX_TAGS) {
      this.toastr.warning(`You can add up to ${MAX_TAGS} tags only.`);
      this.tagInput = '';
      return;
    }
    const exists = this.tags.some(t => t.toLowerCase() === value.toLowerCase());
    if (exists) {
      this.toastr.warning('This tag has already been added.');
      this.tagInput = '';
      return;
    }
    this.tags.push(value);
    this.tagInput = '';
  }
  removeTag(index: number): void {
    this.tags.splice(index, 1);
  }
  // =====================================================================
  // ========================= COLOR VARIANTS ==============================
  // =====================================================================
  isColorSelected(colorId: number): boolean {
    return this.variants.some(v => v.color_id === colorId);
  }
  toggleColor(color: ColorOpt): void {
    const idx = this.variants.findIndex(v => v.color_id === color.id);
    if (idx > -1) {
      this.variants.splice(idx, 1);
    } else {
      this.variants.push({
        color_id: color.id,
        name: color.name,
        code: color.code,
        images: [],
        selectedSizes: [],
        sizeRows: []
      });
    }
  }
  removeColorVariant(index: number): void {
    this.variants.splice(index, 1);
  }
  isSizeSelected(variant: ColorVariant, size: string): boolean {
    return variant.selectedSizes.includes(size);
  }
  toggleSize(variant: ColorVariant, size: string): void {
    const pos = variant.selectedSizes.indexOf(size);
    if (pos > -1) {
      // deselect -> remove size + its row
      variant.selectedSizes.splice(pos, 1);
      variant.sizeRows = variant.sizeRows.filter(r => r.size !== size);
    } else {
      variant.selectedSizes.push(size);
      variant.sizeRows.push({
        size,
        sku: this.generateSku(variant, size),
        price: this.selling_price ?? null,
        stock: 0
      });
    }
  }
  removeSizeRow(variant: ColorVariant, size: string): void {
    variant.selectedSizes = variant.selectedSizes.filter(s => s !== size);
    variant.sizeRows = variant.sizeRows.filter(r => r.size !== size);
  }
  private generateSku(variant: ColorVariant, size: string): string {
    const colorPrefix = (variant.name || 'CLR').substring(0, 3).toUpperCase();
    const catPart = this.category_id ?? 0;
    const random = Math.floor(10000 + Math.random() * 90000);
    return `${colorPrefix}-${size}-${catPart}-${random}`;
  }
  removeVariantImage(variant: ColorVariant, index: number): void {
    variant.images.splice(index, 1);
  }
  // =====================================================================
  // ========================= MAIN IMAGES =================================
  // =====================================================================
  removeMainImage(index: number): void {
    this.mainImages.splice(index, 1);
  }
  // =====================================================================
  // ==================== IMAGE PICKER MODAL (shared) ======================
  // =====================================================================
  openImagePicker(target: PickerTarget): void {
    this.pickerTarget = target;
    this.pickerTab = 'select';
    this.selectedLibraryIds = [];
    this.pendingFiles = [];
    this.librarySearch = '';
    this.showPicker = true;
    this.loadLibraryFiles();
  }
  closeImagePicker(): void {
    this.showPicker = false;
    this.selectedLibraryIds = [];
    this.pendingFiles = [];
  }
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showPicker) this.closeImagePicker();
  }
  switchPickerTab(tab: PickerTab): void {
    this.pickerTab = tab;
  }
  loadLibraryFiles(): void {
    this.loadingLibrary = true;
    this.apiServices.getimagegetAll().subscribe({
      next: (res: any) => {
        const data = res?.data || [];
        this.libraryFiles = data
          .filter((item: any) => (item.mime_type || '').startsWith('image/'))
          .map((item: any) => ({
            id: item.id,
            name: item.file_name,
            size: item.file_size,
            url: item.file_url,
            isImage: true
          }));
        this.loadingLibrary = false;
      },
      error: (err: any) => {
        console.log(err);
        this.loadingLibrary = false;
        this.toastr.error('Failed to load image library.');
      }
    });
  }
  get filteredLibraryFiles(): LibraryFile[] {
    const term = this.librarySearch.trim().toLowerCase();
    if (!term) return this.libraryFiles;
    return this.libraryFiles.filter(f => f.name.toLowerCase().includes(term));
  }
  get currentTargetMax(): number {
    return this.pickerTarget === 'main' ? 999 : this.pickerMaxSelectable;
  }
  get currentTargetExistingCount(): number {
    if (this.pickerTarget === 'main') return this.mainImages.length;
    const v = this.variants[this.pickerTarget as number];
    return v ? v.images.length : 0;
  }
  isLibrarySelected(file: LibraryFile): boolean {
    return this.selectedLibraryIds.includes(file.id);
  }
  toggleLibrarySelect(file: LibraryFile): void {
    const pos = this.selectedLibraryIds.indexOf(file.id);
    if (pos > -1) {
      this.selectedLibraryIds.splice(pos, 1);
      return;
    }
    const remainingSlots = this.currentTargetMax - this.currentTargetExistingCount;
    if (this.selectedLibraryIds.length >= remainingSlots) {
      this.toastr.warning(`You can select up to ${remainingSlots} more image(s).`);
      return;
    }
    this.selectedLibraryIds.push(file.id);
  }
  clearLibrarySelection(): void {
    this.selectedLibraryIds = [];
  }
  confirmAddFiles(): void {
    const selectedUrls = this.libraryFiles
      .filter(f => this.selectedLibraryIds.includes(f.id))
      .map(f => f.url);
    if (selectedUrls.length === 0) {
      this.toastr.warning('No files selected.');
      return;
    }
    this.applyUrlsToTarget(selectedUrls);
    this.closeImagePicker();
  }
  private applyUrlsToTarget(urls: string[]): void {
    if (this.pickerTarget === 'main') {
      this.mainImages.push(...urls);
    } else {
      const variant = this.variants[this.pickerTarget as number];
      if (variant) {
        const remaining = this.pickerMaxSelectable - variant.images.length;
        variant.images.push(...urls.slice(0, remaining));
      }
    }
  }
  // ---------------- Upload New tab ----------------
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }
  onDragLeave(): void {
    this.dragOver = false;
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    if (event.dataTransfer?.files) {
      this.processFiles(event.dataTransfer.files);
    }
  }
  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.processFiles(input.files);
    input.value = '';
  }
  processFiles(fileList: FileList): void {
    Array.from(fileList).forEach(file => {
      const isImage = file.type.startsWith('image/');
      const sizeKB = (file.size / 1024).toFixed(2) + ' KB';
      if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.pendingFiles.push({
            name: file.name,
            size: sizeKB,
            preview: e.target?.result as string,
            isImage: true,
            file
          });
        };
        reader.readAsDataURL(file);
      } else {
        this.pendingFiles.push({
          name: file.name,
          size: sizeKB,
          preview: null,
          isImage: false,
          file
        });
      }
    });
  }
  removePending(index: number): void {
    this.pendingFiles.splice(index, 1);
  }
  uploadFiles(): void {
    if (this.pendingFiles.length === 0) {
      this.toastr.warning('No files to upload.');
      return;
    }
    const formData = new FormData();
    this.pendingFiles.forEach(pf => {
      formData.append('files[]', pf.file, pf.name);
    });
    this.uploading = true;
    this.apiServices.imageUpload(formData).subscribe({
      next: (res: any) => {
        this.uploading = false;
        this.toastr.success('Uploaded successfully.');
        // API is expected to return the uploaded file records; adapt if the shape differs
        const uploaded: any[] = res?.data || [];
        const urls: string[] = uploaded.length
          ? uploaded.map(u => u.file_url)
          : [];
        if (urls.length) {
          this.applyUrlsToTarget(urls);
        }
        this.pendingFiles = [];
        this.pickerTab = 'select';
        this.loadLibraryFiles();
        this.closeImagePicker();
      },
      error: (err: any) => {
        console.log(err);
        this.uploading = false;
        this.toastr.error('Upload failed. Please try again.');
      }
    });
  }
  // =====================================================================
  // ========================= SUBMIT =======================================
  // =====================================================================
  private validateForm(): boolean {
    this.formError = '';
    if (!this.name.trim()) {
      this.formError = 'Product name is required.';
      return false;
    }
    if (!this.category_id) {
      this.formError = 'Please select a category.';
      return false;
    }
    if (!this.subcategory_id) {
      this.formError = 'Please select a subcategory.';
      return false;
    }
    if (!this.actual_price || !this.selling_price) {
      this.formError = 'Actual price and selling price are required.';
      return false;
    }
    if (this.variants.length === 0) {
      this.formError = 'Select at least one color variant.';
      return false;
    }
    for (const v of this.variants) {
      if (v.images.length === 0) {
        this.formError = `Add at least one image for "${v.name}".`;
        return false;
      }
      if (v.sizeRows.length === 0) {
        this.formError = `Select at least one size for "${v.name}".`;
        return false;
      }
      for (const row of v.sizeRows) {
        if (!row.sku.trim()) {
          this.formError = `SKU is required for ${v.name} - ${row.size}.`;
          return false;
        }
        if (row.price === null || row.price === undefined || row.price <= 0) {
          this.formError = `Price is required for ${v.name} - ${row.size}.`;
          return false;
        }
      }
    }
    return true;
  }
  private buildPayload(): any {
    return {
      name: this.name.trim(),
      brand: this.brand.trim(),
      category_id: this.category_id,
      subcategory_id: this.subcategory_id,
      actual_price: this.actual_price,
      selling_price: this.selling_price,
      discount_percent: this.discount_percent ?? 0,
      description: this.description.trim(),
      product_list_type: this.product_list_type,
      tags: this.tags,
      // images: this.mainImages,
      is_published: this.is_published,
      colors: this.variants.map(v => ({
        color_id: v.color_id,
        images: v.images,
        sizes: v.sizeRows.map(r => ({
          size: r.size,
          sku: r.sku,
          price: r.price,
          stock: r.stock ?? 0
        }))
      }))
    };
  }
  submitProduct(): void {
    if (!this.validateForm()) {
      this.toastr.error(this.formError);
      return;
    }
    const payload = this.buildPayload();
    this.submitting = true;
    this.apiServices.AddProduct(payload).subscribe({
      next: (res: any) => {
        this.submitting = false;
        this.toastr.success('Product added successfully.');
        this.router.navigate(['/superadmin/products/list']);
      },
      error: (err: any) => {
        console.log(err);
        this.submitting = false;
        this.toastr.error(err?.error?.message || 'Failed to add product.');
      }
    });
  }
  cancel(): void {
    this.router.navigate(['/superadmin/products/list']);
  }
}
