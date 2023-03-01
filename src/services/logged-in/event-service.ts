import { Subject } from "rxjs";


export const productSelection$ = new Subject();
export const cartLoading$ = new Subject();
  
export const logout$ = new Subject();
export const error500$ = new Subject();
export const error404$ = new Subject();
export const error400$ = new Subject();
export const errorOffline$ = new Subject(); 
 