import { DbError } from '../../core/errors/dbError.js';
import { Model } from 'sequelize';


export class BaseRepository {
    constructor(
        protected model: any,
        protected dataMapper: any
    ) {
        this.model = model;
        this.dataMapper = dataMapper;
    }
    async getEntityById(entityId: string): Promise<Model> {
        try {
            return await this.model.findByPk(entityId);
        } catch (e) {
            throw new DbError('Error retrieving entity');
        }
    }
    async createEntity(entityToCreate: object): Promise<Model> {
        try {
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
    async deleteEntity(entityId: string): Promise<void> {
        try {
            await this.model.destroy({
                where: {
                    id: entityId
                }
            });
        } catch (e) {
            throw new DbError('Error deleting entity');
        }
    }
}
