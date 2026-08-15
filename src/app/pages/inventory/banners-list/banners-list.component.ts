import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiServicesService } from '../../../apiservice/api-services.service';

// ---------------- Interfaces ----------------
interface CategoryRef {
  id: number;
  category_id: string;
  category_name: string;
  image: string;
}
interface Banner {
  id: number;
  name: string;
  category_id: number;
  category?: CategoryRef;
  desktop_image: string;
  mobile_image: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
interface BannersPaginatedPayload {
  current_page: number;
  data: Banner[];
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}
interface BannersResponse {
  status: string;
  data: BannersPaginatedPayload;
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
type PickerTarget = 'desktop' | 'mobile';
type PickerTab = 'select' | 'upload';

@Component({
  selector: 'app-banners-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './banners-list.component.html',
  styleUrl: './banners-list.component.css'
})
export class BannersListComponent implements OnInit {
  // ---------------- List data ----------------
  banners: Banner[] = [];
  filteredBanners: Banner[] = [];
  categories: CategoryRef[] = [];
  searchTerm = '';
  loading = false;
  loadingCategories = false;

  // pagination (client-side, over whatever the API returns)
  page = 1;
  pageSize = 10;

  // togging publish state per-row (disable button while in flight)
  togglingIds: Set<number> = new Set();

  // ---------------- Add Banner modal ----------------
  showAddModal = false;
  savingBanner = false;
  bannerFormError = '';
  newBannerName = '';
  newBannerCategoryId: number | null = null;
  newBannerIsPublished = true;
  newBannerDesktopImage: string | null = null;
  newBannerMobileImage: string | null = null;

  // ---------------- Image picker modal (shared, desktop/mobile) ----------------
  showPicker = false;
  pickerTarget: PickerTarget = 'desktop';
  pickerTab: PickerTab = 'select';
  libraryFiles: LibraryFile[] = [];
  loadingLibrary = false;
  librarySearch = '';
  selectedLibraryId: number | null = null;

  // upload tab
  dragOver = false;
  uploading = false;
  pendingFiles: PendingUpload[] = [];

  constructor(
    private apiServices: ApiServicesService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllBanners();
    this.getAllCategories();
  }

  // =====================================================================
  // ========================= DATA FETCHING ================================
  // =====================================================================
  getAllBanners(): void {
    this.loading = true;
    this.apiServices.getAllBanners<BannersResponse>().subscribe({
      next: (res: BannersResponse) => {
        // Laravel paginator: real data lives at res.data.data
        // when the table is empty, "data" is [] and from/to are null — handle both
        const payload = res?.data;
        this.banners = payload?.data ?? [];
        this.filteredBanners = [...this.banners];
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.banners = [];
        this.filteredBanners = [];
        this.loading = false;
        this.toastr.error('Failed to load banners.');
      }
    });
  }

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

  // ---------------- Search ----------------
  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredBanners = !term
      ? [...this.banners]
      : this.banners.filter(b =>
          b.name?.toLowerCase().includes(term) ||
          b.category?.category_name?.toLowerCase().includes(term)
        );
    this.page = 1;
  }

  // ---------------- Pagination ----------------
  get pagedBanners(): Banner[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredBanners.slice(start, start + this.pageSize);
  }
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredBanners.length / this.pageSize));
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
  trackByBanner(index: number, item: Banner): number {
    return item.id;
  }
  getCategoryName(banner: Banner): string {
    return banner.category?.category_name
      ?? this.categories.find(c => c.id === banner.category_id)?.category_name
      ?? '—';
  }

  // =====================================================================
  // ========================= PUBLISH TOGGLE ================================
  // =====================================================================
  isToggling(id: number): boolean {
    return this.togglingIds.has(id);
  }
  togglePublish(banner: Banner): void {
    if (this.togglingIds.has(banner.id)) return;
    this.togglingIds.add(banner.id);
    const previousState = banner.is_published;
    banner.is_published = !banner.is_published; // optimistic update
    this.apiServices.publishBanners(banner.id).subscribe({
      next: (res: any) => {
        this.togglingIds.delete(banner.id);
        this.toastr.success(
          banner.is_published ? `"${banner.name}" published.` : `"${banner.name}" unpublished.`
        );
      },
      error: (err: any) => {
        console.log(err);
        banner.is_published = previousState; // revert on failure
        this.togglingIds.delete(banner.id);
        this.toastr.error('Failed to update publish status.');
      }
    });
  }

  // =====================================================================
  // ========================= ADD BANNER MODAL ==============================
  // =====================================================================
  openAddBannerModal(): void {
    this.newBannerName = '';
    this.newBannerCategoryId = null;
    this.newBannerIsPublished = true;
    this.newBannerDesktopImage = null;
    this.newBannerMobileImage = null;
    this.bannerFormError = '';
    this.savingBanner = false;
    this.showAddModal = true;
  }
  closeAddBannerModal(): void {
    this.showAddModal = false;
  }
  removeDesktopImage(): void {
    this.newBannerDesktopImage = null;
  }
  removeMobileImage(): void {
    this.newBannerMobileImage = null;
  }
  submitAddBanner(): void {
    this.bannerFormError = '';
    if (!this.newBannerName.trim()) {
      this.bannerFormError = 'Banner name is required.';
      return;
    }
    if (!this.newBannerCategoryId) {
      this.bannerFormError = 'Please select a category.';
      return;
    }
    if (!this.newBannerDesktopImage) {
      this.bannerFormError = 'Desktop image is required.';
      return;
    }
    if (!this.newBannerMobileImage) {
      this.bannerFormError = 'Mobile image is required.';
      return;
    }
    const payload = {
      name: this.newBannerName.trim(),
      category_id: this.newBannerCategoryId,
      desktop_image: this.newBannerDesktopImage,
      mobile_image: this.newBannerMobileImage,
      is_published: this.newBannerIsPublished
    };
    this.savingBanner = true;
    this.apiServices.createbanners(payload).subscribe({
      next: (res: any) => {
        this.savingBanner = false;
        this.toastr.success('Banner created successfully.');
        this.closeAddBannerModal();
        this.getAllBanners();
      },
      error: (err: any) => {
        console.log(err);
        this.savingBanner = false;
        this.bannerFormError = err?.error?.message || 'Failed to create banner. Please try again.';
      }
    });
  }

  // =====================================================================
  // ==================== IMAGE PICKER MODAL (shared) ======================
  // =====================================================================
  openImagePicker(target: PickerTarget): void {
    this.pickerTarget = target;
    this.pickerTab = 'select';
    this.selectedLibraryId = null;
    this.pendingFiles = [];
    this.librarySearch = '';
    this.showPicker = true;
    this.loadLibraryFiles();
  }
  closeImagePicker(): void {
    this.showPicker = false;
    this.selectedLibraryId = null;
    this.pendingFiles = [];
  }
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showPicker) {
      this.closeImagePicker();
    } else if (this.showAddModal) {
      this.closeAddBannerModal();
    }
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
  isLibrarySelected(file: LibraryFile): boolean {
    return this.selectedLibraryId === file.id;
  }
  toggleLibrarySelect(file: LibraryFile): void {
    // single-select for banner images (only 1 desktop / 1 mobile image needed)
    this.selectedLibraryId = this.selectedLibraryId === file.id ? null : file.id;
  }
  clearLibrarySelection(): void {
    this.selectedLibraryId = null;
  }
  confirmAddFile(): void {
    const file = this.libraryFiles.find(f => f.id === this.selectedLibraryId);
    if (!file) {
      this.toastr.warning('No file selected.');
      return;
    }
    this.applyUrlToTarget(file.url);
    this.closeImagePicker();
  }
  private applyUrlToTarget(url: string): void {
    if (this.pickerTarget === 'desktop') {
      this.newBannerDesktopImage = url;
    } else {
      this.newBannerMobileImage = url;
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
    // Accept every file in the drop/selection, not just the first one,
    // and ADD to whatever is already pending instead of wiping it out —
    // this is what makes multi-file drop/select actually work.
    const files = Array.from(fileList);
    if (!files.length) return;

    let skippedNonImage = false;

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        skippedNonImage = true;
        return;
      }
      const sizeKB = (file.size / 1024).toFixed(2) + ' KB';
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
    });

    if (skippedNonImage) {
      this.toastr.warning('Some files were skipped because they are not images.');
    }
  }
  removePending(index: number): void {
    this.pendingFiles.splice(index, 1);
  }
  uploadFiles(): void {
    if (this.pendingFiles.length === 0) {
      this.toastr.warning('No file to upload.');
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
        const uploaded: any[] = res?.data || [];
        this.toastr.success(
          uploaded.length > 1 ? `${uploaded.length} files uploaded successfully.` : 'Uploaded successfully.'
        );
        this.pendingFiles = [];
        this.loadLibraryFiles();

        if (uploaded.length === 1) {
          // only one image — apply it straight to this desktop/mobile slot, same as before
          this.applyUrlToTarget(uploaded[0].file_url);
          this.closeImagePicker();
        } else if (uploaded.length > 1) {
          // several images uploaded — let the user pick which one goes on this slot
          this.pickerTab = 'select';
        }
      },
      error: (err: any) => {
        console.log(err);
        this.uploading = false;
        this.toastr.error('Upload failed. Please try again.');
      }
    });
  }
}