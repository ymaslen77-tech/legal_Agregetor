import Link from "next/link";

type Step="choose"|"facts"|"review"|"result";
/** Military-only progress indicator, no changes to protected family or labor layouts. */
export function MilitaryRouteJourney({title,step}:{title:string;step:Step}){
 const current=step==="choose"?0:step==="facts"?1:step==="review"?2:3;
 const labels=["Ситуация","Анкета","Проверка фактов","Результат","Юридическая проверка"];
 return <nav aria-label="Этапы юридического маршрута" className="mx-auto max-w-5xl px-4 pt-4 sm:px-6 lg:px-8">
  <div className="rounded-xl border border-line bg-white px-3 py-4 shadow-sm sm:px-5">
   <p className="truncate text-xs font-semibold uppercase tracking-wide text-trust" title={title}>Ваш юридический маршрут: {title}</p>
   <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
    {labels.map((label,index)=>{
     const active=index===current;
     return <li key={label} className={`flex min-h-11 items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold sm:text-sm ${active?"border-trust bg-emerald-50 text-ink":"border-line text-zinc-600"}`}>
      <span aria-hidden="true" className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${active?"bg-trust text-white":"bg-zinc-100 text-zinc-600"}`}>{index+1}</span>
      <span aria-current={active?"step":undefined}>{label}</span>
     </li>;
    })}
   </ol>
   <p className="mt-2 text-xs leading-5 text-zinc-500">Итоговый документ требует отдельной юридической проверки и не готов к подаче.</p>
   <Link href="/voennoe-pravo/" className="mt-2 inline-block text-xs font-medium text-trust underline">К списку ситуаций</Link>
  </div>
 </nav>;
}
