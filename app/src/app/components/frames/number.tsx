export function Number({ number }: { number: () => number }) {
  return (
    <span class="font-medium text-orange-400/75">
      {number().toLocaleString("en-us")}
    </span>
  );
}
