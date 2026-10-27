import type {MilitarySituation, MilitaryTopic} from "@/data/military-catalog";
import {getMilitaryGuide} from "@/data/military-guidance";
type SituationContent=Readonly<{
 shortAnswer:string;steps:readonly string[];evidence:readonly string[];
 recipient:string;limitation:string;
}>;
export function getMilitarySituationContent(topic:MilitaryTopic,situation:MilitarySituation):SituationContent{
 const guide=getMilitaryGuide(topic.slug);
 const title=situation.title.toLowerCase();
 const request=/получить копию|восстановить|получить расчёт|получить материалы|выдач|документ|выписк/.test(title);
 const complaint=/обжал|оспор|отказ|взыск|не выплач|не отвеч|не принимает|не направляет|не учитывает|не оказывает|незакон|не рассматривает|не перечислен|неположенн/.test(title);
 const application=/подать|оформ|как получить|как добиться|обратит|направлени|заявлени|перевод|отпуск/.test(title);
 const emergency=/ранени|медицинск.*помощ|госпитал|лечени|здоровь|экстрен/.test(title);
 const step1=request?"Уточните, каким органом оформлен нужный документ, его реквизиты и статус заявителя."
   :complaint?"Получите точный текст решения, отказа или подтверждение бездействия, выясните дату, когда стало известно о нарушении."
   :application?"Установите, предусмотрено ли применимой нормой право на выбранное действие именно для вашего статуса."
   :"Установите ваш правовой статус и дату обстоятельств, к которым относится вопрос.";
 const step2=request?"Определите право на получение документа и компетентного держателя; подготовьте адресный запрос с указанием требуемой копии."
   :complaint?"Определите компетентную инстанцию и срок обращения, отделите нарушение процедуры от несогласия с результатом."
   :application?"Уточните компетентного адресата, требования к обращению и подтверждающие обстоятельства документы."
   :"Сопоставьте обстоятельства с действующими нормами и установленными исключениями.";
 const step3=situation.kind==="information"
   ?"Для информационного вопроса дополнительных форм заполнять не требуется."
   :"При необходимости письменного обращения сохраняйте подтверждение подачи и полученный ответ.";
 const shortAnswer=situation.kind==="information"
   ?`Вопрос «${situation.title}» рассматривается с учётом вида военной службы, правового статуса и действующих специальных правил. ${guide.context}`
   :situation.kind==="mixed"
   ?`Решение по вопросу «${situation.title}» зависит от подтверждённых обстоятельств. ${guide.context} Если возникает основание для письменного обращения, документ подготавливается только для конкретного требования.`
   :`В ситуации «${situation.title}» может потребоваться юридически значимое обращение. ${guide.context} Тип документа, адресат и способ подачи определяются после проверки обстоятельств.`;
 return {
  shortAnswer,
  steps:[step1,step2,...(emergency?["При угрозе жизни или здоровью сначала необходима медицинская помощь; оформление документа не должно задерживать лечение."]:[]),step3],
  evidence:guide.evidence,recipient:guide.recipient,limitation:guide.caution
 };
}
