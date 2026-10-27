import assert from "node:assert/strict";
import { MILITARY_TOPICS, getMilitaryTopic, getMilitarySituation } from "./military-catalog";

assert.equal(MILITARY_TOPICS.length,20,"Twenty approved thematic groups are required");
const topicSlugs=new Set<string>();
let total=0,information=0,document=0,mixed=0;
for(const topic of MILITARY_TOPICS){
  assert(!topicSlugs.has(topic.slug),"duplicate topic slug: "+topic.slug);
  topicSlugs.add(topic.slug);
  assert.equal(getMilitaryTopic(topic.slug),topic);
  assert(topic.situations.length>0);
  const slugs=new Set<string>();
  for(const situation of topic.situations){
    assert(situation.slug && !slugs.has(situation.slug),"duplicate situation slug: "+topic.slug+"/"+situation.slug);
    slugs.add(situation.slug);
    assert.equal(getMilitarySituation(topic,situation.slug),situation);
    assert.equal(situation.legalReviewed,false);
    assert.deepEqual(situation.documentSlugs,[],"No unsupported legacy generators may survive");
    if(situation.kind==="information") information++;
    else if(situation.kind==="document") document++;
    else mixed++;
    total++;
  }
}
assert(information>0 && document>0 && mixed>0,"All three route kinds must be represented");
console.log(JSON.stringify({topics:MILITARY_TOPICS.length,situations:total,information,document,mixed}));
