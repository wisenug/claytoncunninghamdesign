
interface ProjectHighlightProps {
  title: string;
  description: string;
}

const ProjectHighlight = ({ title, description }: ProjectHighlightProps) => {
  return (
    <aside className="text-black p-8 rounded" role="complementary">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-lg">{description}</p>
    </aside>
  );
};

export default ProjectHighlight;
