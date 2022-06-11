import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { api } from "~/api";

export const loader: LoaderFunction = async () => {
  return json(await api.game.getAll());
};

export default function Index() {
  const data = useLoaderData() as Awaited<ReturnType<typeof api.game.getAll>>;

  return (
    <div className="p-2">
      {data.map((game) => (
        <ul key={game.number}>
          {game.records.map((record) => (
            <li key={record.teamNumber}>{record.teamNumber}</li>
          ))}
        </ul>
      ))}
    </div>
  );
}
