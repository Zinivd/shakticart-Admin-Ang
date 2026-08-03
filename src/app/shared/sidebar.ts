export interface SidebarItem {
    label: string;
    icon: string;
    activeIcon?: string;
    route?: string;
    allowedRole: string | string[];
    children?: SidebarItem[];
    open?: boolean;
    keywords?: string[];
    avatarLabel?: string;
    searchOnlyChildren?: any;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
    {
        label: 'Dashboard',
        icon: 'bx bx-dashboard',
        activeIcon: 'bx bx-dashboard',
        route: '/superadmin/dashboard',
        allowedRole: 'superadmin',
        keywords: ['home', 'overview', 'analytics', 'stats', 'main']
    },

    {
        label: 'Products',
        icon: 'bx bx-cart-alt-2',
        activeIcon: 'bx bx-cart-alt-2',
        allowedRole: 'superadmin',
        avatarLabel: 'PR',
        keywords: ['product', 'catalog', 'inventory'],
        children: [


            {
                label: 'Categories',
                icon: 'bx bx-category',
                route: '/superadmin/products/categories',
                allowedRole: 'superadmin',
                keywords: ['category', 'product category']
            },

            {
                label: 'Product List',
                icon: 'bx bx-list-ul',
                route: '/superadmin/products/list',
                allowedRole: 'superadmin',
                keywords: ['view products', 'product list']
            },

            {
                label: 'Colors',
                icon: 'bx bx-palette',
                route: '/superadmin/products/colors',
                allowedRole: 'superadmin',
                keywords: ['colors', 'variants']
            },

            {
                label: 'Upload files',
                icon: 'bx bx-upload',
                route: '/superadmin/products/upload-files',
                allowedRole: 'superadmin',
                keywords: ['upload', 'files', 'media']
            },


        ],
       
    },
    {
        label: 'Inventory',
        icon: 'bx bx-store-alt-2',
        activeIcon: 'bx bx-store-alt-2',
        allowedRole: 'superadmin',
        keywords: ['inventory', 'stock', 'supplies'],
        children: [
            {
                label: 'Manage Stocks',
                icon: 'bx bx-trending-up',
                route: '/superadmin/inventory/stocks',
                allowedRole: 'superadmin'
            },
            {
                label: 'Banners',
                icon: 'bx bx-undo',
                route: '/superadmin/inventory/banners',
                allowedRole: 'superadmin'
            },
        ]
    },
    {
        label: 'Orders',
        icon: 'bxf bx-package',
        activeIcon: 'bxf bx-package',
        allowedRole: 'superadmin',
        keywords: ['orders', 'sales', 'transactions'],
        children: [
            {
                label: 'All Orders',
                icon: 'bx bx-trending-up',
                route: '/superadmin/orders/all',
                allowedRole: 'superadmin'
            },
            {
                label: 'Invoices',
                icon: 'bx bx-undo',
                route: '/superadmin/orders/invoices',
                allowedRole: 'superadmin'
            },
        ]
    },
    {
        label: 'Customers',
        icon: 'bx bx-user',
        activeIcon: 'bxf bx-user',
        allowedRole: 'superadmin',
        keywords: ['customers', 'clients', 'users'],
        children: [
            {
                label: 'All Customers',
                icon: 'bx bx-megaphone',
                route: '/superadmin/customers/all',
                allowedRole: 'superadmin'
            },
            {
                label: 'Product Reviews',
                icon: 'bx bx-user-circle',
                route: '/superadmin/customers/reviews',
                allowedRole: 'superadmin'
            },
            
        ]
    }
];