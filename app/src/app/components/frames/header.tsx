export function Header({ title, children }: { title: string } & ParentProps) {
  return (
    <div>
      <h3 class="text-lg font-bold md:text-xl">{title}</h3>
      <p class="text-orange-950/60 dark:text-orange-100/75">{children}</p>
    </div>
  );
}
