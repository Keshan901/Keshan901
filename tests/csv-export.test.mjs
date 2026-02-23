import test from 'node:test';
import assert from 'node:assert/strict';

function toCsv(rows){
  if(rows.length===0)return '';
  const headers=Object.keys(rows[0]);
  const body=rows.map(r=>headers.map(h=>JSON.stringify(r[h]??'')).join(',')).join('\n');
  return `${headers.join(',')}\n${body}`;
}

test('csv empty rows',()=>assert.equal(toCsv([]),''));
test('csv has headers and rows',()=>{
  const csv=toCsv([{tag:'#a',usage:2},{tag:'#b',usage:3}]);
  assert.ok(csv.startsWith('tag,usage'));
  assert.ok(csv.includes('"#a",2'));
});
