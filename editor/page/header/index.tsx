/*
 * @Author: kunnisser
 * @Date: 2021-01-25 16:00:13
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-03-08 23:38:14
 * @FilePath: \kunigame\editor\page\header\index.tsx
 * @Description: ---- KN编辑器菜单 ----
 */

import React, { useContext, useState } from 'react';
import { Button, Space, Form, Card, Input, Tooltip } from 'antd';
import { PlusCircleOutlined, PlayCircleOutlined, UnorderedListOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import { WrapContext } from 'editor@/page/wireboard';
import { ModalOptions } from 'editor@/feedback/modalcore';
import FormCore from 'editor@/feedback/formcore';
import createGameConfig from './gameBaseConfig/createGameConfig';
import { changeProject, createNewProject, getProjectList } from 'editor@/api/request/project';

const { Meta } = Card;

const KnHeader = () => {
  const commonContext: any = useContext(WrapContext);
  const { openModal, closeModal, openChildModal, closeChildModal } = commonContext;
  const [createGameForm] = Form.useForm();
  const [listLoading, setListLoading] = useState(false);
  const resetForm = () => {
    createGameForm.resetFields();
  }
  const submitForm = () => {
    createGameForm.submit();
  }
  const onSubmit = (params): void => {
    createNewProject(params).then(() => {
      resetForm();
      closeModal();
    });
  }
  const createProjectFile = () => {
    openModal({
      width: 600,
      name: "新建游戏项目",
      content: <React.Fragment>
        <FormCore form={createGameForm} {...createGameConfig} submit={onSubmit}></FormCore>
      </React.Fragment>,
      footer: [
        <Button key="back" onClick={resetForm}>
          重置
      </Button>,
        <Button key="submit" type="primary" onClick={submitForm}>
          创建
      </Button>,
      ]
    } as ModalOptions);
  };

  const showProjectList = () => {
    setListLoading(true);
    getProjectList().then((ret) => {
      if (ret.data.status === 'success') {
        openModal({
          width: 600,
          name: "项目总览",
          content: <React.Fragment>
            {ret?.data?.data.map((project: any) => {
              return <Card loading={listLoading}
                key={`${project}_card`}
                actions={[
                  <Tooltip title="启用项目">
                    <PlayCircleOutlined key={`${project}_booting`} onClick={() => useProject(project)} />
                  </Tooltip>,
                  <Tooltip title="设置项目">
                    <SettingOutlined key={`${project}_setting`} onClick={() => useProject(project)} />
                  </Tooltip>,
                  <Tooltip title="删除项目">
                    <DeleteOutlined key={`${project}_delete`} onClick={() => confirmProject(project)} />
                  </Tooltip>
                ]}>
                <Meta
                  title={project}
                  description="This is the description"
                />
              </Card>;
            })
            }
          </React.Fragment >,
          footer: null
        } as ModalOptions);
      }
      setListLoading(false);
    });
  }

  // 删除项目
  const confirmProject = (projectName) => {
    let editProjectName = '';
    const deleteProject = () => {
      console.log(projectName);
      console.log(editProjectName);
      closeChildModal();
    };
    openChildModal({
      width: 600,
      name: "请输入项目名确认删除",
      content: <React.Fragment>
        <Input type="text" onChange={(e) => { editProjectName = e.target.value; }} placeholder="请输入项目名" onPressEnter={deleteProject}></Input>
      </React.Fragment>,
      footer: [
        <Button key="submit" type="primary" onClick={deleteProject}>
          确认删除
        </Button>]
    } as ModalOptions);
  }

  // 启用项目
  const useProject = (projectName) => {
    changeProject({ projectName }).then((ret) => {
      if (ret.data.status === 'success') {
        closeModal();
      }
    });
  };
  return <React.Fragment>
    <Space>
      <Button ghost icon={<PlusCircleOutlined />} key="addProject" onClick={createProjectFile}>创建项目</Button>
      <Button ghost icon={<UnorderedListOutlined />} key="projectList" onClick={showProjectList} loading={listLoading}>项目列表</Button>
      <Button ghost icon={<PlayCircleOutlined />} key="play">播放</Button>
    </Space>
  </React.Fragment>
}

export default KnHeader;