/*
 * @Author: kunnisser
 * @Date: 2023-06-01 14:44:58
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-02 16:01:51
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/admixture.tsx
 * @Description: ---- 多对象排列 ----
 */
import { Avatar, Input, List } from "antd";
import React from "react";
// import { ReactComponent as TextIcon } from "editor@/assets/icon/text.svg";
// import { ReactComponent as SpriteIcon } from "editor@/assets/icon/sprite.svg";
// import { ReactComponent as GroupIcon } from "editor@/assets/icon/group.svg";
// import { ReactComponent as GraphicsIcon } from "editor@/assets/icon/graphics.svg";
const Admixture = (props: any) => {
  const { items } = props;
  return (
    <>
      <div>
        <label>X轴偏移</label> <Input type="number" size="small"></Input>
      </div>
      <div>
        <label>Y轴偏移</label> <Input type="number" size="small"></Input>
      </div>
      <div>横向对齐</div>
      <div>纵向对齐</div>
      <List
        itemLayout="horizontal"
        dataSource={items || []}
        renderItem={(item: any, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                />
              }
              title={<a href="https://ant.design">{item.name}</a>}
              description={item.constructor.name}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default Admixture;
