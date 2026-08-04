import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiServicesService } from '../../../apiservice/api-services.service';

declare var bootstrap: any;

interface SubCategory {
  id: number;
  sub_category_id: string;
  sub_category_name: string;
  category_id: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  category_id: string;
  category_name: string;
  image: string;
  created_at: string;
  updated_at: string;
  subcategories: SubCategory[];
}

type TabKey = 'category' | 'subcategory';

// row model for the dynamic subcategory-name inputs in the modal
interface SubCategoryRow {
  sub_category_name: string;
}

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  activeTab: TabKey = 'category';

  // raw data
  categories: Category[] = [];
  subCategories: SubCategory[] = [];

  // filtered (search applied) data
  filteredCategories: Category[] = [];
  filteredSubCategories: SubCategory[] = [];

  searchTerm = '';
  loading = false;

  // pagination state — category
  categoryPage = 1;
  categoryPageSize = 10;

  // pagination state — subcategory
  subCategoryPage = 1;
  subCategoryPageSize = 10;

  // ---------------- Add Category modal state ----------------
  @ViewChild('addCategoryModal') addCategoryModalRef!: ElementRef;
  newCategoryName = '';
  newCategoryImageFile: File | null = null;
  newCategoryImagePreview: string | null = null;
  savingCategory = false;
  categoryFormError = '';
  private addCategoryModalInstance: any;

  // ---------------- Add Subcategory modal state ----------------
  @ViewChild('addSubCategoryModal') addSubCategoryModalRef!: ElementRef;
  selectedCategoryId = '';
  subCategoryRows: SubCategoryRow[] = [{ sub_category_name: '' }];
  savingSubCategory = false;
  subCategoryFormError = '';
  private addSubCategoryModalInstance: any;

  constructor(private apiServices: ApiServicesService) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllSubCategories();
  }

  // ---------------- Data fetching ----------------
  getAllCategories(): void {
    this.loading = true;
    this.apiServices.getAllCategories().subscribe({
      next: (res: any) => {
        this.categories = res?.data ?? [];
        this.filteredCategories = [...this.categories];
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.loading = false;
      }
    });
  }

  getAllSubCategories(): void {
    this.apiServices.getAllSubCategories().subscribe({
      next: (res: any) => {
        this.subCategories = res?.data ?? [];
        this.filteredSubCategories = [...this.subCategories];
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  // ---------------- Tabs ----------------
  switchTab(tab: TabKey): void {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.searchTerm = '';
    this.applyFilter();
  }

  // ---------------- Search ----------------
  onSearch(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (this.activeTab === 'category') {
      this.filteredCategories = !term
        ? [...this.categories]
        : this.categories.filter(c =>
            c.category_name.toLowerCase().includes(term) ||
            c.category_id.toLowerCase().includes(term)
          );
      this.categoryPage = 1;
    } else {
      this.filteredSubCategories = !term
        ? [...this.subCategories]
        : this.subCategories.filter(s =>
            s.sub_category_name.toLowerCase().includes(term) ||
            s.sub_category_id.toLowerCase().includes(term) ||
            this.getCategoryName(s.category_id).toLowerCase().includes(term)
          );
      this.subCategoryPage = 1;
    }
  }

  getCategoryName(categoryId: string): string {
    const match = this.categories.find(c => c.category_id === categoryId);
    return match ? match.category_name : '—';
  }

  // ---------------- Category pagination ----------------
  get pagedCategories(): Category[] {
    const start = (this.categoryPage - 1) * this.categoryPageSize;
    return this.filteredCategories.slice(start, start + this.categoryPageSize);
  }
  get categoryTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredCategories.length / this.categoryPageSize));
  }
  get categoryPageNumbers(): (number | string)[] {
    return this.buildPageNumbers(this.categoryPage, this.categoryTotalPages);
  }
  goToCategoryPage(page: number | string): void {
    if (typeof page !== 'number') return;
    if (page < 1 || page > this.categoryTotalPages) return;
    this.categoryPage = page;
  }
  onCategoryPageSizeChange(): void {
    this.categoryPage = 1;
  }

  // ---------------- Subcategory pagination ----------------
  get pagedSubCategories(): SubCategory[] {
    const start = (this.subCategoryPage - 1) * this.subCategoryPageSize;
    return this.filteredSubCategories.slice(start, start + this.subCategoryPageSize);
  }
  get subCategoryTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredSubCategories.length / this.subCategoryPageSize));
  }
  get subCategoryPageNumbers(): (number | string)[] {
    return this.buildPageNumbers(this.subCategoryPage, this.subCategoryTotalPages);
  }
  goToSubCategoryPage(page: number | string): void {
    if (typeof page !== 'number') return;
    if (page < 1 || page > this.subCategoryTotalPages) return;
    this.subCategoryPage = page;
  }
  onSubCategoryPageSizeChange(): void {
    this.subCategoryPage = 1;
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

  // ---------------- Row identity / actions ----------------
  trackByCategory(index: number, item: Category): number {
    return item.id;
  }
  trackBySubCategory(index: number, item: SubCategory): number {
    return item.id;
  }
  editCategory(item: Category): void {
    console.log('Edit category', item);
  }
  deleteCategory(item: Category): void {
    console.log('Delete category', item);
  }
  editSubCategory(item: SubCategory): void {
    console.log('Edit subcategory', item);
  }
  deleteSubCategory(item: SubCategory): void {
    console.log('Delete subcategory', item);
  }

  // =====================================================================
  // ============== ADD CATEGORY MODAL (formdata: name + image) ==========
  // =====================================================================

  openAddCategoryModal(): void {
    this.newCategoryName = '';
    this.newCategoryImageFile = null;
    this.newCategoryImagePreview = null;
    this.categoryFormError = '';
    this.savingCategory = false;

    if (!this.addCategoryModalInstance) {
      this.addCategoryModalInstance = new bootstrap.Modal(this.addCategoryModalRef.nativeElement);
    }
    this.addCategoryModalInstance.show();
  }

  onCategoryImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    if (!file) return;

    this.newCategoryImageFile = file;

    // preview
    const reader = new FileReader();
    reader.onload = () => {
      this.newCategoryImagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeCategoryImage(): void {
    this.newCategoryImageFile = null;
    this.newCategoryImagePreview = null;
  }

  submitAddCategory(): void {
    this.categoryFormError = '';

    if (!this.newCategoryName.trim()) {
      this.categoryFormError = 'Category name is required.';
      return;
    }
    if (!this.newCategoryImageFile) {
      this.categoryFormError = 'Category image is required.';
      return;
    }

    const formData = new FormData();
    formData.append('category_name', this.newCategoryName.trim());
    formData.append('image', this.newCategoryImageFile);

    this.savingCategory = true;
    this.apiServices.addcategory(formData).subscribe({
      next: (res: any) => {
        this.savingCategory = false;
        this.addCategoryModalInstance?.hide();
        this.getAllCategories();
      },
      error: (err: any) => {
        console.log(err);
        this.savingCategory = false;
        this.categoryFormError = err?.error?.message || 'Failed to add category. Please try again.';
      }
    });
  }

  // =====================================================================
  // ========== ADD SUBCATEGORY MODAL (category + dynamic rows) ==========
  // =====================================================================

  openAddSubCategoryModal(): void {
    this.selectedCategoryId = '';
    this.subCategoryRows = [{ sub_category_name: '' }];
    this.subCategoryFormError = '';
    this.savingSubCategory = false;

    if (!this.addSubCategoryModalInstance) {
      this.addSubCategoryModalInstance = new bootstrap.Modal(this.addSubCategoryModalRef.nativeElement);
    }
    this.addSubCategoryModalInstance.show();
  }

  addSubCategoryRow(): void {
    this.subCategoryRows.push({ sub_category_name: '' });
  }

  removeSubCategoryRow(index: number): void {
    if (this.subCategoryRows.length === 1) return; // always keep at least one row
    this.subCategoryRows.splice(index, 1);
  }

  submitAddSubCategory(): void {
    this.subCategoryFormError = '';

    if (!this.selectedCategoryId) {
      this.subCategoryFormError = 'Please select a category.';
      return;
    }

    const cleanedRows = this.subCategoryRows
      .map(r => ({ sub_category_name: r.sub_category_name.trim() }))
      .filter(r => r.sub_category_name.length > 0);

    if (cleanedRows.length === 0) {
      this.subCategoryFormError = 'Add at least one subcategory name.';
      return;
    }

    const payload = {
      category_id: this.selectedCategoryId,
      subcategories: cleanedRows
    };

    this.savingSubCategory = true;
    this.apiServices.addsubcategory(payload).subscribe({
      next: (res: any) => {
        this.savingSubCategory = false;
        this.addSubCategoryModalInstance?.hide();
        this.getAllCategories();
        this.getAllSubCategories();
      },
      error: (err: any) => {
        console.log(err);
        this.savingSubCategory = false;
        this.subCategoryFormError = err?.error?.message || 'Failed to add subcategories. Please try again.';
      }
    });
  }
}