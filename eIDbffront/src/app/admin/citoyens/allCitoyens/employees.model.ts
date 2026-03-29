import { formatDate } from '@angular/common';

export class Personne {
  id!: number;
  nom!: string;
  prenom!: string;
  dateNaissance!: string; // ISO yyyy-MM-dd
  sexe!: string;
  nationalite!: string;
  telephone!: string;
  email!: string;
  adresse!: string;
  photo!: string;
  iu!: string;
  lieuNaissance!: string;
  etat!: string;
  agentString!: string;
  agent!: boolean;
  

  constructor(json : Partial<Personne>) {
    // ID
    this.id = json?.id || this.getRandomID();

    // Champs principaux
    this.nom = json?.nom || '';
    this.prenom = `${json?.prenom || ''} ${json?.prenom || ''}`.trim();

    // Identité / contact
    this.telephone = json?.telephone || '';
    this.email = json?.email || '';
    this.iu = json?.iu || ''; // IU comme identifiant fonctionnel

    // URLs / médias
    this.photo = json?.photo || '';
    this.lieuNaissance = json?.lieuNaissance || '';

    // État / token
      this.sexe = json?.sexe || '';
            this.agentString = json?.agentString || '';

      this.nationalite = json?.nationalite || '';
        this.adresse = json?.adresse || '';
    this.etat = json?.etat || 'INACTIF';

 
  }

  public getRandomID(): number {
    const S4 = () => ((1 + Math.random()) * 0x10000) | 0;
    return S4() + S4();
  }
}
