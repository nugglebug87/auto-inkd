import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

test('offline worker never intercepts API requests, external origins, or mutations',()=>{
 const listeners={};let intercepted=0;
 const context={self:{location:{origin:'https://amber-writer.vercel.app'},addEventListener:(name,fn)=>listeners[name]=fn},URL};
 vm.runInNewContext(readFileSync(new URL('../public/sw.js',import.meta.url),'utf8'),context);
 for(const [url,method] of [['https://amber-writer.vercel.app/api/write','GET'],['https://amber-writer.vercel.app/api/write','POST'],['https://other.example/','GET'],['https://amber-writer.vercel.app/','POST']]){
  listeners.fetch({request:{url,method},respondWith:()=>intercepted++});
 }
 assert.equal(intercepted,0);
});
