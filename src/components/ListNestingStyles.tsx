import { getListNestingStyles } from "draftjs-conductor";
import React from "react";

interface ListNestingStylesProps {
  max?: number;
}

/**
 * Generates CSS styles for list items, for a given depth.
 */
function Styles({ max }: ListNestingStylesProps) {
  return max ? <style>{getListNestingStyles(max)}</style> : null;
}

const ListNestingStyles = React.memo(Styles);

export default ListNestingStyles;
