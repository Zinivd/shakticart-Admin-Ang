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

  

}
