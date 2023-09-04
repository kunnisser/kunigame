/*
 * @Author: kunnisser
 * @Date: 2021-01-25 16:00:13
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-04 10:19:30
 * @FilePath: /kunigame/editor/page/header/index.tsx
 * @Description: ---- KN编辑器菜单 ----
 */

import React, { useContext, useState } from "react";
import { Button, Space, Form, Card, Tooltip, message } from "antd";
import {
  PlayCircleOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  DeleteOutlined,
  AppstoreAddOutlined
} from "@ant-design/icons";
import { WrapContext } from "editor@/page/wireboard";
import { ModalOptions } from "editor@/feedback/modalcore";
import FormCore from "editor@/feedback/formcore";
import createGameConfig from "./gameBaseConfig/createGameConfig";
import {
  changeProject,
  createNewProject,
  editProject,
  getProjectList,
  removeProject
} from "editor@/api/request/project";
import editGameConfig from "./gameBaseConfig/editGameConfig";
import deleteGameConfig from "./gameBaseConfig/deleteGameConfig";
import { setCurrentProject, getCurrentProject } from "editor@/storage";

const { Meta } = Card;

const KnHeader = () => {
  const commonContext: any = useContext(WrapContext);
  const { openModal, closeModal, openChildModal, closeChildModal } =
    commonContext;
  const [createGameForm] = Form.useForm();
  const [editGameForm] = Form.useForm();
  const [deleteGameForm] = Form.useForm();
  const [listLoading, setListLoading] = useState(false);

  // 新建项目
  const createProjectFile = () => {
    const resetForm = () => {
      createGameForm.resetFields();
    };
    const submitForm = () => {
      createGameForm.submit();
    };
    const onSubmit = (params): void => {
      if (params.projectName === "kuni") {
        message.error("当前名称不可用");
        return;
      }
      createNewProject(params).then(() => {
        setCurrentProject(params.projectName);
        resetForm();
        closeModal();
      });
    };
    openModal({
      width: 600,
      name: "新建游戏项目",
      content: (
        <React.Fragment>
          <FormCore
            form={createGameForm}
            {...createGameConfig}
            submit={onSubmit}
          ></FormCore>
        </React.Fragment>
      ),
      footer: [
        <Button key="back" onClick={resetForm}>
          重置
        </Button>,
        <Button key="submit" type="primary" onClick={submitForm}>
          创建
        </Button>
      ]
    } as ModalOptions);
  };

  // 显示项目列表
  const showProjectList = () => {
    setListLoading(true);
    getProjectList().then((ret) => {
      if (ret.data.status === "success") {
        if (ret?.data?.data.length > 0) {
          openModal({
            width: 600,
            name: "项目总览",
            content: (
              <React.Fragment>
                {ret?.data?.data.map((project: any) => {
                  return (
                    <Card
                      loading={listLoading}
                      key={`${project}_card`}
                      actions={[
                        <Tooltip title="启用项目">
                          <PlayCircleOutlined
                            key={`${project}_booting`}
                            onClick={() => useProject(project)}
                          />
                        </Tooltip>,
                        <Tooltip title="设置项目">
                          <SettingOutlined
                            key={`${project}_setting`}
                            onClick={() => settingProject(project)}
                          />
                        </Tooltip>,
                        <Tooltip title="删除项目">
                          <DeleteOutlined
                            key={`${project}_delete`}
                            onClick={() => confirmDeleteProject(project)}
                          />
                        </Tooltip>
                      ]}
                    >
                      <Meta
                        title={project}
                        description="This is the description"
                      />
                    </Card>
                  );
                })}
              </React.Fragment>
            ),
            footer: null
          } as ModalOptions);
        } else {
          message.info("项目列表为空");
        }
      }
      setListLoading(false);
    });
  };

  // 设置项目
  const settingProject = (projectName) => {
    const editPickedProject = () => {
      editGameForm.submit();
    };
    const onEditGameForm = (param) => {
      editProject({ projectName, ...param }).then((ret) => {
        if (ret.data.status === "success") {
          closeChildModal();
          closeModal();
          editGameForm.resetFields();
        }
      });
      closeChildModal();
    };
    openChildModal({
      width: 600,
      name: "项目设置",
      content: (
        <React.Fragment>
          <FormCore
            form={editGameForm}
            {...editGameConfig}
            submit={onEditGameForm}
          ></FormCore>
        </React.Fragment>
      ),
      footer: [
        <Button key="submit" type="primary" onClick={editPickedProject}>
          提交修改
        </Button>
      ]
    } as ModalOptions);
  };

  // 删除项目
  const confirmDeleteProject = (projectName: string) => {
    const onDeleteGameForm = async (param) => {
      if (param.projectName === projectName) {
        try {
          await removeProject({
            projectName: projectName,
            currentProjectName: getCurrentProject()
          });
        } catch (e) {
          message.warning(e);
        }
        closeChildModal();
        closeModal();
        deleteGameForm.resetFields();
      } else {
        message.warning("请输入对应的项目名称");
      }
    };
    const deleteProject = () => {
      deleteGameForm.submit();
    };
    openChildModal({
      width: 600,
      name: "请输入项目名确认删除",
      content: (
        <React.Fragment>
          <FormCore
            form={deleteGameForm}
            {...deleteGameConfig}
            submit={onDeleteGameForm}
          ></FormCore>
        </React.Fragment>
      ),
      footer: [
        <Button key="submit" type="primary" onClick={deleteProject}>
          确认删除
        </Button>
      ]
    } as ModalOptions);
  };

  // 启用项目
  const useProject = (projectName) => {
    changeProject({ projectName }).then((ret) => {
      if (ret.data.status === "success") {
        closeModal();
        setCurrentProject(projectName);
      }
    });
  };

  // 预览项目
  const showPreviewGame = () => {
    window.open("./editor/demo.html", "_blank");
  };
  return (
    <React.Fragment>
      <Space>
        <Tooltip placement="bottom" title="新建游戏">
          <Button
            icon={<AppstoreAddOutlined />}
            key="addProject"
            onClick={createProjectFile}
          />
        </Tooltip>
        <Tooltip placement="bottom" title="查看游戏列表">
          <Button
            icon={<UnorderedListOutlined />}
            key="projectList"
            onClick={showProjectList}
            loading={listLoading}
          />
        </Tooltip>
        <Tooltip placement="bottom" title="预览游戏">
          <Button
            icon={<PlayCircleOutlined />}
            onClick={showPreviewGame}
            key="play"
          />
        </Tooltip>
      </Space>
    </React.Fragment>
  );
};

export default KnHeader;
