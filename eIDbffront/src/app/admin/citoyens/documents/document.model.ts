export class Documents {
  id: number;
  autorite: number;
  typeDocument: number;
  dateDelivrance: string;
  dateExpiration: string;
  numero: string;
  reference: string;
  lieuEtablissement: string;
  contenu: string;
  personneId: number;
  taille: number;
  libelle!:string
  

  constructor(document: Documents) {
    this.id = document.id || this.getRandomID();
    this.autorite = document.autorite || 0;
    this.typeDocument = document.typeDocument || 0;
    this.dateDelivrance = document.dateDelivrance || '';
    this.dateExpiration = document.dateExpiration || '';
    this.numero = document.numero || '';
    this.reference = document.reference || '';
    this.lieuEtablissement = document.lieuEtablissement || '';
    this.contenu = document.contenu || '';
    this.personneId = document.personneId || 0;
    this.taille = document.taille || 0;
    this.libelle = document.libelle || '';

  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
