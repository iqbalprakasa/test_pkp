import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiBackend}products`;

  /**
   * Mengambil semua data produk dari API
   * @returns Observable berisi object data produk
   */
  getProducts(searchQuery?:string): Observable<any> {
    if(searchQuery){
      return this.http.get<any>(this.apiUrl+'/search?'+'q='+searchQuery+'&limit=2');
    }
    return this.http.get<any>(this.apiUrl+'?limit=2');

  }

  /**
   * Mengambil detail satu produk berdasarkan ID
   * @param id ID Produk
   */
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
 
 

  /**
   * Menghapus produk (DELETE)
   * @param id ID Produk
   */
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}