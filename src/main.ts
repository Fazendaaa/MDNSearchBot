/**
 * Main process
 */
'use strict';

import { config } from 'dotenv';
import { join } from 'path';
import { fetchMDN } from './lib/mdn/fetch';
import { toInline } from './lib/telegram/parse';
import { messageToString } from './lib/utils/parse';

config();

// ---------------------------------------------------------------------------------------------------------------------

const telegraf = require('telegraf');
const telegarfi18n = require('telegraf-i18n');

const bot = new telegraf(<string>process.env.BOT_KEY);
const i18n = new telegarfi18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: join(__dirname, '../others/locales')
});

bot.startPolling();
bot.use(telegraf.log());
bot.use(i18n.middleware());

// ---------------------------------------------------------------------------------------------------------------------

bot.start(({ i18n, replyWithMarkdown }) => {
    replyWithMarkdown(i18n.t('start'));
});

bot.help(async ({ i18n, replyWithMarkdown, replyWithVideo }) => {
    await replyWithMarkdown(i18n.t('help1'));
    await replyWithVideo('https://im.ezgif.com/tmp/ezgif-1-5de1083fd3.gif');
    await replyWithMarkdown(i18n.t('help2'));
});

bot.command('about', ({ i18n, replyWithMarkdown }) => {
    replyWithMarkdown(i18n.t('about'), { disable_web_page_preview: true });
});

bot.on('inline_query', async ({ i18n, answerInlineQuery, inlineQuery }) => {
    const message = messageToString({ message: inlineQuery.query });
    const offset = parseInt(inlineQuery.offset, 10) || 0;
    const fetched = await fetchMDN({ message, translate: i18n, locale: i18n.locale(), page: offset });
    const nextOffset = (1 !== fetched.length) ? offset : null;

    answerInlineQuery(toInline(fetched), { next_offset: nextOffset });
});
