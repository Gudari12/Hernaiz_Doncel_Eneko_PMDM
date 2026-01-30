import { IPregunta } from './../interfaces/interfaces';
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class GestionStorageService {

  constructor() {}

  async setString(key: string, value: string) {
    await Preferences.set({ key, value });
  }
  
  async getString(key: string): Promise<{ value: any }> {
    return await Preferences.get({ key });
  }
  
  async setObject(key: string, value: any) {
    await Preferences.set({ key, value: JSON.stringify(value) });
  }
  
  async getObject(key: string): Promise<IPregunta[]> {
    const ret: any = await Preferences.get({ key });
    return JSON.parse(ret.value);
  }
  
  async removeItem(key: string) {
    await Preferences.remove({ key });
  }
  
  async clear() {
    await Preferences.clear();
  }
}