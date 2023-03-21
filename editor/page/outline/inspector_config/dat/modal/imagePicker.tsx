/*
 * @Author: kunnisser
 * @Date: 2023-03-17 14:08:31
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-21 22:28:30
 * @FilePath: \kunigame\editor\page\outline\inspector_config\dat\modal\imagePicker.tsx
 * @Description: ---- 图片选择 ----
 */
import { Space } from "antd";
import React, {
  useContext,
} from "react";
import { TextureContext } from "./pickerWrapper";
const ModalImagePicker = (props: any) => {
  const { images, game } = props;
  const { pickValue, setPickValue }: any = useContext(TextureContext);

  return (
    <Space wrap key={"modal-images-picker"}>
      {images.map((image) => {
        return (
          <div
            className={
              image.key === pickValue.textureCacheIds[0]
                ? "texture-active"
                : "texture-unactive"
            }
            key={image.key}
            onClick={() => {
              const texture = game.add.texture(image.key);
              setPickValue(texture);
            }}
          >
            <div className="kn-image-thumb">
              <img src={image.url}></img>
            </div>
            <p style={{ textAlign: "center", fontWeight: 'bold' }}>{image.key}</p>
          </div>
        );
      })}
    </Space>
  );
};
export default ModalImagePicker;
