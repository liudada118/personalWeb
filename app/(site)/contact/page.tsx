import { ContactForm } from "@/components/contact-form";
import { SectionTitle } from "@/components/section-title";
import { VisualEditRegion } from "@/components/visual-edit-region";
import { VisualEditableText } from "@/components/visual-editable-text";
import { getContactPageData } from "@/lib/payload/api";

export const metadata = {
  title: "联系",
};

export default async function ContactPage() {
  const { contactPage } = await getContactPageData();

  return (
    <>
      <section className="section page-masthead">
        <VisualEditRegion adminHref="/cms/admin/globals/contactPage" label="联系页首屏" previewHref="/contact">
          <div className="container">
            <p className="eyebrow">联系</p>
            <h1 className="page-title">
              <VisualEditableText
                adminHref="/cms/admin/globals/contactPage"
                fieldPath="heroTitle"
                globalSlug="contactPage"
                label="Contact hero title"
                multiline
                previewHref="/contact"
                value={contactPage.heroTitle}
              />
            </h1>
            <p className="page-intro">
              <VisualEditableText
                adminHref="/cms/admin/globals/contactPage"
                fieldPath="intro"
                globalSlug="contactPage"
                label="Contact intro"
                multiline
                previewHref="/contact"
                value={contactPage.intro}
              />
            </p>
          </div>
        </VisualEditRegion>
      </section>

      <section className="section">
        <div className="container split-layout">
          <VisualEditRegion adminHref="/cms/admin/globals/contactPage" label="联系表单模块" previewHref="/contact">
            <div>
              <SectionTitle
                eyebrow="联系表单"
                title="请填写信息并简单说明来意。"
                description={
                  <VisualEditableText
                    adminHref="/cms/admin/globals/contactPage"
                    fieldPath="formNote"
                    globalSlug="contactPage"
                    label="Contact form note"
                    multiline
                    previewHref="/contact"
                    value={contactPage.formNote}
                  />
                }
              />
              <ContactForm reasons={contactPage.reasons} />
            </div>
          </VisualEditRegion>

          <VisualEditRegion adminHref="/cms/admin/globals/contactPage" label="订阅与跳转模块" previewHref="/contact">
            <aside className="content-panel">
              <h2>订阅与跳转</h2>
              <p>联系页的辅助说明支持直接在预览里编辑，链接标签也能原位改写。</p>
              <div className="link-cluster vertical">
                {contactPage.subscriptionLinks.map((item, index) => (
                  <a href={item.href} key={`${item.label}-${index}`} rel="noreferrer" target="_blank">
                    <VisualEditableText
                      adminHref="/cms/admin/globals/contactPage"
                      fieldPath={`subscriptionLinks.${index}.label`}
                      globalSlug="contactPage"
                      label={`Contact subscription label ${index + 1}`}
                      previewHref="/contact"
                      value={item.label}
                    />
                  </a>
                ))}
              </div>
            </aside>
          </VisualEditRegion>
        </div>
      </section>
    </>
  );
}
