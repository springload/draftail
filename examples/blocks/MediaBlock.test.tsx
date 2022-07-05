import React from "react";
import { ContentBlock, EditorState } from "draft-js";
import { shallow } from "enzyme";

import EmbedSource from "../sources/EmbedSource";

import MediaBlock, { MediaBlockProps, MediaBlockState } from "./MediaBlock";
import Portal from "../components/Portal";

const typedShallow = (elt: React.ReactElement) =>
  shallow<MediaBlock, MediaBlockProps, MediaBlockState>(elt);

describe("MediaBlock", () => {
  it("renders", () => {
    expect(
      typedShallow(
        <MediaBlock
          src="example.png"
          label="test"
          isLoading={false}
          block={new ContentBlock()}
          blockProps={{
            entityType: {
              description: "desc",
              icon: "#icon-test",
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
        >
          Test
        </MediaBlock>,
      ),
    ).toMatchSnapshot();
  });

  it("isLoading", () => {
    expect(
      typedShallow(
        <MediaBlock
          src="example.png"
          label="test"
          isLoading
          block={new ContentBlock()}
          blockProps={{
            entityType: {
              description: "desc",
              icon: "#icon-test",
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
        >
          Test
        </MediaBlock>,
      ),
    ).toMatchSnapshot();
  });

  describe("tooltip", () => {
    let wrapper: ReturnType<typeof typedShallow>;

    beforeEach(() => {
      wrapper = typedShallow(
        <MediaBlock
          src="example.png"
          label=""
          isLoading={false}
          block={new ContentBlock()}
          blockProps={{
            entityType: {
              description: "desc",
              icon: "#icon-test",
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
        >
          Test
        </MediaBlock>,
      );
    });

    it("opens", () => {
      const target = document.createElement("div");
      document.body.appendChild(target);

      wrapper.simulate("mouseup", { target });

      expect(
        wrapper.find("Portal").dive<Portal>().instance().portal,
      ).toMatchSnapshot();
    });

    it("large viewport", () => {
      const target = document.createElement("div");
      document.body.appendChild(target);
      target.getBoundingClientRect = () =>
        ({
          top: 0,
          left: 0,
          width: -600,
          height: 0,
        } as DOMRect);

      wrapper.simulate("mouseup", { target });

      const portalElt = wrapper.find("Portal").dive<Portal>().instance().portal;

      expect(portalElt!.querySelector(".Tooltip")!.className).toBe(
        "Tooltip Tooltip--start",
      );
    });

    it("closes", () => {
      const target = document.createElement("div");
      document.body.appendChild(target);

      jest.spyOn(target, "getBoundingClientRect");

      expect(wrapper.state("tooltip")).toBe(null);

      wrapper.simulate("mouseup", { target });

      expect(wrapper.state("tooltip")).toMatchObject({
        target: {
          top: 0,
          left: 0,
        },
      });
      expect(target.getBoundingClientRect).toHaveBeenCalled();

      wrapper.instance().closeTooltip();

      expect(wrapper.state("tooltip")).toBe(null);
    });
  });
});
