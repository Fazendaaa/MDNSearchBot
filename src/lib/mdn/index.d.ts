import { Documents } from 'mdn-search-docs';
import { MinimumInfo } from '../../index';

export interface MDNResponse extends MinimumInfo {}

export interface ParseContext {
    input: Array<Documents>;
    translate: any
}

export interface DescriptionContext {
    url: string
    title: string;
    translate: any;
    excerpt: string;
    tags: Array<string>;
}
