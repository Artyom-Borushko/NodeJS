import { Sequelize } from 'sequelize';
import { sequelizeConnectionString } from './db.config';


export class InitializeSequelize {
    private static instance: Sequelize;
    private placeholder: null;
    private constructor() {
        this.placeholder = null;
    }
    public static getInstance(): Sequelize {
        if (!InitializeSequelize.instance) {
            try {
                InitializeSequelize.instance = new Sequelize(sequelizeConnectionString);
            } catch (e) {
                throw e;
            }
        }
        return InitializeSequelize.instance;
    }
}
