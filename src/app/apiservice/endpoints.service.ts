import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class EndpointsService {
  constructor() { }
  // login
  public loginApi = 'login'
  public logoutApi = 'logout'
  // User info
  public getUserInfo = 'user/info'
  // categories
  public getAllCategories = 'category/all'
  public getAllSubCategories = 'subcategories'
  public addcategory = 'category/create'
  public addsubcategory = 'subcategory/create'
  public UpdateCategory = 'category/update'
  public UpdateSubCategory = 'subcategories/update'
  // colors
  public getAllColors = 'colors'
  public addColor = 'colors'
  public deleteColor = 'colors'
  // products
  public getAllProducts = 'admin/shakti-products'
  public AddProduct = 'admin/shakti-products'
  // orders
  public getAllOrders = 'admin/orders'
  public getOrderDetails = 'admin/orders/details'
  // Customers
  public getAllCustomers = 'customers-list'
  // upload files
  public imageUpload = 'media/upload';
  public imagegetAll = 'media';
  public imageDelete = 'media';
  // banners
  public createbanners = 'admin/banners'
  public getAllBanners = 'admin/banners'
  public publishBanners = 'admin/banners'
  // inventory / stock  ✅ NEW
  public stockBase = 'admin/shakti-products'
  // product reviews (admin) ✅ NEW
  public getAdminReviews = 'admin/product/reviews'   // GET  /{product_id}?status=
  public addAdminReview = 'admin/product/review'     // POST
  public approveReview = 'admin/product/review'      // PUT  /{id}/approve
  // quick hits (admin) ✅ NEW
  public getQuickHitsAdmin = 'admin/quick-hits/list'   // GET
  public addQuickHit = 'admin/quick-hits/add'          // POST { product_id, position? }
  public removeQuickHit = 'admin/quick-hits/remove'    // POST { product_id }
  public toggleQuickHit = 'admin/quick-hits/toggle'    // POST { product_id, is_active }
  public reorderQuickHits = 'admin/quick-hits/reorder' // POST { order: [{product_id, position}] }
  // reels (admin) ✅ NEW
  public createReel = 'reel/create'           // POST (FormData)
  public updateReel = 'reel/update'           // POST (FormData)
  public updateReelStatus = 'reel/update-status' // POST { id, is_published }
  public deleteReel = 'reel/delete'           // POST { id }
  public getAllReels = 'reel/all'             // GET


    // banners
  // public createbanners = 'admin/banners'
  // public getAllBanners = 'admin/banners'
  // public publishBanners = 'admin/banners'
  public deleteBanner = 'admin/banners'   // ✅ NEW — DELETE /admin/banners/{id}

  getOrderByOrderId= 'orders_byorderId'
updateOrderStatus= 'order/update-status'
}
