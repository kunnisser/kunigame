/*
 * @Author: kunnisser
 * @Date: 2023-03-17 14:08:31
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-17 09:29:59
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/modal/imagePicker.tsx
 * @Description: ---- 图片选择 ----
 */
import { Space } from "antd";
import React, { useContext } from "react";
import { WrapContext } from "editor@/page/wireboard";
const ModalImagePicker = (props: any) => {
  const { images, changeTextureKey, pickValue } = props;
  const { closeModal }: any = useContext(WrapContext);

  return (
    <Space wrap key={"modal-images-picker"}>
      {images.map((image) => {
        return (
          <div
            className={
              image.key === pickValue ? "texture-active" : "texture-unactive"
            }
            key={image.key}
            onClick={() => {
              closeModal();
              changeTextureKey(image.key);
            }}
          >
            <div className="kn-image-thumb">
              <img src={image.url}></img>
            </div>
            <p
              style={{
                textAlign: "center",
                fontWeight: "bold",
                margin: 0,
                lineHeight: "30px"
              }}
            >
              {image.key}
            </p>
          </div>
        );
      })}
    </Space>
  );
};
export default ModalImagePicker;
