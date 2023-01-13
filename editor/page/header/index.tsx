/*
 * @Author: kunnisser
 * @Date: 2021-01-25 16:00:13
 * @LastEditors: kunnisser
 * @LastEditTime: 2022-09-08 16:03:59
 * @FilePath: /kunigame/editor/page/header/index.tsx
 * @Description: ---- KN编辑器菜单 ----
 */

import React, { useContext, useState } from "react";
import { Button, Space, Form, Card, Tooltip } from "antd";
import {
  PlusCircleOutlined,
  PlayCircleOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { WrapContext } from "editor@/page/wireboard";
import { ModalOptions } from "editor@/feedback/modalcore";
import FormCore from "editor@/feedback/formcore";
import createGameConfig from "./gameBaseConfig/createGameConfig";
import {
  changeProject,
  createNewProject,
  getProjectList
} from "editor@/api/request/project";
import editGameConfig from "./gameBaseConfig/editGameConfig";
import deleteGameConfig from "./gameBaseConfig/deleteGameConfig";

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
      createNewProject(params).then(() => {
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
                          onClick={() => confirmProject(project)}
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
      }
      setListLoading(false);
    });
  };

  // 设置项目
  const settingProject = (projectName) => {
    const editProject = () => {
      editGameForm.submit();
    };
    const onEditGameForm = (param) => {
      console.log(param);
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
        <Button key="submit" type="primary" onClick={editProject}>
          提交修改
        </Button>
      ]
    } as ModalOptions);
  };

  // 删除项目
  const confirmProject = (projectName) => {
    const onDeleteGameForm = (param) => {
      console.log(param.projectName);
      console.log(projectName);
      closeChildModal();
      deleteGameForm.resetFields();
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
      }
    });
  };
  return (
    <React.Fragment>
      <Space>
        <Button
          icon={<PlusCircleOutlined />}
          key="addProject"
          onClick={createProjectFile}
        >
          创建项目
        </Button>
        <Button
          icon={<UnorderedListOutlined />}
          key="projectList"
          onClick={showProjectList}
          loading={listLoading}
        >
          项目列表
        </Button>
        <Button icon={<PlayCircleOutlined />} key="play">
          播放
        </Button>
      </Space>
    </React.Fragment>
  );
};

export default KnHeader;
