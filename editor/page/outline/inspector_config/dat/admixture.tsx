/*
 * @Author: kunnisser
 * @Date: 2023-06-01 14:44:58
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-01 15:43:41
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/admixture.tsx
 * @Description: ---- 多对象排列 ----
 */
import { Avatar, List } from "antd";
import React from "react";
const Admixture = (props: any) => {
  const { items } = props;
  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={items}
        renderItem={(item: any, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                />
              }
              title={<a href="https://ant.design">{item.name}</a>}
              description=""
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default Admixture;
