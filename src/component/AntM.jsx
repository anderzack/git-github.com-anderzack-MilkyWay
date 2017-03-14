import './AntM.less';
import React from 'react';

const App = React.createClass(
  {
    propTypes: {
      children: React.PropTypes.any
    },

    render() {
      const children = this.props.children;

      return (
        <div id="antm-main">{children}</div>
      );
    }
  }
);

export default App;
