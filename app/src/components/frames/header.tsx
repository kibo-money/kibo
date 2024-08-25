export function Header({ title, children }: { title: string } & ParentProps) {
  return (
    <div class="pt-1">
      <h3 class="text-lg font-bold md:text-xl">{title}</h3>
      <p class="off">{children}</p>
    </div>
  );
}
