import { IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom, RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { AppSetting, ChannelFilterOption } from '../config/Settings';
import { getAppSettingValue } from './Settings';

export const isRoomSafe = async (read: IRead, room: IRoom): Promise<boolean> => {

	const { slugifiedName } = room;

	const channelsText = await getAppSettingValue(read, AppSetting.QnAppChannels);
	const filterRule = await getAppSettingValue(read, AppSetting.QnAppContentControlType);

	const channels = resolveChannelNames(channelsText);

	switch (filterRule) {
		case ChannelFilterOption.IGNORE_CHANNELS: {
			return !!channels.length && channels.includes(slugifiedName);
		}
		case ChannelFilterOption.TARGET_CHANNELS: {
			return !channels.length || !channels.includes(slugifiedName);
		}
	}

	return false;
};

export const resolveModeratorRoomTextMsg = async (read: IRead, room: IRoom): Promise<string> => {
	const { userIds, type, slugifiedName, parentRoom, displayName } = room;

	let roomInfoMessage: string = '';

	switch (type) {
		case RoomType.CHANNEL: {
			const isDiscussion = !!parentRoom;
			roomInfoMessage = `on the ${ isDiscussion ? 'discussion' : 'channel' } **#${ slugifiedName }**${ isDiscussion ? ` (**${ displayName }**)` : '' }`;
			break;
		}
		case RoomType.DIRECT_MESSAGE: {
			const roomName = userIds && userIds.length > 0 ? await resolveRoomNameFromUserIds(read, userIds) : '';
			roomInfoMessage = `in a direct message between **${ roomName }**`;
			break;
		}
		case RoomType.PRIVATE_GROUP: {
			roomInfoMessage = `on a private group **#${ slugifiedName }**`;
			break;
		}
		case RoomType.LIVE_CHAT: {
			roomInfoMessage = `in an Omnichannel room named **${ displayName }**`;
			break;
		}
	}

	return roomInfoMessage;
};

const resolveChannelNames = (channels: string): Array<string> => {
	if (!channels || channels.trim().length === 0) {
		return [];
	}
	return channels.trim().split(',');
};

const resolveRoomNameFromUserIds = async (read: IRead, userIds: Array<string>): Promise<string> => {
	const usernames: Array<string> = [];

	for (const userId of userIds) {
		const user = await read.getUserReader().getById(userId);
		if (user && user.username) {
			usernames.push(`**@${ user.username }**`);
		}
	}

	return `${ usernames.join(' x ') }`;
};