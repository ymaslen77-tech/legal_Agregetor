import { REAL_ESTATE_GROUPS, REAL_ESTATE_SOURCE_FAMILIES } from "@/data/real-estate-route-plan";

/**
 * One independent legal review task per route. Source names are candidates only.
 * Neither a document nor any legal assertion is approved by an empty task.
 */
export type RealEstateReviewTask = Readonly<{
  key:string;
  groupTitle:string;
  situationTitle:string;
  risk:"standard"|"high"|"critical";
  issueToVerify:string;
  candidateActNames:readonly string[];
  requiredChecks:readonly string[];
  acceptedClaims:readonly [];
  sourcesVerifiedPerClaim:0;
  status:"PENDING";
  filingReady:false;
}>;

const REQUIRED_CHECKS = [
  "Предмет права, тип объекта, правовой статус и доказательства",
  "Действующая на дату события редакция норм и исключения",
  "Каждый существенный тезис по трём независимым проверенным источникам",
  "Надлежащий адресат, полномочия и досудебный порядок",
  "Сроки, процессуальная форма и подсудность при судебном споре",
  "Госпошлина и другие расходы либо подтверждённое освобождение",
  "Расчёт требований, обязательные приложения и способ направления",
  "Риски персональных данных, публичной индексации и ложной уверенности"
] as const;

export const REAL_ESTATE_LEGAL_REVIEW_TASKS:readonly RealEstateReviewTask[] =
  REAL_ESTATE_GROUPS.flatMap(group=>group.situations.map(situation=>({
    key:group.id+"/"+situation.id,
    groupTitle:group.title,
    situationTitle:situation.title,
    risk:situation.risk,
    issueToVerify:"Установить обстоятельства ("+situation.caseFacts+
      "), предмет возможного требования и применимые исключения без автоматического правового вывода.",
    candidateActNames:group.sourceKeys.map(key=>REAL_ESTATE_SOURCE_FAMILIES[key]),
    requiredChecks:REQUIRED_CHECKS,
    acceptedClaims:[] as const,
    sourcesVerifiedPerClaim:0 as const,
    status:"PENDING" as const,
    filingReady:false as const
  })));

export function getRealEstateLegalReviewTask(groupId:string,situationId:string):RealEstateReviewTask|null{
  return REAL_ESTATE_LEGAL_REVIEW_TASKS.find(task=>task.key===groupId+"/"+situationId)??null;
}
