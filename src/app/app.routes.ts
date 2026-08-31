import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DashboardLayoutComponent } from './pages/layouts/dashboard-layout/dashboard-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { CategoryListComponent } from './pages/categories/category-list/category-list.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { ColorListComponent } from './pages/colors/color-list/color-list.component';
import { UploadFilesComponent } from './pages/upload-files/upload-files.component';
import { StockManageComponent } from './pages/inventory/stock-manage/stock-manage.component';
import { BannersListComponent } from './pages/inventory/banners-list/banners-list.component';
import { AllOrdersListComponent } from './pages/orders/all-orders-list/all-orders-list.component';
import { OrderInvoiceComponent } from './pages/orders/order-invoice/order-invoice.component';
import { ViewOrderComponent } from './pages/orders/view-order/view-order.component';
import { AllCustomersComponent } from './pages/customers/all-customers/all-customers.component';
import { ProductReviewComponent } from './pages/customers/product-review/product-review.component';
import { ColorAddComponent } from './pages/colors/color-add/color-add.component';
import { ProductAddComponent } from './pages/products/product-add/product-add.component';
import { ProductViewComponent } from './pages/products/product-view/product-view.component';
import { ProductUpdateComponent } from './pages/products/product-update/product-update.component';
import { ReelsControlComponent } from './pages/controllers/reels-control/reels-control.component';
import { QuickHitsComponent } from './pages/controllers/quick-hits/quick-hits.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth/sign-in',
    },
    {
        path: 'auth/sign-in',
        component: LoginPageComponent,
    },
    {
        path: 'superadmin',
        component: DashboardLayoutComponent,
        children: [
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'products/categories', component: CategoryListComponent },
            { path: 'products/list', component: ProductListComponent },
            { path: 'products/list/add', component: ProductAddComponent },
            { path: 'products/list/view-product/:id', component: ProductViewComponent },
            { path: 'products/list/update-product/:id', component: ProductUpdateComponent },
            { path: 'products/colors', component: ColorListComponent },
            { path: 'products/colors/add', component: ColorAddComponent },
            { path: 'products/upload-files', component: UploadFilesComponent },
            { path: 'inventory/stocks', component: StockManageComponent },
            { path: 'inventory/banners', component: BannersListComponent },
            { path: 'orders/all', component: AllOrdersListComponent },
            { path: 'orders/invoices', component: OrderInvoiceComponent },
            // ✅ NEW — order detail / status update page (uses order_id string, e.g. ORD1786759598763)
            { path: 'orders/view/:orderId', component: ViewOrderComponent },
            { path: 'customers/all', component: AllCustomersComponent },
            { path: 'customers/reviews', component: ProductReviewComponent },
            { path: 'quick-hits', component: QuickHitsComponent },
            { path: 'reels-control', component: ReelsControlComponent }
        ],
    }
];
