/* eslint-disable no-unused-vars */
abstract class EntityDataMapper {
    abstract toDomain(entity: object): object;
    abstract toDalEntity(domain: object): object;
}

export { EntityDataMapper };
