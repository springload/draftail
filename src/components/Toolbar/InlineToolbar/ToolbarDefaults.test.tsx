import { OrderedSet } from "immutable";
import React from "react";
import { shallow, mount } from "enzyme";

import ToolbarDefaults from "./ToolbarDefaults";

const mockProps = {
  currentStyles: new OrderedSet(),
  currentBlock: "unstyled",
  enableHorizontalRule: false,
  enableLineBreak: false,
  showUndoControl: false,
  showRedoControl: false,
  entityTypes: [],
  blockTypes: [],
  inlineStyles: [],
  toggleBlockType: () => {},
  toggleInlineStyle: () => {},
  addHR: () => {},
  addBR: () => {},
  onUndoRedo: () => {},
  onRequestSource: () => {},
};

describe("ToolbarDefaults", () => {
  it("empty", () => {
    expect(shallow(<ToolbarDefaults {...mockProps} />)).toMatchSnapshot();
  });

  describe("#enableHorizontalRule", () => {
    it("works", () => {
      expect(
        mount(<ToolbarDefaults {...mockProps} enableHorizontalRule />),
      ).toMatchSnapshot();
    });

    it("control overrides", () => {
      expect(
        mount(
          <ToolbarDefaults
            {...mockProps}
            enableHorizontalRule={{
              icon: "#icon-hr",
              label: "HR",
              description: "Horizontal rule",
            }}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe("#enableLineBreak", () => {
    it("works", () => {
      expect(
        mount(<ToolbarDefaults {...mockProps} enableLineBreak />),
      ).toMatchSnapshot();
    });

    it("control overrides", () => {
      expect(
        mount(
          <ToolbarDefaults
            {...mockProps}
            enableLineBreak={{
              icon: "#icon-br",
              label: "BR",
              description: "Soft line break",
            }}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe("#showUndoControl", () => {
    it("works", () => {
      expect(
        mount(<ToolbarDefaults {...mockProps} showUndoControl />),
      ).toMatchSnapshot();
    });

    it("control overrides", () => {
      expect(
        mount(
          <ToolbarDefaults
            {...mockProps}
            showUndoControl={{
              icon: "#icon-undo",
              label: "Undo",
              description: "Undo last change",
            }}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe("#showRedoControl", () => {
    it("works", () => {
      expect(
        mount(<ToolbarDefaults {...mockProps} showRedoControl />),
      ).toMatchSnapshot();
    });

    it("control overrides", () => {
      expect(
        mount(
          <ToolbarDefaults
            {...mockProps}
            showRedoControl={{
              icon: "#icon-redo",
              label: "Redo",
              description: "Redo last change",
            }}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  it("#entityTypes", () => {
    expect(
      mount(
        <ToolbarDefaults
          {...mockProps}
          entityTypes={[
            { type: "TEST_1", label: "Test 1" },
            { type: "TEST_2", label: "Test 2" },
            { type: "TEST_3", label: "Test 3" },
          ]}
        />,
      ),
    ).toMatchSnapshot();
  });

  it("#blockTypes", () => {
    expect(
      mount(
        <ToolbarDefaults
          {...mockProps}
          blockTypes={[
            { type: "TEST_1", label: "Test 1" },
            { type: "TEST_2", label: "Test 2" },
            { type: "TEST_3", label: "Test 3" },
          ]}
        />,
      ),
    ).toMatchSnapshot();
  });

  it("#inlineStyles", () => {
    expect(
      mount(
        <ToolbarDefaults
          {...mockProps}
          inlineStyles={[
            { type: "TEST_1", label: "Test 1" },
            { type: "TEST_2", label: "Test 2" },
            { type: "TEST_3", label: "Test 3" },
          ]}
        />,
      ),
    ).toMatchSnapshot();
  });

  it("button label default", () => {
    const wrapper = mount(
      <ToolbarDefaults {...mockProps} inlineStyles={[{ type: "BOLD" }]} />,
    );
    expect(wrapper.find("ToolbarButton").prop("label")).toBe("𝐁");
  });

  it("button label with icon", () => {
    const wrapper = mount(
      <ToolbarDefaults
        {...mockProps}
        inlineStyles={[{ type: "BOLD", icon: "#icon-bold" }]}
      />,
    );
    expect(wrapper.find("ToolbarButton").prop("label")).toBe(null);
  });

  it("button label overrides", () => {
    const wrapper = mount(
      <ToolbarDefaults
        {...mockProps}
        inlineStyles={[
          {
            type: "BOLD",
            label: "Format as bold",
          },
        ]}
      />,
    );
    expect(wrapper.find("ToolbarButton").prop("label")).toBe("Format as bold");
  });

  it.skip("custom button without label nor icon", () => {
    const wrapper = mount(
      <ToolbarDefaults
        {...mockProps}
        blockTypes={[
          {
            type: "emphasize",
          },
        ]}
        inlineStyles={[
          {
            type: "EMPHASIZE",
          },
        ]}
        entityTypes={[
          {
            type: "CUSTOM_LINK",
            source: () => {},
          },
        ]}
      />,
    );
    expect(wrapper.find("ToolbarButton").exists()).toBe(false);
  });

  it.skip("built-in button with empty label", () => {
    const wrapper = mount(
      <ToolbarDefaults
        {...mockProps}
        blockTypes={[
          {
            type: "blockquote",
            label: "",
          },
        ]}
        inlineStyles={[
          {
            type: "BOLD",
            label: "",
          },
        ]}
        entityTypes={[
          {
            type: "LINK",
            label: "",
            source: () => {},
          },
        ]}
      />,
    );
    expect(wrapper.find("ToolbarButton").exists()).toBe(false);
  });

  it.skip("built-in button with null label", () => {
    const wrapper = mount(
      <ToolbarDefaults
        {...mockProps}
        blockTypes={[
          {
            type: "blockquote",
            label: null,
          },
        ]}
        inlineStyles={[
          {
            type: "BOLD",
            label: null,
          },
        ]}
        entityTypes={[
          {
            type: "LINK",
            label: null,
            source: () => {},
          },
        ]}
      />,
    );
    expect(wrapper.find("ToolbarButton").exists()).toBe(false);
  });

  it("button titles with shortcut", () => {
    expect(
      mount(
        <ToolbarDefaults
          {...mockProps}
          inlineStyles={[{ type: "BOLD", description: null }]}
        />,
      )
        .find("ToolbarButton")
        .prop("title"),
    ).toBe("Ctrl + B");
  });

  it("button titles with shortcut and description", () => {
    expect(
      mount(
        <ToolbarDefaults
          {...mockProps}
          inlineStyles={[{ type: "BOLD", description: "Bold" }]}
        />,
      )
        .find("ToolbarButton")
        .prop("title"),
    ).toBe("Bold\nCtrl + B");
  });
});
