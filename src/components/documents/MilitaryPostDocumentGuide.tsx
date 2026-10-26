"use client";

import {useState} from "react";
import {
 MILITARY_AGENCIES,MILITARY_DIRECTORY_REGIONS,
 selectMilitaryPostDocumentAgencies,type MilitaryAgencyEntry
} from "@/data/military-post-document-directory";
import type {DocumentResultV1} from "@/lib/document-result-contract";

type Props={scenarioKey:string;resultKind:DocumentResultV1["resultKind"];evidence:readonly string[]};

function AgencyCard({entry,region,reviewAcknowledged,canSubmit}:{
 entry:MilitaryAgencyEntry;region:string;reviewAcknowledged:boolean;canSubmit:boolean
}){
 const regionLabel=MILITARY_DIRECTORY_REGIONS.find(item=>item.id===region)?.label;
 const isRegionReady=!entry.regional||Boolean(regionLabel);
 return <li className="rounded-lg border border-line p-4" data-agency={entry.id}>
  <h4 className="font-semibold text-ink">{entry.title}</h4>
  <p className="mt-2 text-sm leading-6">{entry.purpose}</p>
  {entry.regional?<p className="mt-2 text-sm font-medium text-trust">
    {regionLabel?"Выбран регион для поиска: "+regionLabel:"Для поиска территориального органа сначала выберите регион."}
   </p>:<p className="mt-2 text-xs text-zinc-600">Ведомство или подведомственный орган определяется по документам, а не автоматически по региону.</p>}
  <p className="mt-2 text-sm leading-6 text-zinc-700">{entry.warning}</p>
  {isRegionReady?<div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
   <a className="font-semibold text-trust underline underline-offset-2" href={entry.lookupUrl} target="_blank" rel="noopener noreferrer">{entry.lookupLabel}</a>
   {entry.onlineUrl&&canSubmit&&reviewAcknowledged?<a className="font-semibold text-trust underline underline-offset-2" href={entry.onlineUrl} target="_blank" rel="noopener noreferrer">{entry.onlineLabel}</a>:null}
  </div>:null}
  {entry.onlineUrl&&!reviewAcknowledged?<p className="mt-2 text-xs text-zinc-600">Переход к онлайн-обращению доступен после ознакомления с предупреждением.</p>:null}
  {entry.onlineUrl&&reviewAcknowledged&&!canSubmit?<p className="mt-2 text-xs text-zinc-600">Это чек-лист, не готовое заявление. Онлайн-подачу уточняйте после составления и правовой проверки обращения.</p>:null}
  {entry.onlineUrl&&reviewAcknowledged&&entry.regional&&!regionLabel?<p className="mt-2 text-xs text-zinc-600">Выберите регион, прежде чем переходить к онлайн-приёмной.</p>:null}
  {entry.onlineUrl&&reviewAcknowledged&&canSubmit&&isRegionReady?<p className="mt-2 text-xs text-zinc-600">Ссылка открывает официальный сайт: ПравоПоиск не передаёт документ автоматически, не входит в личный кабинет и не гарантирует доступность формы.</p>:null}
  <p className="mt-3 text-xs text-zinc-600">Источник порядка обращения: <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">правовая или ведомственная информация</a>.</p>
 </li>;
}
export function MilitaryPostDocumentGuide({scenarioKey,resultKind,evidence}:Props){
 const [region,setRegion]=useState("");
 const [acknowledged,setAcknowledged]=useState(false);
 const [showAll,setShowAll]=useState(false);
 const [completed,setCompleted]=useState<string[]>([]);
 const current=selectMilitaryPostDocumentAgencies(scenarioKey);
 const canSubmit=resultKind==="DRAFT";
 const regionLabel=MILITARY_DIRECTORY_REGIONS.find(item=>item.id===region)?.label;
 const actions=[
  "Проверьте документ: статус, даты, факты, полномочия заявителя и требуемые приложения.",
  "Передайте проект юристу для индивидуальной проверки норм, правового режима, компетентного адресата и сроков. Не направляйте непроверенный шаблон.",
  "Выберите регион для поиска территориального органа. Для военкомата ориентируйтесь на место воинского учёта; для военных органов — на ведомственную подчинённость.",
  "На официальном сайте подтвердите точное подразделение, адрес приёма и допустимый способ подачи. При необходимости исправьте адресата в документе.",
  "После юридической проверки подайте готовое обращение через официальный портал, лично либо установленным почтовым способом. Сохраните номер регистрации, квитанцию или подтверждение вручения.",
  "Проверьте получение ответа, соблюдение применимого срока и сохраните переписку. Если ответ не получен либо получен отказ, отдельно проверьте порядок обжалования."
 ];
 function toggle(index:number){setCompleted(previous=>previous.includes(String(index))?previous.filter(x=>x!==String(index)):[...previous,String(index)]);}
 return <section className="mt-6 rounded-lg border border-line bg-white p-4 sm:p-5" aria-label="Памятка после формирования военного документа">
  <h3 className="text-xl font-semibold text-ink">Памятка: что делать с документом дальше</h3>
  <div role="alert" className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
   <p className="font-semibold">До направления документа необходима юридическая проверка.</p>
   <p className="mt-2">Сформированный материал — {canSubmit?"предварительный проект, не готовый к подаче":"чек-лист, а не заявление"}. Подбор ведомств — справочная подсказка, не подтверждение компетенции, права на выплату, способа обжалования или подсудности. Не передавайте сведения о дислокации, диагнозах и данные третьих лиц через незащищённые формы.</p>
  </div>
  <h4 className="mt-5 font-semibold">Пошаговые действия</h4>
  <ol className="mt-3 space-y-3" aria-label="Последующие действия">
   {actions.map((action,index)=><li key={index} className="flex items-start gap-3 text-sm leading-6">
    <input type="checkbox" id={"military-next-"+index} checked={completed.includes(String(index))} onChange={()=>toggle(index)} className="mt-1 h-4 w-4 shrink-0" />
    <label htmlFor={"military-next-"+index}><span className="font-semibold">{index+1}.</span> {action}</label>
   </li>)}
  </ol>
  <details className="mt-4 rounded-md border border-line px-4 py-3 text-sm">
   <summary className="cursor-pointer font-semibold">Какие подтверждающие документы подготовить?</summary>
   <ul className="mt-3 list-disc space-y-1 pl-5">{evidence.map((item,index)=><li key={index}>{item}</li>)}</ul>
   <p className="mt-2 text-zinc-600">Оригиналы, заверение, доступность персональных данных и приложений проверьте с юристом.</p>
  </details>
  <div className="mt-6 border-t border-line pt-5">
   <h4 className="text-lg font-semibold">Выберите свой регион</h4>
   <label htmlFor="military-directory-region" className="mt-3 block text-sm font-semibold">
    В каком регионе вы находитесь или планируете обращаться?
   </label>
   <select id="military-directory-region" className="mt-2 min-h-11 w-full rounded-md border border-line bg-white px-3 py-2 text-base" value={region} onChange={event=>setRegion(event.target.value)}>
    <option value="">Выберите регион</option>
    {[...MILITARY_DIRECTORY_REGIONS].sort((a,b)=>a.label.localeCompare(b.label,"ru")).map(item=><option key={item.id} value={item.id}>{item.label}</option>)}
   </select>
   <p className="mt-2 text-xs leading-5 text-zinc-600">Регион используется только для поиска контактов. Он может не совпадать с регионом воинского учёта, местом службы или поднадзорностью военной прокуратуры. Адрес и возможность электронной подачи подтвердите на официальном сайте.</p>
   {regionLabel?<p className="mt-2 text-sm font-medium text-trust">Выбрано: {regionLabel}</p>:null}
  </div>
  <div className="mt-6">
   <h4 className="text-lg font-semibold">Куда можно обратиться по вашей ситуации</h4>
   <p className="mt-2 text-sm leading-6 text-zinc-700">{current.reason}</p>
   <p className="mt-2 text-sm text-zinc-700">Основные варианты; окончательный адресат устанавливается по документам.</p>
   <ul className="mt-3 grid gap-3">
    {current.recommended.map(entry=><AgencyCard key={entry.id} entry={entry} region={region} canSubmit={canSubmit} reviewAcknowledged={acknowledged}/>)}
   </ul>
   {current.additional.length?<details className="mt-4 rounded-md border border-line p-4">
    <summary className="cursor-pointer text-sm font-semibold">Дополнительные ведомства и варианты обжалования</summary>
    <ul className="mt-3 grid gap-3">{current.additional.map(entry=><AgencyCard key={entry.id} entry={entry} region={region} canSubmit={canSubmit} reviewAcknowledged={acknowledged}/>)}</ul>
   </details>:null}
  </div>
  <label className="mt-5 flex gap-3 rounded-md border border-line p-4 text-sm leading-6">
   <input type="checkbox" checked={acknowledged} onChange={event=>setAcknowledged(event.target.checked)} className="mt-1 h-4 w-4 shrink-0" />
   <span>Я понимаю, что документ требует индивидуальной юридической проверки до направления, а выбранный регион не подтверждает компетенцию конкретного ведомства. Сайт не подаст обращение за меня.</span>
  </label>
  <div className="mt-5 border-t border-line pt-4">
   <button type="button" onClick={()=>setShowAll(value=>!value)} aria-expanded={showAll} className="text-sm font-semibold text-trust underline underline-offset-2">
    {showAll?"Скрыть справочник ведомств":"Показать весь справочник ведомств и официальных приёмных"}
   </button>
   {showAll?<div className="mt-4">
    <p className="text-sm leading-6 text-zinc-700">В справочнике представлены официальные федеральные каналы и способы поиска территориальных органов. Он не содержит неподтверждённых физических адресов или вымышленных ссылок на приёмные по регионам.</p>
    <ul className="mt-3 grid gap-3">{Object.values(MILITARY_AGENCIES).map(entry=><AgencyCard key={entry.id} entry={entry} region={region} canSubmit={canSubmit} reviewAcknowledged={acknowledged}/>)}</ul>
   </div>:null}
  </div>
 </section>;
}
