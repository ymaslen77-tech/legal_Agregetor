import { REAL_ESTATE_GROUPS, REAL_ESTATE_PUBLICATION_GATE } from "@/data/real-estate-route-plan";
import { getRealEstateLegalReviewTask } from "@/data/real-estate-legal-review";

/** Editorial SEO plan only: no public pages, sitemap, robots override or metadata injection. */
export const REAL_ESTATE_PLANNED_ROOT="/nedvizhimost-i-zemlya/" as const;
type Scope="catalog"|"group"|"situation";
export type RealEstateSeoPlanEntry=Readonly<{
  scope:Scope;
  path:string;
  canonicalPath:string;
  title:string;
  description:string;
  groupId:string|null;
  situationId:string|null;
  indexable:false;
  sitemapEligible:false;
  legalTrust:"PENDING";
  privacy:"PENDING";
  technicalStatus:"NOT_PUBLISHED";
}>;

function common(scope:Scope,path:string,title:string,description:string,
  groupId:string|null=null,situationId:string|null=null):RealEstateSeoPlanEntry{
  return {
    scope,path,canonicalPath:path,title,description,groupId,situationId,
    indexable:false,sitemapEligible:false,legalTrust:"PENDING",
    privacy:"PENDING",technicalStatus:"NOT_PUBLISHED"
  };
}
export const REAL_ESTATE_SEO_PLAN:readonly RealEstateSeoPlanEntry[]=[
  common("catalog",REAL_ESTATE_PLANNED_ROOT,
    "Недвижимость и земельные споры — жизненные ситуации",
    "Темы регистрации права, сделок с недвижимостью, долей, межевания, кадастра и земельных споров. Предварительная структура для юридической проверки."),
  ...REAL_ESTATE_GROUPS.flatMap(group=>[
    common("group",REAL_ESTATE_PLANNED_ROOT+group.id+"/",
      group.title+" — недвижимость и земля",
      group.description+". Подбор вопросов и подготовка сведений для индивидуальной юридической проверки.",
      group.id),
    ...group.situations.map(situation=>{
      const path=REAL_ESTATE_PLANNED_ROOT+group.id+"/"+situation.id+"/";
      const check=getRealEstateLegalReviewTask(group.id,situation.id);
      if(!check)throw new Error("SEO plan has no individual legal review: "+path);
      return common("situation",path,situation.title+" — "+group.title,
        situation.title+". Какие обстоятельства и документы важно уточнить перед обращением: "+
        situation.caseFacts+". Требуется юридическая проверка.",
        group.id,situation.id);
    })
  ])
];
export function getRealEstateSeoPlanEntry(groupId?:string,situationId?:string):RealEstateSeoPlanEntry|null{
  const path=REAL_ESTATE_PLANNED_ROOT+(groupId?groupId+"/":"")+(situationId?situationId+"/":"");
  return REAL_ESTATE_SEO_PLAN.find(item=>item.path===path)??null;
}
/** Draft/preview content must NEVER qualify for indexing, even with future flags. */
export function isRealEstatePageIndexable(
  entry:RealEstateSeoPlanEntry,
  audit:Readonly<{technical:boolean;legal:boolean;privacy:boolean;intent:boolean}>
):boolean{
  return entry.indexable&&entry.legalTrust!=="PENDING"&&entry.privacy!=="PENDING"
    &&REAL_ESTATE_PUBLICATION_GATE.publicUrlsEnabled
    &&audit.technical&&audit.legal&&audit.privacy&&audit.intent;
}
