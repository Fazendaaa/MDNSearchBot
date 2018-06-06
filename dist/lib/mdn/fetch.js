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
const parseTags = (input) => {
    if (undefined === input) {
        return '';
    }
    if ('string' === typeof input) {
        return input;
    }
    return input.join(' | ');
};
const toMessage = ({ title, tags, excerpt, translate, url }) => {
    return translate.t('mask', { tags: parseTags(tags), description: excerpt, title, url });
};
const parseMDN = ({ input, translate }) => {
    return input.map(({ title, tags, excerpt, url }) => {
        return {
            title,
            description: excerpt,
            thumb_url: 'https://i.imgur.com/Gpdebb5.png',
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
        return parseMDN({ input: searched.documents, translate });
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