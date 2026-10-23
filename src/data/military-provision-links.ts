/**
 * Scenario-specific legal reference targets, with a strict list of checked deep links.
 * These are research references, not certifications of suitability for an individual's
 * status, date, branch of service or special regime.
 *
 * IMPORTANT: Browser text-fragment highlighting within a provision is best-effort.
 * Checked links land on the specific article; unchecked fallback URLs are research-only and never surfaced.
 * Individual checked=true pages were independently located via public search on 2026-10-23. Other references remain unverified and MUST NOT be surfaced as working pinpoint links.
 */
export type MilitaryProvisionId =
  | "53-32"|"53-34"|"53-44"|"53-51"|"53-5-1"|"53-22"|"53-24"|"53-28"|"53-35-1"|"53-35-2"
  | "76-12"|"76-16"|"76-21"|"76-23"|"76-24"
  | "1237-15"|"1237-34"|"306-2"|"306-3"|"565-8"|"574-reg"
  | "kas-218"|"kas-219"|"kas-220"|"31-18"
  | "647-4"|"647-5"|"647-9"|"plenum8-jurisdiction"|"plenum8-discharge"|"plenum8-pay";

export type MilitaryProvision = {
  id: MilitaryProvisionId;
  citation: string;
  url: string;
  pinpoint: string;
  textFragment?: string;
  accessNote?: string;
  /** Only sources individually checked against live page title are shown to users. */
  checked?: boolean;
};

type Entry = Omit<MilitaryProvision, "id">;
const cp = "https://www.consultant.ru/document/";
const registry: Record<MilitaryProvisionId, Entry> = {
 "53-32": {citation:"ФЗ № 53-ФЗ, ст. 32, пп. 1–4 — контракт и его условия",pinpoint:"статья 32, пункты 1–4",url:cp+"cons_doc_LAW_18260/"},
 "53-34": {citation:"ФЗ № 53-ФЗ, ст. 34, п. 1 — заключение контракта",pinpoint:"статья 34, пункт 1",url:cp+"cons_doc_LAW_18260/"},
 "53-44": {citation:"ФЗ № 53-ФЗ, ст. 44, п. 2 — межведомственный перевод",pinpoint:"статья 44, пункт 2",url:cp+"cons_doc_LAW_18260/"},
 "53-51": {citation:"ФЗ № 53-ФЗ, ст. 51 — основания увольнения с учётом статуса",pinpoint:"статья 51, применимый пункт определяется по делу",url:cp+"cons_doc_LAW_18260/d8ba8171f6e944b1dc563df7d03c02836a574238/",checked:true},
 "53-5-1": {citation:"ФЗ № 53-ФЗ, ст. 5.1, п. 1 — освидетельствование граждан",pinpoint:"статья 5.1, пункт 1",url:cp+"cons_doc_LAW_18260/"},
 "53-22": {citation:"ФЗ № 53-ФЗ, ст. 22 — граждане, подлежащие обычному призыву",pinpoint:"статья 22",url:cp+"cons_doc_LAW_18260/"},
 "53-24": {citation:"ФЗ № 53-ФЗ, ст. 24 — отсрочки при призыве (не мобилизации)",pinpoint:"статья 24, применимый пункт зависит от основания",url:cp+"cons_doc_LAW_18260/fbe9593051ae34e2a8eb27f73b923ffee40296b7/",checked:true},
 "53-28": {citation:"ФЗ № 53-ФЗ, ст. 28, пп. 1, 6, 7 — решение, выписка и обжалование",pinpoint:"статья 28, пункты 1, 6, 7",url:cp+"cons_doc_LAW_18260/"},
 "53-35-1": {citation:"ФЗ № 53-ФЗ, ст. 35.1, п. 2 — административное/судебное обжалование",pinpoint:"статья 35.1, пункт 2",url:cp+"cons_doc_LAW_18260/"},
 "53-35-2": {citation:"ФЗ № 53-ФЗ, ст. 35.2, пп. 1–4 — досудебная жалоба по решениям призыва",pinpoint:"статья 35.2, пункты 1–4",url:cp+"cons_doc_LAW_18260/"},
 "76-12": {citation:"ФЗ № 76-ФЗ, ст. 12 — денежное довольствие",pinpoint:"статья 12",url:cp+"cons_doc_LAW_18853/"},
 "76-16": {citation:"ФЗ № 76-ФЗ, ст. 16 — медицинская помощь военнослужащим",pinpoint:"статья 16",url:cp+"cons_doc_LAW_18853/"},
 "76-21": {citation:"ФЗ № 76-ФЗ, ст. 21, пп. 1–2 — обжалование действий командования",pinpoint:"статья 21, пункты 1–2",url:cp+"cons_doc_LAW_18853/7e399077ce330d17642273fb9714c22a4a13e205/",checked:true},
 "76-23": {citation:"ФЗ № 76-ФЗ, ст. 23 — гарантии при увольнении",pinpoint:"статья 23",url:cp+"cons_doc_LAW_18853/"},
 "76-24": {citation:"ФЗ № 76-ФЗ, ст. 24 — гарантии семьям при потере кормильца (не все семейные выплаты)",pinpoint:"статья 24, только при выполнении условий",url:cp+"cons_doc_LAW_18853/"},
 "1237-15": {citation:"Указ № 1237, Положение, ст. 15 — перевод к новому месту службы",pinpoint:"статья 15",url:cp+"cons_doc_LAW_24400/",accessNote:"КонсультантПлюс может ограничивать бесплатный просмотр по времени"},
 "1237-34": {citation:"Указ № 1237, Положение, ст. 34 — порядок увольнения/исключения из списков",pinpoint:"статья 34",url:cp+"cons_doc_LAW_24400/",accessNote:"КонсультантПлюс может ограничивать бесплатный просмотр по времени"},
 "306-2": {citation:"ФЗ № 306-ФЗ, ст. 2 — структура денежного довольствия",pinpoint:"статья 2",url:cp+"cons_doc_LAW_121273/"},
 "306-3": {citation:"ФЗ № 306-ФЗ, ст. 3 — отдельные выплаты и условия получения",pinpoint:"статья 3, часть зависит от вида выплаты",url:cp+"cons_doc_LAW_121273/"},
 "565-8": {citation:"ПП РФ № 565, Положение о ВВЭ, п. 8 — обжалование заключения ВВК",pinpoint:"раздел I, пункт 8",url:cp+"cons_doc_LAW_149096/"},
 "574-reg": {citation:"ПП РФ № 574, Положение о независимой ВВЭ, пп. 1, 8, 10–11 — заявление и договор",pinpoint:"пункты 1, 8, 10–11",url:cp+"cons_doc_LAW_78918/"},
 "kas-218": {citation:"КАС РФ, ст. 218, чч. 1, 3, 5 — право обратиться и подсудность",pinpoint:"статья 218, части 1, 3, 5",url:cp+"cons_doc_LAW_176147/98b69fee6357343965f5b57193fcaaa54b0f21e4/",checked:true},
 "kas-219": {citation:"КАС РФ, ст. 219, чч. 1, 1.1, 5–8 — сроки и восстановление",pinpoint:"статья 219, части 1, 1.1, 5–8",url:cp+"cons_doc_LAW_176147/"},
 "kas-220": {citation:"КАС РФ, ст. 220, чч. 1–3 — требования к административному иску",pinpoint:"статья 220, части 1–3",url:cp+"cons_doc_LAW_176147/"},
 "31-18": {citation:"ФЗ № 31-ФЗ, ст. 18 — отсрочка по мобилизации (отдельно от обычного призыва)",pinpoint:"статья 18, конкретное основание требует проверки",url:cp+"cons_doc_LAW_13454/25fbd4e34ce45ed1b914188bace31872ee4df5da/",checked:true},
 "647-4": {citation:"Указ Президента № 647, п. 4 — действие контрактов в период мобилизации",pinpoint:"пункт 4",url:cp+"cons_doc_LAW_426999/"},
 "647-5": {citation:"Указ Президента № 647, п. 5 — специальные основания увольнения",pinpoint:"пункт 5, подпункт определяется по делу",url:cp+"cons_doc_LAW_426999/"},
 "647-9": {citation:"Указ Президента № 647, п. 9 — отсрочка для ОПК",pinpoint:"пункт 9",url:cp+"cons_doc_LAW_426999/"},
 "plenum8-jurisdiction": {citation:"Пленум ВС № 8 (ред. 28.10.2025) — раздел о подсудности военным судам",pinpoint:"раздел о подсудности",url:cp+"cons_doc_LAW_163741/"},
 "plenum8-discharge": {citation:"Пленум ВС № 8 (ред. 28.10.2025) — раздел «Увольнение с военной службы»",pinpoint:"раздел об увольнении",url:cp+"cons_doc_LAW_163741/"},
 "plenum8-pay": {citation:"Пленум ВС № 8 (ред. 28.10.2025), п. 17 — денежное довольствие",pinpoint:"пункт 17",url:cp+"cons_doc_LAW_163741/"}
};

const scenarioReferences: Record<string, readonly MilitaryProvisionId[]> = {
 "service-contract/contract-check":["53-32","53-34","647-4"],
 "service-contract/service-order-copy":["53-32","76-21"],
 "service-contract/transfer":["53-44","1237-15"],
 "military-discharge/discharge-basis":["53-51","1237-34","647-5","plenum8-discharge"],
 "military-discharge/medical-discharge":["53-51","76-16","565-8","647-5"],
 "military-discharge/discharge-order":["76-23","1237-34","306-3"],
 "military-pay/pay-breakdown":["76-12","306-2","plenum8-pay"],
 "military-pay/benefits":["306-3","76-12"],
 "military-pay/family-benefits":["306-3","76-24"],
 "military-medical/medical-emergency":["76-16"],
 "military-medical/vvk-conclusion":["565-8","53-5-1","76-16"],
 "military-medical/independent-review":["574-reg","565-8"],
 "command-appeal/request-explanation":["76-21"],
 "command-appeal/challenge-decision":["76-21","kas-218","kas-219","kas-220","plenum8-jurisdiction"],
 "command-appeal/inaction":["76-21","kas-218","kas-219"],
 "mobilization-draft/draft-notice":["53-22","53-28","647-4"],
 "mobilization-draft/deferment":["53-24","31-18","647-9"],
 "mobilization-draft/challenge-draft":["53-28","53-35-1","53-35-2","kas-218"]
};

export const MILITARY_PINPOINT_REFERENCES: Readonly<Record<MilitaryProvisionId, Entry>> = registry;
export const MILITARY_SCENARIO_PROVISIONS: Readonly<Record<string, readonly MilitaryProvisionId[]>> = scenarioReferences;
export function getMilitaryPinpointLinks(routeId:string, scenarioKey:string):MilitaryProvision[] {
 const ids=scenarioReferences[routeId+"/"+scenarioKey];
 if(!ids)throw new Error("Missing legal pinpoint references: "+routeId+"/"+scenarioKey);
 return ids.filter(id=>registry[id].checked === true).map(id=>({id,...registry[id]}));
}
export function militaryProvisionHref(ref: MilitaryProvision):string {
 return ref.textFragment ? ref.url+"#:~:text="+encodeURIComponent(ref.textFragment) : ref.url;
}
