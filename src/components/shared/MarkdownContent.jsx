import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "next-themes";

/** Read-only markdown rendering that follows the active theme. */
const MarkdownContent = ({ source }) => {
  const { resolvedTheme } = useTheme();

  return (
    <div data-color-mode={resolvedTheme === "dark" ? "dark" : "light"} className="markdown-content">
      <MDEditor.Markdown source={source} />
    </div>
  );
};

export default MarkdownContent;
