export type LanguageID = "en-GB" | "en-US";

export interface UserSettings {
	languageID?: LanguageID;
}
export interface GuildSettings {
	languageID?: LanguageID;
	moderatorRoleID?: string;
}
