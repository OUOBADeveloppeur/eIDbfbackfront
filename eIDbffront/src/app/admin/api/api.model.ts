export class Api {
  id!: string;
  name!: string;
  description!: string;
  logoUrl!: string;
  commission!: number;

  constructor(api: Partial<Api> = {}) {
    this.id = api.id || this.getRandomID().toString();
    this.name = api.name || '';
    this.description = api.description || '';
    this.logoUrl = api.logoUrl || '';
    this.commission = api.commission || 0;
  
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}