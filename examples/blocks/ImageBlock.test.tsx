import React from "react";
import { ContentBlock, EditorState } from "draft-js";
import { shallow } from "enzyme";

import { DraftUtils } from "../../src/index";

import ImageBlock from "./ImageBlock";
import EmbedSource from "../sources/EmbedSource";

describe("ImageBlock", () => {
  it("renders", () => {
    expect(
      shallow(
        <ImageBlock
          block={new ContentBlock()}
          blockProps={{
            entityType: {
              description: "test",
              icon: "test",
              type: "test",
              source: EmbedSource,
            },
            editorState: EditorState.createEmpty(),
            entityKey: "string",
            textDirectionality: "RTL",
            lockEditor: () => {},
            unlockEditor: () => {},
            onChange: () => {},
            onEditEntity: () => {},
            onRemoveEntity: () => {},
            entity: {
              getType: () => "type",
              getMutability: () => "MUTABLE",
              getData: () => ({
                src: "example.png",
              }),
            },
          }}
        />,
      ).length,
    ).toBe(1);
  });

  it("alt", () => {
    expect(
      shallow(
        <ImageBlock
          block={new ContentBlock()}
          blockProps={{
            entityType: {
              description: "test",
              icon: "test",
              type: "test",
              source: EmbedSource,
            },
            editorState: EditorState.createEmpty(),
            entityKey: "string",
            textDirectionality: "RTL",
            lockEditor: () => {},
            unlockEditor: () => {},
            onChange: () => {},
            onEditEntity: () => {},
            onRemoveEntity: () => {},
            entity: {
              getType: () => "type",
              getMutability: () => "MUTABLE",
              getData: () => ({
                src: "example.png",
                alt: "Test",
              }),
            },
          }}
        />,
      ).length,
    ).toBe(1);
  });

  it("changeAlt", () => {
    const updateBlockEntity = jest
      .spyOn(DraftUtils, "updateBlockEntity")
      .mockImplementation((e) => e);

    const onChange = jest.fn();
    const wrapper = shallow(
      <ImageBlock
        block={new ContentBlock()}
        blockProps={{
          entityType: {
            description: "test",
            icon: "test",
            type: "test",
            source: EmbedSource,
          },
          editorState: EditorState.createEmpty(),
          entityKey: "string",
          textDirectionality: "RTL",
          lockEditor: () => {},
          unlockEditor: () => {},
          onEditEntity: () => {},
          onRemoveEntity: () => {},
          entity: {
            getType: () => "type",
            getMutability: () => "MUTABLE",
            getData: () => ({
              src: "example.png",
              alt: "Test",
            }),
          },
          onChange,
        }}
      />,
    );

    const currentTarget = document.createElement("input");
    currentTarget.value = "new alt";

    wrapper.find('[type="text"]').simulate("change", { currentTarget });

    expect(onChange).toHaveBeenCalled();
    expect(updateBlockEntity).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      expect.objectContaining({ alt: "new alt" }),
    );

    jest.restoreAllMocks();
  });
});
