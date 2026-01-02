export const Highlight = ({ text, query }: { text: string; query: string }) => {
    if (!query) return <span>{text}</span>;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return (
        <span>
            {parts.map((p, i) =>
                p.toLowerCase() === query.toLowerCase() ? (
                    <mark key={i}>{p}</mark>
                ) : (
                    p
                )
            )}
        </span>
    );
};
