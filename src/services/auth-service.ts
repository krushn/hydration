
import { config } from '../config';
import { error400$, error404$, error500$, errorOffline$, logout$ } from '../services/logged-in/event-service';
import { formatDate } from '../State';


export class AuthService {

    public user: string = '';
    public token: string = '';
    public currency: string = '';
    public language: string = '';
    public target: any = null;
    public progress = null;
    public achieve = null;
    public date = null;

    constructor(
    ) { 
        this.loadToken();
    }

    signIn(params: any) {
        return this.post('common/login/index', params);
    }

    logout() {
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('currency');
        window.localStorage.removeItem('language');
        window.localStorage.removeItem('target');

        window.localStorage.removeItem('progress');
        window.localStorage.removeItem('achieve');
        window.localStorage.removeItem('date');

        return this.post('common/logout/index', {});
    }

    async loadToken() {
        
        this.target = window.localStorage.getItem('target') + ''; 
        
        console.log(this.target);

        this.progress = parseInt(window.localStorage.getItem('progress'));
        this.achieve = parseInt(window.localStorage.getItem('achieve'));
        this.date = window.localStorage.getItem('date') + '';//this.formatDate(new Date((new Date()).setHours(-1)))

        const today = this.formatDate(new Date());

        if(today !== this.date) {
            this.setProgress({
                progress: 0,
                achieve: 0,
                date: today,
            });
        }

        if (!window.localStorage.getItem('user'))
            return false;

        this.user = window.localStorage.getItem('user') + '';
        this.token = window.localStorage.getItem('token') + '';
        this.currency = window.localStorage.getItem('currency') + '';
        this.language = window.localStorage.getItem('language') + '';
    }

    setProgress(data) {
        this.progress = data.progress;
        this.achieve = data.achieve;
        
        if(data.date)
            this.date = data.date;

        window.localStorage.setItem('progress', this.progress);
        window.localStorage.setItem('achieve', this.achieve);
        window.localStorage.setItem('date', this.date);
    }

    setTarget(target) {
        console.log('setTarget', target);

        this.target = target;
        window.localStorage.setItem('target', this.target);
    }

    setToken(
        data: {
             user: string, token: string,
            currency: string, language: string, target: any
        }
    ) {
        console.log(data);
        
        this.user = data.user;
        this.token = data.token;
        this.currency = data.currency;
        this.language = data.language;
        this.target = data.target;

        window.localStorage.setItem('user', data.user);
        window.localStorage.setItem('token', data.token);
        window.localStorage.setItem('currency', data.currency);
        window.localStorage.setItem('language', data.language);
        window.localStorage.setItem('target', data.target);
    }

    getHeaders() {
        this.loadToken();

        return {
            'Currency': 'USD',//this.currency,
            //  'Language': '1',// this.language,
            'Content-Type': 'application/json',
            'Token': this.token,
            'Authorization': 'Bearer ' + this.token
        };
    }

    delete(endPoint: string, params: any) {
        const url = config.API + endPoint;

        return fetch(url, {
            method: 'DELETE',
            headers: this.getHeaders(),
            body: JSON.stringify(params),
        }).then(response => {
            // reject not ok response
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.json() // or return response.text()
        })
        // catch error response and extract the error message
        .catch(async response => { 
            this._handleError(response);
            return Promise.reject(response)
        });
    }
    
    patch(endPoint: string, params: any) {
        const url = config.API + endPoint;

        return fetch(url, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(params),
        }).then(response => {
            // reject not ok response
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.json() // or return response.text()
        })
        // catch error response and extract the error message
        .catch(async response => { 
            this._handleError(response);
            return Promise.reject(response)
        });
    }

    post(endPoint: string, params: any) {
        const url = config.API + endPoint;

        return fetch(url, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(params),
        }).then(response => {
            // reject not ok response
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.json() // or return response.text()
        })
        // catch error response and extract the error message
        .catch(async response => { 
            this._handleError(response);
            return Promise.reject(response)
        });
    }

    get(endPoint: string) {
      
        const url = config.API + endPoint;

        return fetch(url, {
            method: 'GET',
            headers: this.getHeaders(),
            // body: JSON.stringify(params),
        }).then(response => {
            // reject not ok response
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.json() // or return response.text()
        })
        // catch error response and extract the error message
        .catch(async response => { 
            this._handleError(response);
            return Promise.reject(response)
        });
    }

    /**
     * Handles Caught Errors from All Authorized Requests Made to Server
     */
    _handleError(error: any) {
 
        //let errMsg = (error.message) ? error.message :
        //    error.status ? `${error.status} - ${error.statusText}` : 'Server error';

        // Handle Bad Requests
        // This error usually appears when agent attempts to handle an 
        // account that he's been removed from assigning
        if (error.status ===  400) { 
            console.error(JSON.stringify(error)); 
            error400$.next(null); 
        }

        // Handle No Internet Connection Error

        if (error.status === 0 || error.status === 504) {
            return errorOffline$.next(null); 
        }

        if (!navigator.onLine) {
            return errorOffline$.next(null); 
        }

        // Handle Expired Session Error
        if (error.status ===  401) {
            return this.logout().then(() => { 
                logout$.next(null); 
            }); 
        }

        // Handle internal server error - 500  
        if (error.status ===  500) { 
            console.error(JSON.stringify(error)); 
            return error500$.next(null); 
        }

        // Handle page not found - 404 error 
        if (error.status ===  404) { 
            return error404$.next(null); 
        } 
    }
    
    padTo2Digits(num: number) {
        return num.toString().padStart(2, '0');
    }
  
    formatDate(date: Date) {
        return (
            [
                date.getFullYear(),
                this.padTo2Digits(date.getMonth() + 1),
                this.padTo2Digits(date.getDate()),
            ].join('-')
        );
    }
} 