export class Department {
  id: number;
  img!: string;
  nom: string;
  chefDepartement: string;
  telephone: string;
  mail: string;
  employee_capacity!: string;
  establishedYear!: string;
  totalEmploye: string;
  titre: string;

  constructor(department: Department) {
    this.id = department.id || this.getRandomID();
    this.img = department.img || 'assets/images/avatar.jpg';
    this.nom = department.nom || '';
    this.chefDepartement = department.chefDepartement || '';
    this.telephone = department.telephone || '';
    this.mail = department.mail || '';
    this.employee_capacity = department.employee_capacity || '';
    this.establishedYear = department.establishedYear || '';
    this.totalEmploye = department.totalEmploye || '';
    this.titre = department.titre || '';
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
