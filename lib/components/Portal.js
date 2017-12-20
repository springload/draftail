import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Portal extends Component {
    constructor(props) {
        super(props);

        this.onClickDocument = this.onClickDocument.bind(this);
    }

    onClickDocument(e) {
        const { onClose } = this.props;
        const shouldClose =
            this.portal &&
            e.target !== this.portal &&
            !this.portal.contains(e.target);

        if (shouldClose) {
            onClose();
        }
    }

    componentDidMount() {
        const { onClose, clickOutsideClose, resizeClose } = this.props;

        if (!this.portal) {
            this.portal = document.createElement('div');
            document.body.appendChild(this.portal);

            if (onClose) {
                if (clickOutsideClose) {
                    document.addEventListener('mouseup', this.onClickDocument);
                }

                if (resizeClose) {
                    window.addEventListener('resize', onClose);
                }
            }
        }

        this.componentDidUpdate();
    }

    componentDidUpdate() {
        const { children } = this.props;

        ReactDOM.render(<div>{children}</div>, this.portal);
    }

    componentWillUnmount() {
        const { onClose, clickOutsideClose, resizeClose } = this.props;

        document.body.removeChild(this.portal);

        if (onClose) {
            if (clickOutsideClose) {
                document.removeEventListener('mouseup', this.onClickDocument);
            }

            if (resizeClose) {
                window.removeEventListener('resize', onClose);
            }
        }
    }

    render() {
        return null;
    }
}

Portal.propTypes = {
    onClose: PropTypes.func,
    children: PropTypes.node,
    clickOutsideClose: PropTypes.bool,
    resizeClose: PropTypes.bool,
};

Portal.defaultProps = {
    onClose: null,
    children: null,
    clickOutsideClose: false,
    resizeClose: false,
};

export default Portal;
