import React from 'react'
import {RouteComponentProps} from 'react-router'

const style = require('./index.scss');

export default class Container extends React.Component<{} & RouteComponentProps<{}>, {}> {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div>123</div>
    )
  }
}
