export class Leads {
  id: number;
  img:string
  titre:string
  nom: string;
  mail: string;
  chefDepartement:string
  telephone: string;
  departement: number;
  chef: number;
  constructor(leads: Leads) {
    {
      this.id = leads.id || this.getRandomID();
      this.img = leads.img || 'assets/images/avatar.jpg';
      this.nom = leads.nom || '';
      this.mail = leads.mail || '';
      this.titre = leads.titre || '';
      this.telephone = leads.telephone || '';
      this.departement = leads.departement || 0;
      this.chef = leads.chef || 0;
      this.chefDepartement=leads.chefDepartement|| ''
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
