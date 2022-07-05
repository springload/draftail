import React, { useEffect, useRef, useState } from "react";
import Tippy, { TippyProps } from "@tippyjs/react";

const hideTooltipOnEsc = {
  name: "hideOnEsc",
  defaultValue: true,
  fn({ hide }: { hide: () => void }) {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        hide();
      }
    }

    return {
      onShow() {
        document.addEventListener("keydown", onKeyDown);
      },
      onHide() {
        document.removeEventListener("keydown", onKeyDown);
      },
    };
  },
};

const zeroWidthSpacer = "\u200B";

const tippyPlugins = [hideTooltipOnEsc];

// https://atomiks.github.io/tippyjs/v6/all-props/#duration
const duration: [number, number] = [300, 0];

export interface TooltipPosition {
  top: number;
  left: number | string;
}

export type TooltipPlacement = TippyProps["placement"];
export type PopperInstance = Parameters<NonNullable<TippyProps["onMount"]>>[0];

export interface TooltipProps {
  shouldOpen: boolean;
  getTargetPosition?: (editorRect: DOMRect) => TooltipPosition | null;
  content: React.ReactNode;
  children?: React.ReactElement;
  showBackdrop?: boolean;
  zIndex?: number;
  placement?: TooltipPlacement;
  onHide?: () => void;
  onMount?: (instance: PopperInstance) => void;
}

const Tooltip = ({
  content,
  children,
  shouldOpen,
  getTargetPosition,
  showBackdrop = false,
  zIndex = 100,
  placement = "top" as TooltipPlacement,
  onHide,
  onMount,
}: TooltipProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<TooltipPosition | null>();

  useEffect(() => {
    if (!children && getTargetPosition && parentRef.current) {
      if (shouldOpen) {
        const editor = parentRef.current.closest<HTMLDivElement>(
          "[data-draftail-editor]",
        );
        const editorRect = editor!.getBoundingClientRect();
        setPosition(getTargetPosition(editorRect));
      } else {
        setPosition(null);
      }
    }
  }, [shouldOpen, getTargetPosition, children]);

  const visible = shouldOpen && Boolean(position || children);

  return (
    <>
      {showBackdrop ? (
        <div
          className={`Draftail-Tooltip__backdrop${
            shouldOpen ? " Draftail-Tooltip__backdrop--visible" : ""
          }`}
        />
      ) : null}
      <div
        hidden
        contentEditable="false"
        suppressContentEditableWarning
        ref={parentRef}
      />
      <Tippy
        className="Draftail-Tooltip"
        visible={visible}
        interactive
        onHide={onHide}
        onClickOutside={onHide}
        onMount={onMount}
        placement={placement}
        maxWidth="100%"
        zIndex={zIndex}
        duration={duration}
        arrow={false}
        appendTo={() => {
          const editor = parentRef.current!.closest<HTMLDivElement>(
            "[data-draftail-editor]",
          );
          const tooltipParent = editor!.querySelector(
            "[data-draftail-tooltip-parent]",
          );
          return tooltipParent as HTMLDivElement;
        }}
        plugins={tippyPlugins}
        content={content}
      >
        {children || (
          <div
            className="Draftail-Tooltip__target"
            style={position || undefined}
          >
            {zeroWidthSpacer}
          </div>
        )}
      </Tippy>
    </>
  );
};

export default Tooltip;
