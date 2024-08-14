"use client"

export class LocalRepo {
    private static TOKEN_KEY = 'userToken';
  
    static getToken() {
        if(typeof window !== "undefined") {
            return localStorage.getItem(this.TOKEN_KEY);
        }
    }
    
    static setToken(token: string) {
      if(typeof window !== "undefined") {
        return localStorage.setItem(this.TOKEN_KEY, token);
      }
    }
    
    static clearToken() {
      if(typeof window !== "undefined") {
        return localStorage.removeItem(this.TOKEN_KEY);
      }
    }
    
  }
  