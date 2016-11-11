import React from 'react';
import ReactDOM from 'react-dom';

const Portal = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        children: React.PropTypes.node,
    },

    componentDidMount() {
        const { id } = this.props;

        let portal = document.getElementById(id);
        if (!portal) {
            portal = document.createElement('div');
            portal.id = id;
            document.body.appendChild(portal);
        }

        this.portal = portal;
        this.componentDidUpdate();
    },

    componentDidUpdate() {
        const { children } = this.props;

        ReactDOM.render((
            <div {...this.props}>
                {children}
            </div>
        ), this.portal);
    },

    componentWillUnmount() {
        document.body.removeChild(this.portal);
    },

    render() {
        return null;
    },
});

export default Portal;
