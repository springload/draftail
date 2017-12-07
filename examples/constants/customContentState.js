export default {
    entityMap: {
        '0': {
            type: 'DOCUMENT',
            mutability: 'MUTABLE',
            data: {
                url: 'doc.pdf',
                title: 'Kritik der reinen Vernunft',
            },
        },
        '1': {
            type: 'EMBED',
            mutability: 'IMMUTABLE',
            data: {
                url: 'http://www.youtube.com/watch?v=y8Kyi0WNg40',
                title: 'Dramatic Look',
                providerName: 'YouTube',
                authorName: 'magnets99',
                thumbnail: 'https://i.ytimg.com/vi/y8Kyi0WNg40/hqdefault.jpg',
            },
        },
    },
    blocks: [
        {
            key: 'c1gc9',
            text: 'You can implement custom block types as required.',
            type: 'tiny-text',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        },
        {
            key: 'bldpo',
            text:
                'And also inline styles. Or abuse the entity API to make text decorators.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 9,
                    length: 13,
                    style: 'REDACTED',
                },
                {
                    offset: 27,
                    length: 5,
                    style: 'REDACTED',
                },
                {
                    offset: 56,
                    length: 15,
                    style: 'REDACTED',
                },
            ],
            entityRanges: [
                {
                    offset: 44,
                    length: 3,
                    key: 0,
                },
            ],
            data: {},
        },
        {
            key: 'affm4',
            text: ' ',
            type: 'atomic',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [
                {
                    offset: 0,
                    length: 1,
                    key: 1,
                },
            ],
            data: {},
        },
        {
            key: '2uo5o',
            text: '.media .img {',
            type: 'code-block',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        },
        {
            key: '9cgaa',
            text: '    margin-right: 10px;',
            type: 'code-block',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        },
        {
            key: '3dhtn',
            text: '}',
            type: 'code-block',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        },
    ],
};
