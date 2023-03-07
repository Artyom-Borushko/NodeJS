import { DbError } from '../../core/errors/dbError.js';
import { Model, Transaction } from 'sequelize';


export class BaseRepository {
    constructor(protected model: any) {
        this.model = model;
    }
    async getEntityById(entityId: string, transaction?: Transaction): Promise<Model> {
        try {
            if (transaction) {
                return await this.model.findByPk(entityId, { transaction });
            }
            return await this.model.findByPk(entityId);
        } catch (e) {
            throw new DbError('Error retrieving entity');
        }
    }
    async getAllEntitiesByParams(query: object): Promise<Array<Model>> {
        try {
            return await this.model.findAll(query);
        } catch (e) {
            throw new DbError('Error retrieving entities');
        }
    }
    async createEntity(entityToCreate: object, transaction?: Transaction): Promise<Model> {
        try {
            if (transaction) {
                return await this.model.create(entityToCreate, { transaction });
            }
            return await this.model.create(entityToCreate);
        } catch (e) {
            throw new DbError('Error creating entity');
        }
    }
    async updateEntityById(entityUpdates: object, id: string): Promise<Model> {
        try {
            let updatedEntity;
            let rowsUpdate;
            // eslint-disable-next-line no-unused-vars,prefer-const
            [rowsUpdate, [updatedEntity]] = await this.model.update(entityUpdates, {
                returning: true,
                where: { id }
            });
            return updatedEntity;
        } catch (e) {
            throw new DbError('Error updating entity');
        }
    }
    async deleteEntity(entityId: string): Promise<number> {
        try {
            return await this.model.destroy({
                where: {
                    id: entityId
                }
            });
        } catch (e) {
            throw new DbError('Error deleting entity');
        }
    }
    async deleteEntityByParams(query: object): Promise<number> {
        try {
            return await this.model.destroy(query);
        } catch (e) {
            throw new DbError('Error deleting entity');
        }
    }
}
