/**
 * Fetch tests.
 */
'use strict';

import { readFileSync } from 'fs';
import { join } from 'path';
import { Context } from '../../../src/index';
import { fetchMDN } from '../../../src/lib/mdn/fetch';
import { MDNResponse } from '../../../src/lib/mdn/index';
const i18n = require('telegraf-i18n');

const translate = new i18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: join(__dirname, '../../../others/locales')
});

interface Input {
    test: string;
    input: Context;
    output: MDNResponse
}

const basePath = join(__dirname, '../../__mocks__/mdn/');
const readInput = (idiom: string): Array<Input> => JSON.parse(readFileSync(basePath.concat(`${idiom}/fetchMDN.json`), 'utf8'));

const idioms = ['en-US', 'pt-BR'];
const mocks = idioms.map(readInput).reduce((acc, cur) => acc.concat(cur), []);

describe('Testing fetchMDN', () => mocks.forEach(mock =>
    test(mock.test, () => {
        expect(fetchMDN({ translate, ...mock.input })).resolves.toEqual(mock.output).catch(console.error);
    })
));
