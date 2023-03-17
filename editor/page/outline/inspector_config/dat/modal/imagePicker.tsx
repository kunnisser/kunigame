/*
 * @Author: kunnisser
 * @Date: 2023-03-17 14:08:31
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-17 17:48:13
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/modal/imagePicker.tsx
 * @Description: ---- 图片选择 ----
 */
import { Space } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState
} from "react";
const ModalImagePicker = forwardRef((props: any, ref: any) => {
  const { images, game, defaultVal } = props;
  const [pickValue, setPickValue] = useState(defaultVal);
  const [flag, setFlag] = useState(false);
  useImperativeHandle(ref, () => ({
    pickValue,
    setPickValue
  }));

  useMemo(() => {
    flag || setPickValue(defaultVal);
  }, [ref.current.update]);

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
              setFlag(true);
              console.log("123");
              setPickValue(texture);
            }}
          >
            <div className="kn-image-thumb">
              <img src={image.url}></img>
            </div>
            <p style={{ textAlign: "center" }}>{image.key}</p>
          </div>
        );
      })}
    </Space>
  );
});
export default ModalImagePicker;
