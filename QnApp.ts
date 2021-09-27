import {
	IAppAccessors,
    IConfigurationExtend,
	IHttp,
	ILogger,
	IMessageBuilder,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IMessage, IPostMessageDeleted, IPostMessageSent, IPreMessageSentModify, IPreMessageUpdatedPrevent } from '@rocket.chat/apps-engine/definition/messages';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { PreMessageSentModifyHandler } from './handlers/PreMessageSentModify';
import { settings } from './config/Settings';

export class QnApp extends App implements IPreMessageSentModify {

    public appUser: IUser;

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async onEnable(): Promise<boolean> {
		const read: IRead = this.getAccessors().reader;
		this.appUser = await read.getUserReader().getAppUser(this.getID()) as IUser;
		if (!this.appUser) {
			this.getLogger().error('Error occurred while setting app user');
			return false;
		}
        return true;
    }

    // tslint:disable-next-line: max-line-length
	public async executePreMessageSentModify(message: IMessage, builder: IMessageBuilder, read: IRead, http: IHttp, persistence: IPersistence): Promise<IMessage> {
		try {
			const handler = new PreMessageSentModifyHandler(this, message, builder, read, http, persistence);
			return await handler.run();
		} catch (err) {
			this.getLogger().error(`${ err }`);
		}
        return message;
	}

    protected async extendConfiguration(configuration: IConfigurationExtend): Promise<void> {
		await Promise.all(settings.map((setting) => configuration.settings.provideSetting(setting)));
	}
}
