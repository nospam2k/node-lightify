"use strict";

const lightify = require(`../lib`);
const net = require("net");
const test = require(`ava`);

// Pretend to be a Lightify Gateway by returning mock responses for requests
// added in each test below.
const mockResponses = {};

// Mock Lightify Gateway server listening at localhost:4000.
let server;

test.before.cb(t => {
  server = net.createServer(socket => {
    socket.once(`data`, request => {
      const response = mockResponses[request.toString(`base64`)];
      socket.end(Buffer.from(response, `base64`));
    });
  });

  server.listen(4000, t.end);
});

test.after.always.cb(t => {
  server.close(t.end);
});

test.beforeEach(async t => {
  t.context.connection = new lightify.lightify(`127.0.0.1`);
  await t.context.connection.connect();
});

test.afterEach.always(t => {
  t.context.connection.dispose();
});

test(`discover`, async t => {
  mockResponses[
    `BwAAEwEAAAAB`
  ] = `ywEBEwEAAAAACQDia0RSCQAAJhiECgECBJICAQABZIwK/////0ExOSBUVyA2MCAwMQAAAAAAAAAAAAAAAFsPmtQCAAAmGIQKAQIEkgIBAAFkjAr/////QTE5IFRXIDYwIDAyAAAAAAAAAAAAAAAAZ/CPEekAACYYhEAQAFEhAgAAAWSMCgEAAP9EaW5pbmcgUm9vbQAAAAAASAAAAAAAAAAn6yS3BAAAJhiEAgECBJICAgABZIwKAQAA/0ExOSBUVyA2MCAwMwAAAAAAAAAAAAAAAJjIIq0EAAAmGIQCAQIEkgICAAFkjAoBAAD/QTE5IFRXIDYwIDA0AAAAAAAAAAAAAAAAqlN1EekAACYYhEAQAFEhAgAAAWSMCgEAAP9LaXRjaGVuAAAAAAAAAAAAAgAAAAAAAABF72hDBQAAJhiEAgECBJICBAABZIwKAQAA/0ExOSBUVyA2MCAwNQAAAAAAAAAAAAAAACWjiv4CAAAmGIQCAQIEkgIEAAFkjAoBAAD/QTE5IFRXIDYwIDA2AAAAAAAAAAAAAAAABNC7EukAACYYhEAQAFEhAgAAAWSMCgEAAP9MaXZpbmcgUm9vbQAAAAAAkQAAAAAAAAA=`;

  t.snapshot(await t.context.connection.discover());
});
