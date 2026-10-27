/**
 * Clean military-law rebuild. Editorial candidates only.
 * Q&A source: historical 2026-10-15 taxonomy snapshot (13,110 questions).
 * Not a line-by-line, legally verified classification of those questions.
 * Information-only questions never require intake, forms or generators.
 * Document candidates must be legally approved and assigned concrete document slugs
 * before a generator can be enabled. No filing-ready claims are permitted here.
 */
export type MilitarySituationKind = "information" | "document" | "mixed";
export type MilitarySituation = Readonly<{
  slug: string;
  title: string;
  kind: MilitarySituationKind;
  legalReviewed: false;
  documentSlugs: readonly string[];
}>;
export type MilitaryTopic = Readonly<{
  slug: string;
  title: string;
  description: string;
  situations: readonly MilitarySituation[];
}>;
type DraftSituation = {kind: MilitarySituationKind; title: string};
type DraftTopic = {slug: string; title: string; description: string; situations: DraftSituation[]};
const draftTopics: readonly DraftTopic[] = [
  {slug:"kontraktnaya-sluzhba",title:"Контракт и прохождение военной службы",description:"Заключение, условия, срок действия контракта и служебные решения",situations:[
      {kind:"mixed",title:"Как заключить контракт о прохождении военной службы?"},
      {kind:"information",title:"Какие условия обязательно должны быть отражены в контракте?"},
      {kind:"mixed",title:"Можно ли отказаться от подписания контракта?"},
      {kind:"document",title:"Как получить копию заключённого контракта?"},
      {kind:"mixed",title:"Можно ли изменить условия действующего контракта?"},
      {kind:"mixed",title:"Что делать, если контракт продлён без согласия военнослужащего?"},
      {kind:"mixed",title:"Можно ли прекратить службу после окончания срока контракта?"},
      {kind:"document",title:"Как оспорить незаконные условия контракта?"},
      {kind:"document",title:"Что делать, если военнослужащего назначили на должность без его согласия?"}
  ]},
  {slug:"mobilizaciya",title:"Мобилизация",description:"Призыв по мобилизации, отсрочки, ошибки и порядок обжалования",situations:[
      {kind:"information",title:"Кого могут призвать на военную службу по мобилизации?"},
      {kind:"information",title:"Какие правовые последствия возникают при мобилизации?"},
      {kind:"document",title:"Как обжаловать решение о призыве по мобилизации?"},
      {kind:"document",title:"Что делать при ошибочной мобилизации?"},
      {kind:"mixed",title:"Как добиться проверки законности мобилизации по состоянию здоровья?"},
      {kind:"mixed",title:"Как получить освобождение или отсрочку от мобилизации при наличии законных оснований?"},
      {kind:"mixed",title:"Как оформить обращение по семейным обстоятельствам мобилизованного?"},
      {kind:"document",title:"Как добиться пересмотра решения о направлении на службу?"}
  ]},
  {slug:"prizyv",title:"Призыв на срочную военную службу",description:"Призывная комиссия, медицинское освидетельствование и оспаривание решений",situations:[
      {kind:"information",title:"Кто подлежит призыву на срочную военную службу?"},
      {kind:"information",title:"Какие решения вправе принимать призывная комиссия?"},
      {kind:"document",title:"Как обжаловать решение призывной комиссии?"},
      {kind:"mixed",title:"Что делать, если призывают при наличии заболевания?"},
      {kind:"document",title:"Как получить копию решения призывной комиссии?"},
      {kind:"document",title:"Что делать, если военкомат не учитывает медицинские документы?"},
      {kind:"document",title:"Как оспорить установленную категорию годности?"},
      {kind:"mixed",title:"Что делать при нарушении процедуры вручения повестки?"},
      {kind:"document",title:"Как обжаловать отказ в освобождении от призыва?"}
  ]},
  {slug:"otsrochka-ot-sluzhby",title:"Отсрочка и освобождение от военной службы",description:"Основания отсрочки, подтверждающие документы и защита при отказе",situations:[
      {kind:"information",title:"Какие законные основания предусмотрены для отсрочки и освобождения?"},
      {kind:"document",title:"Как получить отсрочку от призыва по состоянию здоровья?"},
      {kind:"document",title:"Как оформить отсрочку в связи с обучением?"},
      {kind:"document",title:"Как получить отсрочку по семейным обстоятельствам?"},
      {kind:"document",title:"Что делать, если отказали в предоставлении отсрочки?"},
      {kind:"document",title:"Как подтвердить право на отсрочку при уходе за родственником?"},
      {kind:"document",title:"Как оформить освобождение от призыва при наличии законных оснований?"},
      {kind:"document",title:"Как обжаловать отмену ранее предоставленной отсрочки?"}
  ]},
  {slug:"vvk-i-kategoriya-godnosti",title:"ВВК и категория годности",description:"Направление на освидетельствование, повторная экспертиза и обжалование",situations:[
      {kind:"information",title:"Какие решения принимает военно-врачебная комиссия?"},
      {kind:"document",title:"Как добиться направления на военно-врачебную комиссию?"},
      {kind:"document",title:"Как пройти повторную ВВК при ухудшении состояния здоровья?"},
      {kind:"document",title:"Как обжаловать заключение ВВК?"},
      {kind:"mixed",title:"Как изменить категорию годности при наличии медицинских оснований?"},
      {kind:"document",title:"Как провести независимую военно-врачебную экспертизу?"},
      {kind:"document",title:"Что делать, если ВВК не учитывает результаты обследований?"},
      {kind:"document",title:"Как получить копию заключения ВВК?"},
      {kind:"document",title:"Как обжаловать отказ в направлении на обследование?"}
  ]},
  {slug:"raporty-i-obrashcheniya",title:"Рапорты и обращения военнослужащих",description:"Оформление, регистрация, рассмотрение и обжалование обращений",situations:[
      {kind:"information",title:"Каков общий порядок рассмотрения рапортов военнослужащих?"},
      {kind:"document",title:"Как подать рапорт командиру воинской части?"},
      {kind:"document",title:"Что делать, если командир не принимает рапорт?"},
      {kind:"document",title:"Как добиться регистрации поданного рапорта?"},
      {kind:"document",title:"Что делать, если командование не отвечает на рапорт?"},
      {kind:"document",title:"Как получить письменное решение по поданному обращению?"},
      {kind:"document",title:"Как обжаловать отказ командования?"}
  ]},
  {slug:"uvolnenie-s-voennoy-sluzhby",title:"Увольнение с военной службы",description:"Условия увольнения, рапорт, приказ, окончательный расчёт",situations:[
      {kind:"information",title:"Какие основания увольнения применимы к различным видам военной службы?"},
      {kind:"document",title:"Как уволиться с военной службы по состоянию здоровья?"},
      {kind:"document",title:"Как подать рапорт об увольнении по семейным обстоятельствам?"},
      {kind:"mixed",title:"Можно ли уволиться после окончания срока контракта?"},
      {kind:"document",title:"Как добиться увольнения при достижении предельного возраста?"},
      {kind:"document",title:"Как оспорить отказ в увольнении?"},
      {kind:"document",title:"Что делать, если командование не рассматривает рапорт об увольнении?"},
      {kind:"document",title:"Как оспорить незаконный приказ об увольнении?"},
      {kind:"document",title:"Как получить документы и окончательный расчёт при увольнении?"}
  ]},
  {slug:"perevod-v-druguyu-chast",title:"Перевод в другую воинскую часть",description:"Перевод по инициативе военнослужащего или командования",situations:[
      {kind:"information",title:"В каких случаях допускается перевод военнослужащего?"},
      {kind:"document",title:"Как подать рапорт о переводе в другую воинскую часть?"},
      {kind:"document",title:"Как оформить перевод по состоянию здоровья?"},
      {kind:"document",title:"Как добиться перевода по семейным обстоятельствам?"},
      {kind:"mixed",title:"Что делать, если военнослужащего перевели без законных оснований?"},
      {kind:"document",title:"Как обжаловать отказ в переводе?"}
  ]},
  {slug:"otpusk-voennosluzhashchego",title:"Отпуск военнослужащего",description:"Виды отпусков, порядок предоставления, отказ и отзыв",situations:[
      {kind:"information",title:"Какие виды отпусков предусмотрены для военнослужащих?"},
      {kind:"document",title:"Как получить основной отпуск военнослужащему?"},
      {kind:"document",title:"Как получить отпуск по семейным обстоятельствам?"},
      {kind:"document",title:"Что делать, если командование отказывает в предоставлении отпуска?"},
      {kind:"document",title:"Как добиться предоставления неиспользованного отпуска?"},
      {kind:"document",title:"Как обжаловать незаконный отзыв из отпуска?"}
  ]},
  {slug:"denezhnoe-dovolstvie",title:"Денежное довольствие",description:"Начисления, задолженность, надбавки и удержания",situations:[
      {kind:"information",title:"Из каких выплат состоит денежное довольствие военнослужащего?"},
      {kind:"document",title:"Что делать, если военнослужащему не выплачивают денежное довольствие?"},
      {kind:"document",title:"Как взыскать задолженность по денежному довольствию?"},
      {kind:"document",title:"Как оспорить неправильный расчёт выплат?"},
      {kind:"document",title:"Что делать при незаконных удержаниях из денежного довольствия?"},
      {kind:"document",title:"Как добиться выплаты положенных надбавок?"},
      {kind:"document",title:"Как получить расчётные документы о начислениях и удержаниях?"}
  ]},
  {slug:"vyplaty-za-uchastie-v-svo",title:"Выплаты за участие в СВО",description:"Условия назначения, подтверждение права, задержки и отказы",situations:[
      {kind:"information",title:"Какие виды выплат предусмотрены для участников СВО?"},
      {kind:"document",title:"Как оформить единовременную выплату при заключении контракта?"},
      {kind:"document",title:"Как добиться выплаты за участие в СВО?"},
      {kind:"document",title:"Что делать при задержке положенной выплаты?"},
      {kind:"document",title:"Как обжаловать отказ в назначении выплаты?"},
      {kind:"document",title:"Как получить региональную выплату при наличии оснований?"},
      {kind:"document",title:"Как взыскать назначенную, но не перечисленную выплату?"}
  ]},
  {slug:"ranenie-travma-gospital",title:"Ранение, травма и медицинская помощь",description:"Лечение, госпитализация, документы о травме и медицинские гарантии",situations:[
      {kind:"information",title:"Какие гарантии медицинской помощи предусмотрены военнослужащим?"},
      {kind:"mixed",title:"Как получить медицинскую помощь после ранения?"},
      {kind:"document",title:"Что делать, если командование не направляет на лечение?"},
      {kind:"document",title:"Как добиться госпитализации военнослужащего?"},
      {kind:"document",title:"Как оформить документы, подтверждающие военную травму?"},
      {kind:"document",title:"Как установить причинную связь заболевания или травмы с прохождением службы?"},
      {kind:"document",title:"Как обжаловать отказ в медицинской помощи?"},
      {kind:"mixed",title:"Что делать, если военнослужащего с незавершённым лечением направляют к исполнению обязанностей службы?"}
  ]},
  {slug:"gibel-i-vyplaty-seme",title:"Гибель, пропажа без вести и выплаты семье",description:"Подтверждение статуса, права семьи, необходимые обращения и споры",situations:[
      {kind:"information",title:"Кто из членов семьи может иметь право на выплаты при гибели военнослужащего?"},
      {kind:"document",title:"Как оформить выплаты семье погибшего военнослужащего?"},
      {kind:"document",title:"Что делать, если отказали в выплатах родственникам погибшего?"},
      {kind:"document",title:"Как получить документы, подтверждающие обстоятельства гибели?"},
      {kind:"mixed",title:"Как оформить выплаты при признании военнослужащего безвестно отсутствующим или умершим?"},
      {kind:"document",title:"Как установить юридический факт, необходимый для оформления выплат?"},
      {kind:"document",title:"Как обжаловать отказ в признании права на выплату?"},
      {kind:"document",title:"Как защитить права детей и других членов семьи погибшего военнослужащего?"}
  ]},
  {slug:"disciplinarnye-vzyskaniya",title:"Дисциплинарные взыскания",description:"Основания взыскания, порядок разбирательства, жалобы",situations:[
      {kind:"information",title:"Какие дисциплинарные взыскания предусмотрены для военнослужащих?"},
      {kind:"document",title:"Как обжаловать дисциплинарное взыскание?"},
      {kind:"document",title:"Что делать при незаконном привлечении к дисциплинарной ответственности?"},
      {kind:"document",title:"Как получить материалы разбирательства?"},
      {kind:"document",title:"Как подать жалобу на нарушение порядка применения взыскания?"},
      {kind:"document",title:"Как добиться отмены незаконного дисциплинарного приказа?"}
  ]},
  {slug:"samovolnoe-ostavlenie-chasti",title:"Самовольное оставление части и уголовно-правовая защита",description:"Правовая защита, учёт уважительных причин и процессуальные обращения",situations:[
      {kind:"information",title:"Чем различаются дисциплинарные и уголовно-правовые последствия отсутствия на службе?"},
      {kind:"document",title:"Как оспорить необоснованное обвинение в самовольном оставлении части?"},
      {kind:"document",title:"Как заявить об уважительных причинах отсутствия на службе?"},
      {kind:"document",title:"Как обжаловать незаконные действия при расследовании?"},
      {kind:"document",title:"Как подать ходатайство или жалобу в рамках уголовного дела?"}
  ]},
  {slug:"voennaya-ipoteka-i-zhile",title:"Военная ипотека и жилищное обеспечение",description:"НИС, жилищные гарантии, накопления, споры и увольнение",situations:[
      {kind:"information",title:"Какие существуют способы жилищного обеспечения военнослужащих?"},
      {kind:"document",title:"Как вступить в накопительно-ипотечную систему?"},
      {kind:"document",title:"Что делать, если отказали во включении в реестр НИС?"},
      {kind:"document",title:"Как обжаловать нарушение порядка начисления накоплений?"},
      {kind:"mixed",title:"Как защитить жилищные права при увольнении со службы?"},
      {kind:"document",title:"Как обжаловать отказ в предоставлении жилья или жилищной субсидии?"}
  ]},
  {slug:"voinskiy-uchet-i-dokumenty",title:"Воинский учёт и военные документы",description:"Постановка на учёт, документы, проживание за рубежом, отказ в выдаче",situations:[
      {kind:"information",title:"Кто обязан состоять на воинском учёте?"},
      {kind:"document",title:"Как встать на воинский учёт?"},
      {kind:"mixed",title:"Как сняться с воинского учёта при наличии законных оснований?"},
      {kind:"mixed",title:"Как оформить воинский учёт при проживании за границей?"},
      {kind:"document",title:"Как восстановить утерянный военный билет?"},
      {kind:"document",title:"Что делать при отказе в выдаче военного билета?"},
      {kind:"document",title:"Как обжаловать отказ в оформлении гражданского паспорта из-за отсутствия военного билета?"}
  ]},
  {slug:"alternativnaya-grazhdanskaya-sluzhba",title:"Альтернативная гражданская служба",description:"Порядок заявления о замене службы и способы обжалования отказа",situations:[
      {kind:"information",title:"Кому и при каких условиях может быть доступна альтернативная гражданская служба?"},
      {kind:"document",title:"Как подать заявление о замене военной службы альтернативной гражданской?"},
      {kind:"document",title:"Как обжаловать отказ в замене военной службы?"},
      {kind:"document",title:"Как оспорить нарушение процедуры рассмотрения заявления?"},
      {kind:"document",title:"Как добиться пересмотра решения об отказе?"}
  ]},
  {slug:"veterany-pensii-i-lgoty",title:"Статус ветерана, пенсии и социальные гарантии",description:"Удостоверения, пенсионное обеспечение и меры поддержки",situations:[
      {kind:"information",title:"Какие меры социальной поддержки предусмотрены для ветеранов боевых действий?"},
      {kind:"document",title:"Как получить удостоверение ветерана боевых действий?"},
      {kind:"document",title:"Что делать при отказе в признании статуса ветерана?"},
      {kind:"document",title:"Как оформить военную пенсию?"},
      {kind:"document",title:"Как обжаловать неправильный расчёт военной пенсии?"},
      {kind:"document",title:"Как получить меры социальной поддержки после увольнения?"},
      {kind:"document",title:"Как добиться предоставления медицинских и санаторно-курортных гарантий при наличии права?"}
  ]},
  {slug:"sudebnaya-zashchita",title:"Судебная защита прав военнослужащих",description:"Обжалование решений, бездействия и судебных актов",situations:[
      {kind:"information",title:"Как определить компетентный суд по военному спору?"},
      {kind:"document",title:"Как подать административное исковое заявление об оспаривании решения должностного лица?"},
      {kind:"document",title:"Как обжаловать бездействие командования в суде?"},
      {kind:"document",title:"Как обжаловать отказ военной прокуратуры при наличии предусмотренных законом оснований?"},
      {kind:"document",title:"Как подать ходатайство по рассматриваемому делу?"},
      {kind:"document",title:"Как подать апелляционную жалобу на решение суда?"}
  ]}
];
const alphabet: Record<string, string> = {
  а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",
  м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",
  ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"
};
export function militarySituationSlug(title: string): string {
  return [...title.toLowerCase()].map(ch => alphabet[ch] ?? ch).join("")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
export const MILITARY_TOPICS: readonly MilitaryTopic[] = draftTopics.map(topic => ({
  slug: topic.slug, title: topic.title, description: topic.description,
  situations: topic.situations.map(s => ({
    slug: militarySituationSlug(s.title),
    title: s.title,
    kind: s.kind,
    legalReviewed: false,
    documentSlugs: [] as readonly string[]
  }))
}));
export function getMilitaryTopic(slug: string): MilitaryTopic | null {
  return MILITARY_TOPICS.find(t => t.slug === slug) ?? null;
}
export function getMilitarySituation(topic: MilitaryTopic, slug: string): MilitarySituation | null {
  return topic.situations.find(s => s.slug === slug) ?? null;
}
export const MILITARY_LEGACY_TOPIC_REDIRECTS: Readonly<Record<string, string>> = {
  "prokhozhdenie-voennoy-sluzhby-po-kontraktu": "kontraktnaya-sluzhba",
  "denezhnoe-dovolstvie-i-vyplaty": "denezhnoe-dovolstvie",
  "voenno-vrachebnaya-komissiya": "vvk-i-kategoriya-godnosti",
  "obrashchenie-i-obzhalovanie-komandovaniya": "raporty-i-obrashcheniya",
  "prizyv-i-mobilizatsiya": "mobilizaciya"
};
