'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mdn_search_docs_1 = require("mdn-search-docs");
const cleanTags = (input) => input.replace(/([\(\)])|([:_-])/gi, ' ');
const parseTags = ({ input, translate }) => {
    if (null === input || undefined === input) {
        return translate.t('noTags');
    }
    if ('object' === typeof input && input.length > 1) {
        return input.join(', ');
    }
    if ('string' === typeof input) {
        return input;
    }
    return translate.t('noTags');
};
const toMessage = ({ title, tags, excerpt, translate, url }) => {
    try {
        const parsedTags = cleanTags(parseTags({ input: tags, translate }));
        return translate.t('mask', { tags: parsedTags, description: excerpt, title, url });
    }
    catch (e) {
        console.error(e);
        return translate.t('errorDescription');
    }
};
const parseMDN = ({ input, translate }) => {
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
exports.fetchMDN = ({ message, locale, translate, page }) => __awaiter(this, void 0, void 0, function* () {
    const split = locale.split('-');
    const country = split[1].toUpperCase();
    const parsedLocale = split[0].concat('-', country);
    try {
        const searched = yield mdn_search_docs_1.searchMDN({ term: message, locale: parsedLocale, page });
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
    }
    catch (e) {
        console.error(e);
        return [{
                title: translate.t('errorTitle'),
                description: translate.t('errorDescription'),
                thumb_url: 'https://i.imgur.com/keNHbqa.png',
                message_text: translate.t('errorText')
            }];
    }
});
//# sourceMappingURL=fetch.js.map