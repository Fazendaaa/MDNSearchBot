/**
 * Parse tests.
 */
'use strict';

import { readFileSync } from 'fs';
import { join } from 'path';
import { toInline } from '../../../src/lib/telegram/parse';
import { messageToString } from '../../../src/lib/utils/parse';

interface Input {
    test: string;
    input: {
        message: string;
    };
    output: string
}

const basePath = join(__dirname, '../../__mocks__/utils/');
const readInput = (idiom: string): Array<Input> => JSON.parse(readFileSync(basePath.concat(`${idiom}/messageToString.json`), 'utf8'));

const idioms = ['en-US', 'pt-BR'];
const mocks = idioms.map(readInput).reduce((acc, cur) => acc.concat(cur), []);

describe('Testing messageToString', () => mocks.forEach(mock =>
    test(mock.test, () => {
        expect(messageToString(mock.input)).toEqual(mock.output);
    })
));
