import './utils/polyfills';
import DraftailEditor from './components/DraftailEditor';
import Icon from './components/Icon';
import DraftUtils from './api/DraftUtils';
import { BLOCK_TYPE, ENTITY_TYPE, INLINE_STYLE } from './api/constants';

import './index.scss';

/**
 * Draftail's main API entry point. Exposes all of the modules people
 * will need to create their own editor instances from Draftail.
 */

export default DraftailEditor;

export {
    DraftUtils,
    BLOCK_TYPE,
    ENTITY_TYPE,
    INLINE_STYLE,
    Icon,
};
