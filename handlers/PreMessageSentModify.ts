
import { IHttp, IMessageBuilder, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IMessage } from '@rocket.chat/apps-engine/definition/messages';
//import { BlockType, IBlock, ISectionBlock, ITextObject, TextObjectType } from '@rocket.chat/apps-engine/definition/uikit';
import { AppSetting } from '../config/Settings';
import { isRoomSafe, resolveModeratorRoomTextMsg } from '../lib/Rooms';
import { JSONReplacer } from '../lib/Serialization';
import { QnApp } from '../QnApp';

export class PreMessageSentModifyHandler {
	constructor(
		private readonly app: QnApp,
		private readonly message: IMessage,
		private readonly builder: IMessageBuilder,
		private readonly read: IRead,
		private readonly http: IHttp,
		private readonly persis: IPersistence) { }


	public async run() {

		// tslint:disable-next-line: max-line-length
		const { id: originalMessageId, text, sender, room } = this.message;
		if (!text || !originalMessageId) {
			return this.message;
		}
		this.app.getLogger().info(`originalText: ${text}`);

		const roomIsSafe = await isRoomSafe(this.read, room);
		this.app.getLogger().info(`roomIsSafe: ${roomIsSafe}`);
		if (roomIsSafe) {
			return this.message;
		}
		this.app.getLogger().info(`threadId: ${this.message.threadId}`);


		this.app.getLogger().info(`originalMessage: ${JSON.stringify(this.message, JSONReplacer)}`);

		this.builder.setText('blocked');
		return this.builder.getMessage();
	}
}