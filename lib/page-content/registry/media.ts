import type { EditablePageDefinition } from "./types";

export const mediaPageDefinition: EditablePageDefinition = {
  id: "mediaPage",
  title: "媒体页",
  route: "/media",
  description: "用于编辑媒体页的静态头部说明，媒体条目本身仍由 Payload collection 管理。",
  fields: [
    {
      key: "mediaPage.header.title",
      label: "页面标题",
      page: "mediaPage",
      section: "Header",
      type: "textarea",
      defaultValue: "把代表媒体内容集中展示，并给每一篇足够的说明空间。",
    },
    {
      key: "mediaPage.header.intro",
      label: "页面导语",
      page: "mediaPage",
      section: "Header",
      type: "richtext",
      defaultValue: "媒体页负责静态导语与页面语境，具体媒体内容列表继续交给 Payload collections。",
    },
    {
      key: "mediaPage.header.coverImage",
      label: "页面头图",
      page: "mediaPage",
      section: "Header",
      type: "image",
      defaultValue: {
        mediaId: "media-header-placeholder",
        alt: "Media page header image",
      },
    },
  ],
};
