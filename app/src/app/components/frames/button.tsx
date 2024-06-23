export function Button({
  onClick,
  children,
}: { onClick: VoidFunction } & ParentProps) {
  return (
    <button
      class="group flex w-full flex-1 items-center justify-center rounded-lg px-2 py-1.5 hover:bg-orange-200/20 active:scale-95"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
