import { ReactNode } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
    children?: ReactNode;
    className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
    children,
    className,
    ...rest
}) => {
    const match = /language-(\w+)/.exec(className || "");

    return match ? (
        <SyntaxHighlighter
            {...rest}
            style={dracula}
            language={match[1]}
            PreTag="div"
        >
            {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
    ) : (
        <code {...rest} className={className}>
            {children}
        </code>
    );
};

export default CodeBlock;
