import assert from "node:assert/strict";
import { MILITARY_TOPICS } from "@/data/military-catalog";
import { getMilitaryDocumentCandidate } from "@/data/military-document-candidates";
import {
  getMilitaryRelatedTopics,
  getMilitaryRelatedSituations,
  getMilitaryRelatedDocuments,
  militarySituationHref,
  militaryTopicHref,
  MILITARY_RELATED_GRAPH
} from "@/data/military-related-links";

assert.equal(MILITARY_TOPICS.length,20);
const canonicalPages = new Set<string>();
const generatorAnchors = new Set<string>();
for (const topic of MILITARY_TOPICS) {
  canonicalPages.add(militaryTopicHref(topic));
  for(const situation of topic.situations) {
    const href=militarySituationHref(topic,situation);
    canonicalPages.add(href);
    if(getMilitaryDocumentCandidate(topic,situation)) generatorAnchors.add(href+"#military-document-preparation");
  }
}
assert.equal(generatorAnchors.size,18);
assert.equal(canonicalPages.size,163);
const topicBySlug = new Map(MILITARY_TOPICS.map(topic => [topic.slug,topic]));
assert.deepEqual(Object.keys(MILITARY_RELATED_GRAPH.topicSlugs).sort(),MILITARY_TOPICS.map(x=>x.slug).sort());
assert.deepEqual(Object.keys(MILITARY_RELATED_GRAPH.localFlows).sort(),MILITARY_TOPICS.map(x=>x.slug).sort());

let totalQuestionLinks=0,crossCategoryLinks=0,totalDocumentLinks=0;
for(const topic of MILITARY_TOPICS) {
  const topicLinks=getMilitaryRelatedTopics(topic);
  assert(topicLinks.length>=2 && topicLinks.length<=4,topic.slug);
  assert.equal(new Set(topicLinks.map(x=>x.href)).size,topicLinks.length);
  for(const item of topicLinks){
    assert(canonicalPages.has(item.href),"Invalid topic link: "+item.href);
    assert(item.href!==militaryTopicHref(topic));
  }
  const flows=MILITARY_RELATED_GRAPH.localFlows[topic.slug];
  const covered = new Set(flows.flat());
  for(let i=0;i<topic.situations.length;i++)assert(covered.has(i),"Unlinked situation flow: "+topic.slug+"/"+i);
  for(const sequence of flows){
    assert(sequence.length>=2,"Orphaned sequence: "+topic.slug);
    for(const i of sequence)assert(Number.isInteger(i) && i>=0 && i<topic.situations.length,"Bad flow index: "+topic.slug+"/"+i);
  }
  for(const situation of topic.situations){
    const here=militarySituationHref(topic,situation);
    const questions=getMilitaryRelatedSituations(topic,situation);
    assert(questions.length>0 && questions.length<=6,"Missing related questions: "+here);
    assert.equal(new Set(questions.map(x=>x.href)).size,questions.length);
    for(const link of questions){
      assert(canonicalPages.has(link.href),"Broken question URL: "+link.href);
      assert(link.href!==here,"Self-link: "+here);
      assert(link.title.length>10 && link.detail.length>10);
      if(link.topicSlug!==topic.slug)crossCategoryLinks++;
    }
    const docs=getMilitaryRelatedDocuments(topic,situation);
    assert(docs.length<=4);
    assert.equal(new Set(docs.map(x=>x.href)).size,docs.length);
    for(const link of docs){
      assert(generatorAnchors.has(link.href),"A document link points at missing generator: "+link.href);
      assert(link.href.endsWith("#military-document-preparation"));
    }
    totalDocumentLinks+=docs.length;
    totalQuestionLinks+=questions.length;
  }
}
for(const [from,to] of MILITARY_RELATED_GRAPH.crossReferences){
  const a=topicBySlug.get(from[0])?.situations[from[1]];
  const b=topicBySlug.get(to[0])?.situations[to[1]];
  assert(a&&b,"Invalid cross-category edge: "+from[0]+" -> "+to[0]);
  const aTopic=topicBySlug.get(from[0])!,bTopic=topicBySlug.get(to[0])!;
  const aHref=militarySituationHref(aTopic,a),bHref=militarySituationHref(bTopic,b);
  assert(getMilitaryRelatedSituations(aTopic,a).some(x=>x.href===bHref),"Cross-link not visible: "+aHref);
  assert(getMilitaryRelatedSituations(bTopic,b).some(x=>x.href===aHref),"Missing backlink: "+bHref);
}
assert(crossCategoryLinks>=60,"Too few cross-category internal links");
assert(totalQuestionLinks>=143,"Insufficient related-question coverage");
assert(totalDocumentLinks>0,"Existing document generators should be connected");
console.log(JSON.stringify({
  topics: MILITARY_TOPICS.length,
  situations: MILITARY_TOPICS.reduce((sum,t)=>sum+t.situations.length,0),
  questionLinks:totalQuestionLinks,
  crossCategoryLinks,
  documentLinks:totalDocumentLinks,
  validGeneratorAnchors:generatorAnchors.size,
  invalidLinks:0
}));
