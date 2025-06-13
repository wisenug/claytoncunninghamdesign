
interface ProjectHeaderProps {
  title: string;
  subtitle: string;
}

const ProjectHeader = ({ title, subtitle }: ProjectHeaderProps) => {
  return (
    <header className="mb-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg md:text-xl text-muted-foreground">
        {subtitle}
      </p>
    </header>
  );
};

export default ProjectHeader;
