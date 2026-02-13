export const Section = ({ title, children, ...rest }: any) => (
  <section className="mt-4 mb-4" {...rest}>
    <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
    <div className="text-muted-foreground leading-7">{children}</div>
  </section>
);