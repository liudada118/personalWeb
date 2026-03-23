import Link from "next/link";

export const metadata = {
  title: "CMS",
};

export default function CmsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="cms-shell">
      <header className="cms-header">
        <div className="container cms-header-inner">
          <div>
            <p className="eyebrow">CMS</p>
            <h1 className="cms-title">Tiger Legal 后台</h1>
            <p className="cms-header-note">日常编辑建议直接进入“内容工作台”，只有高级操作再进入原生后台。</p>
          </div>
          <nav className="cms-nav">
            <Link href="/cms">管理总台</Link>
            <Link href="/cms/admin/workbench">内容工作台</Link>
            <Link href="/cms/files">素材文件</Link>
            <Link href="/cms/admin">高级管理</Link>
          </nav>
        </div>
      </header>
      <main className="cms-body">{children}</main>
    </div>
  );
}
