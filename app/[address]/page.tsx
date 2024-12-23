import History from "../History";

export default function AddressPage({
  params,
}: {
  params: { address: string };
}) {
  return (
    <div className="space-y-8">
      <History address={params.address} />
    </div>
  );
}
