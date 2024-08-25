export function Number({ number }: { number: () => number }) {
  return (
    <span class="orange font-medium">{number().toLocaleString("en-us")}</span>
  );
}
