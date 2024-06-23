export function Counter({
  count,
  name,
  setRef,
}: {
  count: () => number;
  name: string;
  setRef?: Setter<HTMLDivElement | undefined>;
}) {
  return (
    <div
      ref={setRef}
      class="text-orange-100/75"
      style={{
        "border-style": count() ? "dashed" : "none",
      }}
    >
      Counted{" "}
      <span class="font-medium text-orange-400/75">
        {count().toLocaleString("en-us")}
      </span>{" "}
      {name}
    </div>
  );
}
