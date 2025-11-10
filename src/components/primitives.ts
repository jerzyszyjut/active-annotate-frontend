// primitives removed — keep an empty module so imports don't fail elsewhere
// Minimal helpers: return simple Tailwind class names or empty strings.
export const title = (opts?: { size?: "sm" | "md" | "lg" }) => {
	const base = "tracking-tight inline font-semibold";
	const size = opts?.size === "sm" ? "text-2xl" : opts?.size === "lg" ? "text-4xl" : "text-3xl";
	return `${base} ${size}`;
};

export const subtitle = () => "w-full text-lg text-slate-400";
