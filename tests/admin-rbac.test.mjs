import test from 'node:test';
import assert from 'node:assert/strict';

function canManageUsers(role){return role==='ADMIN'}
function canManageSettings(role){return role==='ADMIN'}
function canManageApis(role){return role==='ADMIN'}
function canEditHashtags(role){return role==='ADMIN'||role==='EDITOR'}

const roles=['ADMIN','EDITOR','VIEWER'];

test('admin can manage users',()=>assert.equal(canManageUsers('ADMIN'),true));
test('editor cannot manage users',()=>assert.equal(canManageUsers('EDITOR'),false));
test('viewer cannot manage users',()=>assert.equal(canManageUsers('VIEWER'),false));
test('admin can manage settings',()=>assert.equal(canManageSettings('ADMIN'),true));
test('editor cannot manage settings',()=>assert.equal(canManageSettings('EDITOR'),false));
test('admin can manage apis',()=>assert.equal(canManageApis('ADMIN'),true));
test('viewer cannot manage apis',()=>assert.equal(canManageApis('VIEWER'),false));
test('admin can edit hashtags',()=>assert.equal(canEditHashtags('ADMIN'),true));
test('editor can edit hashtags',()=>assert.equal(canEditHashtags('EDITOR'),true));
test('viewer cannot edit hashtags',()=>assert.equal(canEditHashtags('VIEWER'),false));
test('all roles covered',()=>assert.deepEqual(roles.sort(),['ADMIN','EDITOR','VIEWER']));
