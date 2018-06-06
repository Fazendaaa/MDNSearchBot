/**
 * Parse tests.
 */
'use strict';

import { readFileSync } from 'fs';
import { join } from 'path';
import { InlineQueryResultArticle } from 'telegram-typings';
import { Context, MinimumInfo } from '../../../src/index';
import { toInline } from '../../../src/lib/telegram/parse';

interface Input {
    test: string;
    input: Array<MinimumInfo>;
    output: InlineQueryResultArticle
}

const basePath = join(__dirname, '../../__mocks__/telegram/');
const readInput = (idiom: string): Array<Input> => JSON.parse(readFileSync(basePath.concat(`${idiom}/toInline.json`), 'utf8'));

const mocks = readInput('en-US');

describe('Testing toInline', () => mocks.forEach(mock =>
    test(mock.test, () => {
        expect(toInline(mock.input)).toEqual(mock.output);
    })
));
