import { formatDate } from '@angular/common';


    export class Payout {
    id: string
    date: string
    heure: string
    montant: number
    plateformeId: string
    plateformeNom: string
 

  constructor(employeeSalary: Payout) {
    this.id = employeeSalary.id || this.getRandomID().toString();
    this.date = employeeSalary.date ||  '';
    this.heure = employeeSalary.heure || '';
    this.montant = employeeSalary.montant || 0;
    this.plateformeId = employeeSalary.plateformeId || '';
    this.plateformeNom = employeeSalary.plateformeNom || '';
  
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
