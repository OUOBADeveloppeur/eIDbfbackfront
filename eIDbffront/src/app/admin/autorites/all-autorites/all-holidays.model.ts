import { formatDate } from '@angular/common';

export class Authorite {
  id: number;
  libelle: string;
  adresse: string;
  email: string;
  telephone: string;
  siteWeb: string;
  



  constructor(authorite: Partial<Authorite>) {
    this.id = authorite.id || this.getRandomID();
    this.libelle = authorite.libelle || '';
    this.adresse = authorite.adresse || '';
    this.email = authorite.email || '';
    this.telephone = authorite.telephone || '';
    this.siteWeb = authorite.siteWeb || '';
    
   
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
