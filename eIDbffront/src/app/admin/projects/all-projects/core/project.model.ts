import { Injectable } from '@angular/core';
import { Adapter } from './adapters';

export enum ProjectStatus {
  NEWPROJECTS ="Nouveau",
  RUNNING = "En cours",
  ONHOLD = "Annulé",
  FINISHED = "Terminé",
  ATTENTE="En attente",
  NOTSTART="Non démarré"
}

export enum ProjectPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
}
export enum ProjectType {
  WEB = 'Website',
  ANDROID = 'Android',
  IPHONE = 'IPhone',
  TESTING = 'Testing',
}

export class Project {
  constructor(
    public id: number,

    public nom: string,
    public department:string ,
     public department_id:number ,
    public  description:string ,
    public  responsable:string,
    public beneficiaire:string,
    
     public client:number ,
     // price: ['', [Validators.required]],
    public  startDate:string ,
    public  endDate: string,
    public  team:number ,

    
   
    public statut: string = ProjectStatus.NEWPROJECTS,
 
 
    public priority: number,
   
    public type_libelle: string ,
    public type:number,
   
    public progression?: string
  ) {}
}

@Injectable({
  providedIn: 'root',
})
export class ProjectAdapter implements Adapter<Project> {
  adapt(item: any): Project {
    const adapted = new Project(
      Number(item.id),
      item.nom,
      item.statut ,
      item.description,
      item.endDate ? item.endDate : undefined,
      item.priority,
       item.startDate ? item.startDate : undefined,
       item.departement_id,
         item.beneficiaire,
      item.type,
       item.type_libelle,
      item.departement ? item.departement : undefined,
      item.team,
      item.client ,
     
      item.progression ? item.progression : undefined
    );
    return adapted;
  }
}
