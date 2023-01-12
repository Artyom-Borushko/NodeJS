/* eslint-disable no-unused-vars */
export abstract class EntityDataMapper {
    abstract toDomain(entity: object): object;
    abstract toDalEntity(domain: object): object;
}
