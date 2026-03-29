export class EmployeeSalary {
  id: number;

  url: string;
  statut: string;
  commentaire: string;
  client: string;
  dateMonitoring: string;
 

  constructor(employeeSalary: EmployeeSalary) {
    this.id = employeeSalary.id || this.getRandomID();
    this.url = employeeSalary.url || '';
    this.statut = employeeSalary.statut || '';
    this.commentaire = employeeSalary.commentaire || '';
    this.client = employeeSalary.client || '';
    this.dateMonitoring = employeeSalary.dateMonitoring || '';
  
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
