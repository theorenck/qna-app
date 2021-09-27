import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';

export enum AppSetting {
	QnAppContentControlType = 'QnApp_content_control_type',
	QnAppChannels = 'QnApp_channels',
}

export enum ChannelFilterOption {
	IGNORE_CHANNELS = 'IGNORE_CHANNELS',
	TARGET_CHANNELS = 'TARGET_CHANNELS',
}

export const settings: Array<ISetting> = [	{
    id: AppSetting.QnAppContentControlType,
    public: true,
    type: SettingType.SELECT,
    packageValue: ChannelFilterOption.IGNORE_CHANNELS,
    value: ChannelFilterOption.IGNORE_CHANNELS,
    values: [
        {
            key: ChannelFilterOption.IGNORE_CHANNELS,
            i18nLabel: 'Ignore Channels',
        },
        {
            key: ChannelFilterOption.TARGET_CHANNELS,
            i18nLabel: 'Target Channels',
        },
    ],
    i18nLabel: 'QnApp_content_control_type',
    required: true,
},
{
    id: AppSetting.QnAppChannels,
    public: true,
    type: SettingType.STRING,
    packageValue: 'questions',
    i18nLabel: 'QnApp_channels',
    i18nDescription: 'QnApp_channels_description',
    required: true,
}]