interface PageTitleProps {
  title: string;
  subtitle?: string;
}

function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="mb-4">
      <h2 className="mb-1">{title}</h2>
      {subtitle ? <p className="text-muted mb-0">{subtitle}</p> : null}
    </div>
  );
}

export default PageTitle;
