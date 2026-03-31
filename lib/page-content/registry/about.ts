import type { EditablePageDefinition } from "./types";

export const aboutPageDefinition: EditablePageDefinition = {
  id: "about",
  title: "关于页",
  route: "/about",
  description: "用于编辑个人简介、虎诉介绍和静态说明块。",
  fields: [
    {
      key: "about.hero.title",
      label: "首屏标题",
      page: "about",
      section: "Header",
      type: "textarea",
      defaultValue: "律师简历、虎诉介绍、新媒体矩阵与获奖信息。",
    },
    {
      key: "about.intro.body",
      label: "页面导语",
      page: "about",
      section: "Header",
      type: "richtext",
      defaultValue: "关于页承接人物信息、方法论和公开资历，让访问者快速理解人物定位和内容体系。",
    },
    {
      key: "about.husu.title",
      label: "虎诉模块标题",
      page: "about",
      section: "Sections",
      type: "text",
      defaultValue: "虎诉介绍",
    },
    {
      key: "about.husu.body",
      label: "虎诉模块正文",
      page: "about",
      section: "Sections",
      type: "richtext",
      defaultValue: "虎诉官网不是单纯的资料页，而是整个内容体系的中心叙事界面。",
    },
    {
      key: "about.media.title",
      label: "新媒体模块标题",
      page: "about",
      section: "Sections",
      type: "text",
      defaultValue: "新媒体简介",
    },
    {
      key: "about.media.body",
      label: "新媒体模块正文",
      page: "about",
      section: "Sections",
      type: "richtext",
      defaultValue: "平台是分发入口，官网负责沉淀、归档与统一表达。",
    },
  ],
};
