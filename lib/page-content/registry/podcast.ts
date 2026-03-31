import type { EditablePageDefinition } from "./types";

export const podcastPageDefinition: EditablePageDefinition = {
  id: "podcastPage",
  title: "播客页",
  route: "/podcast",
  description: "用于编辑播客栏目的静态介绍和订阅区开关，单集内容仍由 Payload collection 管理。",
  fields: [
    {
      key: "podcastPage.header.title",
      label: "页面标题",
      page: "podcastPage",
      section: "Header",
      type: "text",
      defaultValue: "Tiger Legal Talks",
    },
    {
      key: "podcastPage.header.intro",
      label: "页面导语",
      page: "podcastPage",
      section: "Header",
      type: "richtext",
      defaultValue: "播客页单独介绍节目定位、平台入口和栏目价值，而不是把播客混在媒体页里。",
    },
    {
      key: "podcastPage.header.showPlatformLinks",
      label: "显示订阅入口",
      page: "podcastPage",
      section: "Settings",
      type: "boolean",
      defaultValue: true,
    },
  ],
};
