import ImageBlock from './blocks/ImageBlock';
import EmbedBlock from './blocks/EmbedBlock';
import NullBlock from './blocks/NullBlock';

const TYPE_MAP = {
    WAGTAIL_IMAGE: ImageBlock,
    WAGTAIL_EMBED: EmbedBlock,
};

export default {
    getEntityComponent(type, _default = NullBlock) {
        return TYPE_MAP[type] || _default;
    },
};

export const MAX_LIST_NESTING = 3;
export const STATE_SAVE_INTERVAL = 250;
