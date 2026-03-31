import type { EditablePageDefinition } from "./types";

export const contactPageDefinition: EditablePageDefinition = {
  id: "contactPage",
  title: "联系页",
  route: "/contact",
  description: "用于编辑联系页首屏、表单说明和订阅跳转入口。",
  fields: [
    {
      key: "contactPage.header.title",
      label: "页面标题",
      page: "contactPage",
      section: "Header",
      type: "textarea",
      defaultValue: "想联系我，请先简单介绍来意。",
    },
    {
      key: "contactPage.header.intro",
      label: "页面导语",
      page: "contactPage",
      section: "Header",
      type: "richtext",
      defaultValue: "联系页保持简洁、正式，并把订阅与外部站点入口组织成稳定的尾部动作。",
    },
    {
      key: "contactPage.form.note",
      label: "表单说明",
      page: "contactPage",
      section: "Form",
      type: "textarea",
      defaultValue: "表单收集姓名、机构、联系方式、咨询方向和来意描述。",
    },
    {
      key: "contactPage.form.showReasonOptions",
      label: "显示来意选项",
      page: "contactPage",
      section: "Form",
      type: "boolean",
      defaultValue: true,
    },
    {
      key: "contactPage.subscriptions.primaryLink",
      label: "主订阅链接",
      page: "contactPage",
      section: "Subscriptions",
      type: "link",
      defaultValue: {
        label: "访问虎诉官网",
        href: "https://example.com/husu",
      },
    },
  ],
};
