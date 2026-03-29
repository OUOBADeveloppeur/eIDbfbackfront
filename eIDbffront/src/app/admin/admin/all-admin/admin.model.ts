export class Admin {
  id!: number;
  username!: string;
  password!: string;
  nom!: string;
  prenom!: string;
  role!: string;
  roleid!: string;
  telephone!: string;

  constructor(admin: Partial<Admin> = {}) {
    this.id = admin.id || this.getRandomID();
    this.username = admin.username || '';
    this.password = admin.password || '';
    this.nom = admin.nom || '';
    this.prenom = admin.prenom || '';
    this.role = admin.role || '';
    this.roleid = admin.roleid || '';
    this.telephone = admin.telephone || '';
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}