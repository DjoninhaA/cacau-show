import { CRITERIOS } from "../config/criterios";

interface Props {
  marcados: string[];
  onChange: (marcados: string[]) => void;
}

export function ChecklistCriterios({ marcados, onChange }: Props) {
  function alternar(id: string) {
    onChange(marcados.includes(id) ? marcados.filter((m) => m !== id) : [...marcados, id]);
  }

  return (
    <fieldset>
      <legend className="mb-3 text-base font-semibold text-stone-900">Como está o relacionamento?</legend>
      <div className="space-y-2">
        {CRITERIOS.map((criterio) => (
          <label
            key={criterio.id}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-3.5 transition select-none hover:bg-stone-50 focus-within:ring-2 focus-within:ring-cacau/30 has-checked:border-cacau/40 has-checked:bg-cacau/5"
          >
            <input
              type="checkbox"
              checked={marcados.includes(criterio.id)}
              onChange={() => alternar(criterio.id)}
              className="size-5 shrink-0 cursor-pointer accent-cacau"
            />
            <span className="text-stone-800">{criterio.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
