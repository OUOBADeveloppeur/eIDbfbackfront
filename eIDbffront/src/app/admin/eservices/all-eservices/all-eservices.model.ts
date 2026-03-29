import { formatDate } from '@angular/common';

export class Eservice {
  id: number;
  libelle: string;
  url: string;
  description: string;
 
  



  constructor(authorite: Partial<Eservice>) {
    this.id = authorite.id || this.getRandomID();
    this.libelle = authorite.libelle || '';
    this.url = authorite.url || '';
    this.description = authorite.description || '';
   
    
   
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
