import Server from "./server";

export default async function ServerPage({
  params,
}: {
  params: Promise<{ serverId: string }>;
}) {
  const { serverId } = await params;

  return (
    <div className="h-screen w-full">
      <Server serverId={serverId} />
    </div>
  );
}
