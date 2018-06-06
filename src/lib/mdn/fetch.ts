/**
 * Fetch MDN info
 */
'use strict';

import { searchMDN } from 'mdn-search-docs';
import { Context } from '../../index';
import { DescriptionContext, MDNResponse, ParseContext, ParseTagsContext } from './index';

// This fix the broken template for when running the mask.
const cleanTags = (input: string): string => input.replace(/([\(\)])|([:_-])/gi, ' ');

const parseTags = ({ input, translate }: ParseTagsContext): string => {
    if (null === input || undefined === input) {
        return translate.t('noTags');
    } if ('object' === typeof input && input.length > 1) {
        return input.join(', ');
    } if ('string' === typeof input) {
        return input;
    }

    return translate.t('noTags');
};

const toMessage = ({ title, tags, excerpt, translate, url }: DescriptionContext): string => {
    try {
        const parsedTags = cleanTags(parseTags({ input: tags, translate }));

        return translate.t('mask', { tags: parsedTags, description: excerpt, title, url });
    } catch (e) {
        console.error(e);

        return translate.t('errorDescription');
    }
};

const parseMDN = ({ input, translate }: ParseContext): Array<MDNResponse> => {
    if (0 === input.length) {
        return [{
            title: translate.t('notFoundTitle'),
            description: translate.t('notFoundDescription'),
            thumb_url: 'https://i.imgur.com/6LfSLG2.png',
            message_text: translate.t('notFoundMessageText')
        }];
    }

    return input.map(({ title, tags, excerpt, url }) => {
        return {
            title,
            description: excerpt,
            thumb_url: 'https://i.imgur.com/hkANafU.png',
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
        const parsed = parseMDN({ input: searched.documents, translate });

        if ('' === message && 0 === page) {
            parsed.unshift({
                title: translate.t('homepageTitle'),
                description: translate.t('homepageDescription'),
                thumb_url: 'https://i.imgur.com/iCbi1J7.png',
                message_text: translate.t('homepageMessageText')
            });
        }

        return parsed;
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
