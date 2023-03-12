/*
 * @Author: kunnisser
 * @Date: 2023-03-12 18:15:14
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-12 22:39:43
 * @FilePath: \kunigame\editor\page\outline\inspector_config\dat\pickFolder.tsx
 * @Description: ---- 条件控制的目录 ----
 */
import React, { Component, cloneElement } from 'react';
import cx from 'classnames';
import { FolderProps } from './interface';

export default class PickDatFolder extends Component {


  static defaultProps = {
    className: null,
    style: null,
    title: 'Folder',
    closed: true
  };

  constructor(props) {
    super(props);
    this.state = { closed: props.closed, index: 0 };
  }

  handleClick = () =>
    this.setState((prevState: any) => ({ closed: !prevState.closed }));

  renderChildren(currentIndex: any) {
    // Disable this rule to take title out of the props so nested folders can have unique titles.
    // eslint-disable-next-line no-unused-vars
    const { children, title, ...rest } = this.props as any;

    return React.Children.map(children, child => {
      return (currentIndex === child.props.index || child.props.index === void 0) ? cloneElement(child, { ...rest }) : <></>
    }
    );
  }



  render() {
    const { closed, index } = this.state as any;
    const { title, className, style } = this.props as FolderProps;

    return (
      <li className={cx('folder', { closed }, className)} style={style}>
        <div className="dg">
          <div
            className="title"
            onClick={this.handleClick}
            onKeyPress={this.handleClick}
            role="button"
            tabIndex={index}
          >
            {title}
          </div>
          <div
            className="dg-radio-group"
          >
            <span>
              <label>缩放：</label>
              <input
                type="checkbox"
                checked={index === 0}
                onChange={() => this.setState({ index: 0 })}
              />
            </span>
            <span>
              <label>尺寸：</label>
              <input
                type="checkbox"
                checked={index === 1}
                onChange={() => this.setState({ index: 1 })}
              />
            </span>
          </div>
          <ul>{this.renderChildren(index)}</ul>
        </div>
      </li>
    );
  }
}