import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Portal extends Component {
    constructor(props) {
        super(props);

        this.onClickDocument = this.onClickDocument.bind(this);
    }

    onClickDocument(e) {
        const { clickOutsideClose } = this.props;
        const shouldClose =
            this.portal &&
            e.target !== this.portal &&
            !this.portal.contains(e.target);

        if (shouldClose) {
            clickOutsideClose();
        }
    }

    componentDidMount() {
        const { clickOutsideClose } = this.props;

        if (!this.portal) {
            this.portal = document.createElement('div');
            document.body.appendChild(this.portal);

            if (clickOutsideClose) {
                document.addEventListener('mouseup', this.onClickDocument);
            }
        }

        this.componentDidUpdate();
    }

    componentDidUpdate() {
        const { children } = this.props;

        ReactDOM.render(<div>{children}</div>, this.portal);
    }

    componentWillUnmount() {
        const { clickOutsideClose } = this.props;

        document.body.removeChild(this.portal);

        if (clickOutsideClose) {
            document.removeEventListener('mouseup', this.onClickDocument);
        }
    }

    render() {
        return null;
    }
}

Portal.propTypes = {
    clickOutsideClose: PropTypes.func,
    children: PropTypes.node,
};

Portal.defaultProps = {
    clickOutsideClose: null,
    children: null,
};

export default Portal;
