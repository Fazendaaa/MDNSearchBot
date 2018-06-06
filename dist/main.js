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
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const fetch_1 = require("./lib/mdn/fetch");
const parse_1 = require("./lib/telegram/parse");
const parse_2 = require("./lib/utils/parse");
dotenv_1.config();
const telegraf = require('telegraf');
const telegarfi18n = require('telegraf-i18n');
const bot = new telegraf(process.env.BOT_KEY);
const i18n = new telegarfi18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: path_1.join(__dirname, '../others/locales')
});
bot.startPolling();
bot.use(telegraf.log());
bot.use(i18n.middleware());
bot.start(({ i18n, replyWithMarkdown }) => {
    replyWithMarkdown(i18n.t('start'));
});
bot.help(({ i18n, replyWithMarkdown, replyWithVideo }) => __awaiter(this, void 0, void 0, function* () {
    yield replyWithMarkdown(i18n.t('help1'));
    yield replyWithVideo('https://im.ezgif.com/tmp/ezgif-1-5de1083fd3.gif');
    yield replyWithMarkdown(i18n.t('help2'));
}));
bot.command('about', ({ i18n, replyWithMarkdown }) => {
    replyWithMarkdown(i18n.t('about'), { disable_web_page_preview: true });
});
bot.on('inline_query', ({ i18n, answerInlineQuery, inlineQuery }) => __awaiter(this, void 0, void 0, function* () {
    const message = parse_2.messageToString({ message: inlineQuery.query });
    const page = parseInt(inlineQuery.offset, 10) || 0;
    const fetched = yield fetch_1.fetchMDN({ message, translate: i18n, locale: i18n.locale(), page });
    answerInlineQuery(parse_1.toInline(fetched), { next_offset: page + 1 });
}));
//# sourceMappingURL=main.js.map