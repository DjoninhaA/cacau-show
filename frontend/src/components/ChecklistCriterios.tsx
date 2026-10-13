import { CRITERIOS, type TipoCriterio } from "../config/criterios";

interface Props {
  marcados: string[];
  onChange: (marcados: string[]) => void;
}

const GRUPOS: { tipo: TipoCriterio; titulo: string; dica: string; marcado: string }[] = [
  {
    tipo: "positivo",
    titulo: "Pontos positivos",
    dica: "Cada item marcado aumenta a nota.",
    marcado: "has-checked:border-green-600/40 has-checked:bg-green-50",
  },
  {
    tipo: "negativo",
    titulo: "Pontos de atenção",
    dica: "Cada item marcado diminui a nota.",
    marcado: "has-checked:border-red-600/40 has-checked:bg-red-50",
  },
];

export function ChecklistCriterios({ marcados, onChange }: Props) {
  function alternar(id: string) {
    onChange(marcados.includes(id) ? marcados.filter((m) => m !== id) : [...marcados, id]);
  }

  return (
    <div>
      <h3 className="mb-4 text-base font-semibold text-stone-900">Como está o relacionamento?</h3>
      <div className="space-y-6">
        {GRUPOS.map((grupo) => {
          const criterios = CRITERIOS.filter((c) => c.tipo === grupo.tipo);
          if (criterios.length === 0) return null;
          return (
            <fieldset key={grupo.tipo}>
              <legend className="text-sm font-semibold text-stone-700">{grupo.titulo}</legend>
              <p className="mb-2 text-xs text-stone-500">{grupo.dica}</p>
              <div className="space-y-2">
                {criterios.map((criterio) => (
                  <label
                    key={criterio.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-3.5 transition select-none hover:bg-stone-50 focus-within:ring-2 focus-within:ring-cacau/30 ${grupo.marcado}`}
                  >
                    <input
                      type="checkbox"
                      checked={marcados.includes(criterio.id)}
                      onChange={() => alternar(criterio.id)}
                      className={`size-5 shrink-0 cursor-pointer ${grupo.tipo === "negativo" ? "accent-red-600" : "accent-cacau"}`}
                    />
                    <span className="text-stone-800">{criterio.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          );
        })}
      </div>
    </div>
  );
}
