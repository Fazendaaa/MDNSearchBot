/**
 * Fetch MDN info
 */
'use strict';

import { searchMDN } from 'mdn-search-docs';
import { Context } from '../../index';
import { DescriptionContext, MDNResponse, ParseContext } from './index';

const parseTags = (input: string | Array<string>): string => {
    // Not a triple equal because could be null or undefined.
    if (null == input) {
        return '';
    } if ('string' === typeof input) {
        return input;
    }

    return input.join(' | ');
};

const toMessage = ({ title, tags, excerpt, translate, url }: DescriptionContext): string => {
    return translate.t('mask', { tags: parseTags(tags), description: excerpt, title, url });
};

const parseMDN = ({ input, translate }: ParseContext): Array<MDNResponse> => {
    return input.map(({ title, tags, excerpt, url }) => {
        return {
            title,
            description: excerpt,
            thumb_url: 'https://i.imgur.com/Gpdebb5.png',
            message_text: toMessage({ title, tags, excerpt, translate, url })
        };
    });
};

export const fetchMDN = async ({ message, locale, translate, page }: Context): Promise<Array<MDNResponse>> => {
    const split = locale.split('-');
    const country = split[1].toUpperCase();
    const parsedLocale = split[0].concat('-', country);

    try {
        const searched = await searchMDN({ term: message, locale: parsedLocale, page });

        return parseMDN({ input: searched.documents, translate });
    } catch (e) {
        console.error(e);

        return [{
            title: translate.t('errorTitle'),
            description: translate.t('errorDescription'),
            thumb_url: 'https://i.imgur.com/keNHbqa.png',
            message_text: translate.t('errorText')
        }];
    }
};
