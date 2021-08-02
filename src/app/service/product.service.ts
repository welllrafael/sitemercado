import { Product } from './../model/product';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productUrl = 'https://localhost:44359/api/produtos';

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Product[]>{
    return this.httpClient.get<Product[]>(this.productUrl)
  }

  addItem(product: any): Observable<Product>{
    return this.httpClient.post<Product>(this.productUrl,JSON.parse(JSON.stringify(product)))
  }

  updateItem(product: any,id?: number): Observable<Product>{
    return this.httpClient.put<Product>(`${this.productUrl}/${id}`,JSON.parse(JSON.stringify(product)))
  }

  deleteItem(id?: number): Observable<Product>{
    return this.httpClient.delete<Product>(`${this.productUrl}/${id}`)
  }
}
