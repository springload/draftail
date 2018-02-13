import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { DRAFT_MAX_DEPTH } from '../api/constants';

import behavior from '../api/behavior';

/**
 * Dynamically generates the right list nesting styles.
 * Pure component - will only re-render when `max` changes (eg. never).
 */
class ListNesting extends PureComponent {
    render() {
        const { max } = this.props;

        return max > DRAFT_MAX_DEPTH ? (
            <style>{behavior.generateListNestingStyles(max)}</style>
        ) : null;
    }
}

ListNesting.propTypes = {
    max: PropTypes.number.isRequired,
};

export default ListNesting;
