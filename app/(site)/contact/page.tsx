import { ContactForm } from "@/components/contact-form";
import { EditorialPageHero } from "@/components/editorial-page-hero";
import { VisualEditRegion } from "@/components/visual-edit-region";
import { getContactPageData } from "@/lib/payload/api";

export const metadata = {
  title: "联系",
};

export default async function ContactPage() {
  const { settings, contactPage } = await getContactPageData();

  return (
    <>
      <VisualEditRegion adminHref="/cms/admin/globals/contactPage" label="联系页首屏" previewHref="/contact">
        <EditorialPageHero
          eyebrow="Contact"
          title={contactPage.heroTitle}
          intro={contactPage.intro}
          aside={
            <div className="editorial-page-hero-note">
              <span>Direct contact</span>
              <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
              <a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a>
              <p>{settings.address}</p>
            </div>
          }
        />
      </VisualEditRegion>

      <section className="editorial-section">
        <div className="container editorial-split-grid">
          <VisualEditRegion adminHref="/cms/admin/globals/contactPage" label="联系表单区" previewHref="/contact">
            <div className="editorial-stack-panel">
              <div className="editorial-section-copy compact">
                <p className="editorial-eyebrow">Inquiry</p>
                <h2>请填写基本信息，并简要说明来意与当前问题。</h2>
                <p>{contactPage.formNote}</p>
              </div>
              <ContactForm reasons={contactPage.reasons} />
            </div>
          </VisualEditRegion>

          <VisualEditRegion adminHref="/cms/admin/globals/contactPage" label="联系页订阅区" previewHref="/contact">
            <div className="editorial-stack-panel contrast">
              <div className="editorial-section-copy compact">
                <p className="editorial-eyebrow">Subscribe & follow</p>
                <h2>如果你想先了解更多内容，可以从官网、公众号与媒体平台继续阅读。</h2>
              </div>
              <div className="editorial-link-column">
                {contactPage.subscriptionLinks.map((item) => (
                  <a href={item.href} key={item.label} rel="noreferrer" target="_blank">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </VisualEditRegion>
        </div>
      </section>
    </>
  );
}