import React from 'react';
import ReactDOM from 'react-dom';

class Portal extends React.Component {
    componentDidMount() {
        if (!this.portal) {
            this.portal = document.createElement('div');
            document.body.appendChild(this.portal);
        }

        this.componentDidUpdate();
    }

    componentDidUpdate() {
        const { children } = this.props;

        ReactDOM.render((
            <div {...this.props}>
                {children}
            </div>
        ), this.portal);
    }

    componentWillUnmount() {
        document.body.removeChild(this.portal);
    }

    render() {
        return null;
    }
}

Portal.propTypes = {
    children: React.PropTypes.node,
};

Portal.defaultProps = {
    children: null,
};

export default Portal;
