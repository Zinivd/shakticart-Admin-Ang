import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ApiServicesService } from '../../apiservice/api-services.service';

export interface UploadedFile {
  id: number;
  name: string;
  type: string;
  size: string;
  mimeType: string;
  uploadedAt: string;
  url: string;
  isImage: boolean;
  selected: boolean;
}

interface ApiFileItem {
  id: number;
  file_name: string;
  file_size: string;
  file_url: string;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-upload-files',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.css'
})
export class UploadFilesComponent implements OnInit {
  files: UploadedFile[] = [];
  loading: boolean = false;

  // Search & Sort
  searchText: string = '';
  sortOrder: string = 'newest';

  // Bulk
  selectAll: boolean = false;

  // Dropdown
  activeDropdownId: number | null = null;

  // ── Modals (pure CSS, no bootstrap.Modal instances needed) ──
  showFileInfoModal: boolean = false;
  showUploadModal: boolean = false;
  showDeleteConfirmModal: boolean = false;

  selectedFileInfo: UploadedFile | null = null;

  // Delete confirm
  fileToDelete: UploadedFile | null = null;
  isBulkDeleteConfirm: boolean = false;

  // Upload
  dragOver: boolean = false;
  uploading: boolean = false;
  pendingFiles: {
    name: string;
    size: string;
    preview: string | null;
    isImage: boolean;
    file: File;
  }[] = [];

  constructor(
    private toastr: ToastrService,
    private eRef: ElementRef,
    private ApiService: ApiServicesService,
  ) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  // ── Load Files from API ─────────────────────────────────────
  loadFiles(): void {
    this.loading = true;
    this.ApiService.getimagegetAll().subscribe({
      next: (res: any) => {
        const data: ApiFileItem[] = res?.data || [];
        this.files = data.map((item) => this.mapApiFileToUploadedFile(item));
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.toastr.error('Failed to load files.');
        this.loading = false;
      },
    });
  }

  private mapApiFileToUploadedFile(item: ApiFileItem): UploadedFile {
    return {
      id: item.id,
      name: item.file_name,
      type: item.mime_type?.split('/')?.[1] || 'file',
      size: item.file_size,
      mimeType: item.mime_type,
      uploadedAt: item.created_at,
      url: item.file_url,
      isImage: item.mime_type?.startsWith('image/') ?? false,
      selected: false,
    };
  }

  // ── Close dropdown on outside click ─────────────────────────
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (this.activeDropdownId !== null && !target.closest('.three-dots-wrap')) {
      this.activeDropdownId = null;
    }
  }

  // ── Close any open modal on Escape ──────────────────────────
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showFileInfoModal) this.closeFileInfo();
    if (this.showUploadModal) this.closeUploadModal();
    if (this.showDeleteConfirmModal) this.closeDeleteConfirmModal();
  }

  // ── Search & Sort ────────────────────────────────────────────
  get filteredFiles(): UploadedFile[] {
    let list = [...this.files];
    if (this.searchText.trim()) {
      const term = this.searchText.toLowerCase();
      list = list.filter(
        (f) => f.name.toLowerCase().includes(term) || f.type.toLowerCase().includes(term),
      );
    }
    list.sort((a, b) =>
      this.sortOrder === 'newest'
        ? new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        : new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime(),
    );
    return list;
  }

  // ── Select All ───────────────────────────────────────────────
  toggleSelectAll(): void {
    this.files.forEach((f) => (f.selected = this.selectAll));
  }

  get selectedCount(): number {
    return this.files.filter((f) => f.selected).length;
  }

  onFileCheckChange(): void {
    this.selectAll = this.files.length > 0 && this.files.every((f) => f.selected);
  }

  // ── Bulk Delete (opens confirm modal) ───────────────────────
  bulkDelete(): void {
    if (this.selectedCount === 0) {
      this.toastr.warning('No files selected.');
      return;
    }
    this.isBulkDeleteConfirm = true;
    this.fileToDelete = null;
    this.showDeleteConfirmModal = true;
  }

  // ── Three Dot Dropdown ───────────────────────────────────────
  toggleDropdown(event: Event, fileId: number): void {
    event.stopPropagation();
    this.activeDropdownId = this.activeDropdownId === fileId ? null : fileId;
  }

  // ── File Info Modal ──────────────────────────────────────────
  openFileInfo(file: UploadedFile): void {
    this.activeDropdownId = null;
    this.selectedFileInfo = file;
    this.showFileInfoModal = true;
  }

  closeFileInfo(): void {
    this.showFileInfoModal = false;
    this.selectedFileInfo = null;
  }

  // ── Download ─────────────────────────────────────────────────
  downloadFile(file: UploadedFile): void {
    this.activeDropdownId = null;
    const a = document.createElement('a');
    a.href = file.url;
    a.target = '_blank';
    a.download = file.name;
    a.click();
    this.toastr.success(`Downloading "${file.name}".`);
  }

  // ── Copy Link ─────────────────────────────────────────────────
  copyLink(file: UploadedFile): void {
    this.activeDropdownId = null;
    navigator.clipboard.writeText(file.url).then(() => {
      this.toastr.success('Link copied to clipboard.');
    });
  }

  // ── Delete Single (opens confirm modal) ─────────────────────
  deleteFile(file: UploadedFile): void {
    this.activeDropdownId = null;
    this.isBulkDeleteConfirm = false;
    this.fileToDelete = file;
    this.showDeleteConfirmModal = true;
  }

  // ── Delete Confirm Modal ─────────────────────────────────────
  closeDeleteConfirmModal(): void {
    this.showDeleteConfirmModal = false;
    this.fileToDelete = null;
    this.isBulkDeleteConfirm = false;
  }

  confirmDelete(): void {
    if (this.isBulkDeleteConfirm) {
      const idsToDelete = this.files.filter((f) => f.selected).map((f) => f.id);
      if (idsToDelete.length === 0) {
        this.closeDeleteConfirmModal();
        return;
      }
      let completed = 0;
      idsToDelete.forEach((id) => {
        this.ApiService.imageDelete(id).subscribe({
          next: () => {
            completed++;
            this.files = this.files.filter((f) => f.id !== id);
            if (completed === idsToDelete.length) {
              this.selectAll = false;
              this.toastr.success(`${idsToDelete.length} file(s) deleted.`);
              this.closeDeleteConfirmModal();
            }
          },
          error: (err: any) => {
            console.error(err);
            this.toastr.error('Failed to delete some file(s).');
            completed++;
            if (completed === idsToDelete.length) {
              this.closeDeleteConfirmModal();
            }
          },
        });
      });
    } else if (this.fileToDelete) {
      const file = this.fileToDelete;
      this.ApiService.imageDelete(file.id).subscribe({
        next: () => {
          this.files = this.files.filter((f) => f.id !== file.id);
          this.toastr.success(`"${file.name}" deleted.`);
          this.closeDeleteConfirmModal();
        },
        error: (err: any) => {
          console.error(err);
          this.toastr.error(`Failed to delete "${file.name}".`);
          this.closeDeleteConfirmModal();
        },
      });
    }
  }

  // ── Upload Modal ──────────────────────────────────────────────
  openUploadModal(): void {
    this.pendingFiles = [];
    this.showUploadModal = true;
  }

  closeUploadModal(): void {
    this.showUploadModal = false;
    this.pendingFiles = [];
  }

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
    Array.from(fileList).forEach((file) => {
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
            file,
          });
        };
        reader.readAsDataURL(file);
      } else {
        this.pendingFiles.push({
          name: file.name,
          size: sizeKB,
          preview: null,
          isImage: false,
          file,
        });
      }
    });
  }

  removePending(index: number): void {
    this.pendingFiles.splice(index, 1);
  }

  // ── Upload Files (real API call) ─────────────────────────────
  uploadFiles(): void {
    if (this.pendingFiles.length === 0) {
      this.toastr.warning('No files to upload.');
      return;
    }
    const formData = new FormData();
    this.pendingFiles.forEach((pf) => {
      formData.append('files[]', pf.file, pf.name);
    });
    this.uploading = true;
    this.ApiService.imageUpload(formData).subscribe({
      next: (res: any) => {
        this.uploading = false;
        this.toastr.success('Uploaded Successfully');
        this.closeUploadModal();
        this.loadFiles(); // refresh list from server
      },
      error: (err: any) => {
        console.error(err);
        this.uploading = false;
        this.toastr.error('Upload failed. Please try again.');
      },
    });
  }
}