import { formatDate } from '@angular/common';

export class Transaction {
  id: string;
  plateforme: string;
  motif: string;
  date: string;
  heure: string;
  numero: string;
  api: string;
  montant: number;
 


  constructor(holiday: Partial<Transaction>) {
    this.id = holiday.id || this.getRandomID().toString();
    this.plateforme = holiday.plateforme || '';
    this.motif = holiday.motif || '';
    this.api = holiday.api || '';
    this.numero = holiday.numero || '';
    this.heure = holiday.heure || '';
    this.date = holiday.date || formatDate(new Date(), 'dd-MM-yyyy', 'fr');
    this.montant = holiday.montant || 0;
   
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
