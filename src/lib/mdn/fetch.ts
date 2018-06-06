/**
 * Fetch MDN info
 */
'use strict';

import { searchMDN } from 'mdn-search-docs';
import { Context } from '../../index';
import { DescriptionContext, MDNResponse, ParseContext } from './index';

const toDescription = ({ title, tags, excerpt, translate, url }: DescriptionContext): string => {
    const parsedTags = tags.join(', ');

    return translate.t('mask', { title, tags: parsedTags, description: excerpt, url });
};

const parseMDN = ({ input, translate }: ParseContext): Array<MDNResponse> => {
    return input.map(({ title, tags, excerpt, url }) => {
        return {
            title,
            description: excerpt,
            thumb_url: 'https://i.imgur.com/Gpdebb5.png',
            message_text: toDescription({ title, tags, excerpt, translate, url })
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
