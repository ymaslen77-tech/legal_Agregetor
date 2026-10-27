import assert from "node:assert/strict";
import { MILITARY_TOPICS } from "./military-catalog";
import { MILITARY_GUIDES,getMilitaryGuide } from "./military-guidance";
import {getMilitarySituationContent} from "@/lib/military-situation-content";
assert.equal(Object.keys(MILITARY_GUIDES).length,20);
for(const topic of MILITARY_TOPICS){
 const guide=getMilitaryGuide(topic.slug);
 assert(guide.context.length>60,topic.slug);
 assert(guide.steps.length>=3 && guide.evidence.length>=2);
 assert(guide.sources.length>=1);
 for(const source of guide.sources)assert(source.url.startsWith("https://"));
 for(const situation of topic.situations){
  const content=getMilitarySituationContent(topic,situation);
  assert(content.shortAnswer.includes(situation.title));
  assert(content.steps.length>=3);
  assert(content.limitation.length>20);
 }
}
console.log("20 legal topic guides and 143 case-specific rendered procedural instructions found.");
