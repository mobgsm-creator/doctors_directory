export const Section = ({ id, title, children }: any) => (
  <section id={id} className="mt-4 mb-4">
    <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
    <div className="text-base leading-7">{children}</div>
  </section>
);