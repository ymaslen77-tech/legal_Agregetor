import {expect,test} from "@playwright/test";
import { MILITARY_TOPICS } from "../../src/data/military-catalog";

test("military catalog has 20 groups and never forces document intake",async({page})=>{
  await page.goto("/voennoe-pravo/");
  await expect(page.getByRole("heading",{name:"Военное право",exact:true})).toBeVisible();
  await expect(page.locator('section[aria-label="Темы военного права"] article')).toHaveCount(20);
  for(const topic of MILITARY_TOPICS){
    const topicPath=`/voennoe-pravo/${topic.slug}/`;
    await page.goto(topicPath);
    await expect(page.getByRole("heading",{level:1,name:topic.title})).toBeVisible();
    await expect(page.locator('section[aria-label="Конкретные ситуации"] li')).toHaveCount(topic.situations.length);
  }
  const info=MILITARY_TOPICS.flatMap(topic=>topic.situations.filter(s=>s.kind==="information").map(s=>({topic,s})))[0];
  await page.goto(`/voennoe-pravo/${info.topic.slug}/${info.s.slug}/`);
  await expect(page.getByRole("heading",{level:1,name:info.s.title})).toBeVisible();
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
});
