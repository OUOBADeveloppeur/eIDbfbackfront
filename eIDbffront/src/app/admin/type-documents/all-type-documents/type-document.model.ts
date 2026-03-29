export class TypeDocument {
  id: number;
  libelle: string;
  description: string;

  constructor(typeDocument: Partial<TypeDocument>) {
    this.id = typeDocument.id || this.getRandomID();
    this.libelle = typeDocument.libelle || '';
    this.description = typeDocument.description || '';
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
