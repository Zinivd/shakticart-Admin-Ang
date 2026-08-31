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
        allowedRole: 'admin',
        keywords: ['home', 'overview', 'analytics', 'stats', 'main']
    },

    {
        label: 'Products',
        icon: 'bx bx-cart-alt-2',
        activeIcon: 'bx bx-cart-alt-2',
        allowedRole: 'admin',
        avatarLabel: 'PR',
        keywords: ['product', 'catalog', 'inventory'],
        children: [


            {
                label: 'Categories',
                icon: 'bx bx-category',
                route: '/superadmin/products/categories',
                allowedRole: 'admin',
                keywords: ['category', 'product category']
            },

            {
                label: 'Product List',
                icon: 'bx bx-list-ul',
                route: '/superadmin/products/list',
                allowedRole: 'admin',
                keywords: ['view products', 'product list']
            },

            {
                label: 'Colors',
                icon: 'bx bx-palette',
                route: '/superadmin/products/colors',
                allowedRole: 'admin',
                keywords: ['colors', 'variants']
            },

            {
                label: 'Upload files',
                icon: 'bx bx-upload',
                route: '/superadmin/products/upload-files',
                allowedRole: 'admin',
                keywords: ['upload', 'files', 'media']
            },


        ],

    },
    {
        label: 'Inventory',
        icon: 'bx bx-store-alt-2',
        activeIcon: 'bx bx-store-alt-2',
        allowedRole: 'admin',
        keywords: ['inventory', 'stock', 'supplies'],
        children: [
            {
                label: 'Manage Stocks',
                icon: 'bx bx-trending-up',
                route: '/superadmin/inventory/stocks',
                allowedRole: 'admin'
            },
            {
                label: 'Banners',
                icon: 'bx bx-undo',
                route: '/superadmin/inventory/banners',
                allowedRole: 'admin'
            },
        ]
    },
    {
        label: 'Orders',
        icon: 'bxf bx-package',
        activeIcon: 'bxf bx-package',
        allowedRole: 'admin',
        keywords: ['orders', 'sales', 'transactions'],
        children: [
            {
                label: 'All Orders',
                icon: 'bx bx-trending-up',
                route: '/superadmin/orders/all',
                allowedRole: 'admin'
            },
            // {
            //     label: 'Invoices',
            //     icon: 'bx bx-undo',
            //     route: '/superadmin/orders/invoices',
            //     allowedRole: 'admin'
            // },
        ]
    },
    {
        label: 'Customers',
        icon: 'bx bx-user',
        activeIcon: 'bxf bx-user',
        allowedRole: 'admin',
        keywords: ['customers', 'clients', 'users'],
        children: [
            {
                label: 'All Customers',
                icon: 'bx bx-megaphone',
                route: '/superadmin/customers/all',
                allowedRole: 'admin'
            },
            // {
            //     label: 'Product Reviews',
            //     icon: 'bx bx-user-circle',
            //     route: '/superadmin/customers/reviews',
            //     allowedRole: 'admin'
            // },

        ]
    },
    {
        label: 'Controllers',
        icon: 'bx bx-blocks',
        activeIcon: 'bx bx-blocks',
        allowedRole: 'admin',
        keywords: ['customers', 'clients', 'users'],
        children: [
            {
                label: 'Quick Hits',
                icon: 'bx bx-megaphone',
                route: '/superadmin/quick-hits',
                allowedRole: 'admin'
            },
            {
                label: 'Product Reviews',
                icon: 'bx bx-user-circle',
                route: '/superadmin/customers/reviews',
                allowedRole: 'admin'
            },
            {
                label: 'Reels Control',
                icon: 'bx bx-user-circle',
                route: '/superadmin/reels-control',
                allowedRole: 'admin'
            },

        ]
    }
];
