/*
 * @Author: kunnisser
 * @Date: 2023-06-30 16:44:49
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-08 01:17:23
 * @FilePath: \kunigame\editor\page\outline\inspector_config\tween\index.tsx
 * @Description: ---- 缓动配置 ----
 */
import React from "react";
import DatGui from "react-dat-gui";
import { DatProperties } from "../config";
import { DatTweenPropertyConfig, DatScaleTweenPropertyConfig } from "./config";
import { useDispatch, useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import * as _ from "lodash";
import { setTweenGameItem } from "editor@/common/gameStore/scene/action";

// let originTarget: any = null;
const TweenDatGui = () => {
  const dispatch = useDispatch();

  // const [scaleTweenItem, setScaleTweenItem] = useState({
  //   scale: { x: 1, y: 1 },
  //   scaleloop: false,
  //   repeat: 0,
  //   delay: 0,
  //   duration: 1,
  //   yoyo: false,
  //   ease: "linear",
  //   inout: "easeNone",
  //   progress: 0
  // });
  const defaultTween = useSelector(
    (store: CombineReducer) => store.sceneReducer.defaultTween
  );
  const vars = useSelector(
    (store: CombineReducer) => store.sceneReducer.tweenGameItems
  );

  // useEffect(() => {
  //   console.log("tween's obj changed");
  //   if (targets) {
  //     console.log(ref.current.defaultTween);
  //     [originTarget] = _.cloneDeep(targets);
  //   }
  // }, [targets]);

  const handleUpdate = (tweenVars: any) => {
    // const tween = ref.current.tween;
    // ref.current.defaultTween && ref.current.defaultTween.pause().kill();

    // debounce.handler(() => {}, 500);

    // // 初始对象属性
    // const originVars = {
    //   x: originTarget.x,
    //   y: originTarget.y,
    //   alpha: originTarget.alpha,
    //   angle: originTarget.angle
    // };

    //   ref.current.defaultTween = tween.instance.to(targets, duration, {
    //     startAt: originVars,
    //     x: "+=" + x,
    //     y: "+=" + y,
    //     angle: "+=" + angle,
    //     alpha: alpha || originTarget.alpha,
    //     paused: true,
    //     delay,
    //     yoyo,
    //     repeat,
    //     ease: tween[ease][inout],
    //     onComplete: () => {
    //       loop &&
    //         ref.current.defaultTween &&
    //         ref.current.defaultTween.seek(0).restart(true);
    //     }
    //   });
    // ref.current.defaultTween &&
    //   ref.current.defaultTween.progress(tweenInfo.progress);
    dispatch(setTweenGameItem(tweenVars));
    // setTweenItem(tweenInfo);
  };

  // const handleScaleUpdate = (tweenInfo: any) => {
  //   const tween = ref.current.tween;
  //   ref.current.scaleTween && ref.current.scaleTween.pause().kill();

  //   debounce.handler(() => {
  //     const { duration, scale, scaleloop, yoyo, repeat, ease, inout, delay } =
  //       tweenInfo;

  //     // 初始对象缩放
  //     const originScaleVars = {
  //       x: originTarget.scale.x,
  //       y: originTarget.scale.y
  //     };

  //     ref.current.scaleTween = tween.instance.to(targets[0].scale, duration, {
  //       startAt: originScaleVars,
  //       x: originScaleVars.x * scale.x,
  //       y: originScaleVars.y * scale.y,
  //       paused: true,
  //       delay,
  //       yoyo,
  //       repeat,
  //       ease: tween[ease][inout],
  //       onComplete: () => {
  //         scaleloop &&
  //           ref.current.scaleTween &&
  //           ref.current.scaleTween.seek(0).restart(true);
  //       }
  //     });
  //   }, 500);
  //   ref.current.scaleTween &&
  //     ref.current.scaleTween.progress(tweenInfo.progress);
  //   setScaleTweenItem(tweenInfo);
  // };

  const generateConfigCard = (configs: any, key: string) => {
    const itemConfigs: Array<DatProperties> = configs;
    return itemConfigs.map((config: DatProperties) => {
      if (config.children) {
        const { component: Folder, label, ...props } = config;
        return (
          <Folder
            key={`${key}_${label}`}
            title={label}
            {...props}
            closed={false}
          >
            {generateConfigCard(config.children, key)}
          </Folder>
        );
      } else {
        const { component: DatItem, label, path, ...props } = config;
        const paths = path ? path.join(".") : "";
        return (
          <DatItem
            key={`${key}_${label}_${paths}`}
            path={paths}
            label={label}
            {...props}
          ></DatItem>
        );
      }
    });
  };
  return vars ? (
    <div>
      <DatGui data={vars} onUpdate={handleUpdate}>
        {generateConfigCard(
          DatTweenPropertyConfig(defaultTween),
          "default-tween"
        )}
      </DatGui>
      {/* <DatGui data={scaleTweenItem} onUpdate={handleScaleUpdate}>
        {generateConfigCard(DatScaleTweenPropertyConfig(ref), "scale-tween")}
      </DatGui> */}
    </div>
  ) : (
    <>先选择缓动对象</>
  );
};

export default TweenDatGui;
