import { SkeletonInlineTextProps } from "@/components/types/skelectoninlinetextprops";
export default function SkeletonInlineText({
  length,
  className,
}: SkeletonInlineTextProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block align-middle animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`}
      style={{
        width: `${length}ch`,
        height: "1em",
      }}
    />
  );
}
