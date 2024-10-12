import {
    DataSource,
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import 'reflect-metadata';

interface DataType {
    id: number;
    ip: string;
    country?: string;
    createdAt: Date;
    email: string;
    phone: string;
    password: string;
    status: string;
    cookies?: string;
}

interface ChromeConfigData {
    proxy: string;
    enableImage: boolean;
    enableCSS: boolean;
}

interface TelegramConfigData {
    token: string;
    chatId: string;
}

@Entity()
export class Data extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar')
    ip!: string;

    @Column('varchar', { nullable: true })
    country?: string;

    @Column('datetime')
    createdAt!: Date;

    @Column('varchar')
    email!: string;

    @Column('varchar')
    phone!: string;

    @Column('varchar')
    password!: string;

    @Column('varchar')
    status!: string;

    @Column('text', { nullable: true })
    cookies?: string;

    setData(data: DataType): void {
        Object.assign(this, data);
    }

    getData(): DataType {
        return this;
    }
}

@Entity()
export class TelegramConfig extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar')
    token!: string;

    @Column('varchar')
    chatId!: string;

    getConfig(): TelegramConfigData {
        return {
            token: this.token,
            chatId: this.chatId,
        };
    }

    setConfig(config: TelegramConfigData): void {
        this.token = config.token;
        this.chatId = config.chatId;
    }
}

@Entity()
export class ChromeConfig extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar')
    proxy!: string;

    @Column('boolean')
    enableImage!: boolean;

    @Column('boolean')
    enableCSS!: boolean;

    getConfig(): ChromeConfigData {
        return {
            proxy: this.proxy,
            enableImage: this.enableImage,
            enableCSS: this.enableCSS,
        };
    }

    setConfig(config: ChromeConfigData): void {
        this.proxy = config.proxy;
        this.enableImage = config.enableImage;
        this.enableCSS = config.enableCSS;
    }
}

export class DataStore {
    private readonly dataSource: DataSource;

    constructor() {
        this.dataSource = new DataSource({
            type: 'sqlite',
            database: 'database.sqlite',
            entities: [Data, TelegramConfig, ChromeConfig],
            synchronize: true,
            logging: false,
        });
    }

    async getTelegramConfig(): Promise<TelegramConfigData | null> {
        const telegramConfig = await TelegramConfig.findOneBy({ id: 1 });
        if (!telegramConfig) {
            await this.updateTelegramConfig({
                token: '',
                chatId: '',
            });
        }
        return (
            telegramConfig?.getConfig() ?? {
                token: '',
                chatId: '',
            }
        );
    }

    async updateTelegramConfig(config: TelegramConfigData): Promise<void> {
        const telegramConfig = await TelegramConfig.findOneBy({ id: 1 });
        if (telegramConfig) {
            telegramConfig.setConfig(config);
            await telegramConfig.save();
        }
    }

    async createData(data: DataType): Promise<void> {
        const newData = new Data();
        newData.setData(data);
        await newData.save();
    }

    async getAllData(): Promise<DataType[]> {
        const data = await Data.find();
        return data.map((data) => data.getData());
    }

    async deleteData(id: number): Promise<void> {
        await Data.delete(id);
    }

    async getChromeConfig(): Promise<ChromeConfigData | null> {
        const chromeConfig = await ChromeConfig.findOneBy({ id: 1 });
        if (!chromeConfig) {
            await this.updateChromeConfig({
                proxy: '',
                enableImage: true,
                enableCSS: true,
            });
        }
        return (
            chromeConfig?.getConfig() ?? {
                proxy: '',
                enableImage: true,
                enableCSS: true,
            }
        );
    }

    async updateChromeConfig(config: ChromeConfigData): Promise<void> {
        const chromeConfig = await ChromeConfig.findOneBy({ id: 1 });
        if (chromeConfig) {
            chromeConfig.setConfig(config);
            await chromeConfig.save();
        }
    }

    async connect(): Promise<void> {
        await this.dataSource.initialize();
        console.log('Data Source has been initialized!');
    }

    async close(): Promise<void> {
        await this.dataSource.destroy();
        console.log('Data Source has been closed.');
    }
}

export default DataStore;
