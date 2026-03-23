import { ContactForm } from "@/components/contact-form";
import { SectionTitle } from "@/components/section-title";
import { getContactPageData } from "@/lib/payload/api";

export const metadata = {
  title: "联系",
};

export default async function ContactPage() {
  const { contactPage } = await getContactPageData();

  return (
    <>
      <section className="section page-masthead">
        <div className="container">
          <p className="eyebrow">联系</p>
          <h1 className="page-title">{contactPage.heroTitle}</h1>
          <p className="page-intro">{contactPage.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="container split-layout">
          <div>
            <SectionTitle eyebrow="联系表单" title="请填写信息并简单说明来意。" description={contactPage.formNote} />
            <ContactForm reasons={contactPage.reasons} />
          </div>
          <aside className="content-panel">
            <h2>订阅与跳转</h2>
            <p>联系页也会再次放置虎诉官网和媒体矩阵订阅入口，方便用户在发起联系前先了解更多内容。</p>
            <div className="link-cluster vertical">
              {contactPage.subscriptionLinks.map((item) => (
                <a href={item.href} key={item.label} rel="noreferrer" target="_blank">
                  {item.label}
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
