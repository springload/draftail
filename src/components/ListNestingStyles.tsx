import { getListNestingStyles } from "draftjs-conductor";
import React from "react";

interface ListNestingStylesProps {
  max: number;
}

/**
 * Generates CSS styles for list items, for a given depth.
 * @param {number} max
 */
function Styles({ max }: ListNestingStylesProps) {
  return <style>{getListNestingStyles(max)}</style>;
}

const ListNestingStyles = React.memo(Styles);

export default ListNestingStyles;
