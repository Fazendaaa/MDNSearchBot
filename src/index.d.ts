import { InlineKeyboardMarkup } from 'telegram-typings';

export interface MinimumInfo {
    title: string;
    description: string;
    thumb_url: string;
    message_text: string;
}

export interface Context {
    page: number;
    translate: any;
    locale: string;
    message: string;
}
