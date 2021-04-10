// @flow
export default {
  blocks: [
    {
      key: "c1gc9",
      text:
        "You can implement custom block types as required, and inline styles too, or entities.",
      type: "tiny-text",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 37,
          length: 11,
          style: "COLOR_D30A64",
        },
        {
          offset: 54,
          length: 13,
          style: "REDACTED",
        },
      ],
      entityRanges: [
        {
          offset: 76,
          length: 8,
          key: 0,
        },
      ],
      data: {},
    },
    {
      key: "7dtlg",
      text:
        "Draftail also supports the #plugins architecture of draft-js-plugins.",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 52,
          length: 16,
          style: "BOLD",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "affm4",
      text: " ",
      type: "atomic",
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
      key: "2uo5o",
      text: ".media .img {",
      type: "code-block",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "9cgaa",
      text: "    margin-right: 10px;",
      type: "code-block",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "3dhtn",
      text: "}",
      type: "code-block",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
  entityMap: {
    "0": {
      type: "DOCUMENT",
      mutability: "MUTABLE",
      data: {
        url: "docs.pdf",
      },
    },
    "1": {
      type: "EMBED",
      mutability: "IMMUTABLE",
      data: {
        url: "http://www.youtube.com/watch?v=y8Kyi0WNg40",
        title: "Dramatic Look",
        thumbnail: "/static/example-lowres-image2.jpg",
      },
    },
  },
};
