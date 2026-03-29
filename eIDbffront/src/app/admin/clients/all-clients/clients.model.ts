export class Clients {
  id!: number;
  email!: string;
  structure!: string;
  nom!: string;
  prenom!: string;
  password!: string;
  role!: string;
  telephone!: string;

  constructor(client: Partial<Clients> = {}) {
    this.id = client.id || this.getRandomID();
    this.email = client.email || '';
    this.structure = client.structure || '';
    this.nom = client.nom || '';
     this.password = client.password || '';
    this.prenom = client.prenom || '';
    this.role = client.role || '';
    this.telephone = client.telephone || '';
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}