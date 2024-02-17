import { RoleEntity } from '@classting/users/persistence/entities';

export class FindAllRolesResponseItem {
  public id: number;
  public name: string;
}

export class FindAllRolesResponse {
  public items: FindAllRolesResponseItem[];

  public static fromEntity(entities: RoleEntity[]): FindAllRolesResponse {
    const items = entities.map((entity) => {
      const item = new FindAllRolesResponseItem();
      item.id = entity.id;
      item.name = entity.name;
      return item;
    });

    const response = new FindAllRolesResponse();
    response.items = items;

    return response;
  }
}
