import { describe, expect, it } from "vitest";
import { resolveSessionKey, stripReservedOpenClawAgentParams } from "./execute.js";

describe("resolveSessionKey", () => {
  it("prefixes run-scoped session keys with the configured agent", () => {
    expect(
      resolveSessionKey({
        strategy: "run",
        configuredSessionKey: null,
        agentId: "meridian",
        runId: "run-123",
        issueId: null,
      }),
    ).toBe("agent:meridian:paperclip:run:run-123");
  });

  it("prefixes issue-scoped session keys with the configured agent", () => {
    expect(
      resolveSessionKey({
        strategy: "issue",
        configuredSessionKey: null,
        agentId: "meridian",
        runId: "run-123",
        issueId: "issue-456",
      }),
    ).toBe("agent:meridian:paperclip:issue:issue-456");
  });

  it("prefixes fixed session keys with the configured agent", () => {
    expect(
      resolveSessionKey({
        strategy: "fixed",
        configuredSessionKey: "paperclip",
        agentId: "meridian",
        runId: "run-123",
        issueId: null,
      }),
    ).toBe("agent:meridian:paperclip");
  });

  it("does not double-prefix an already-routed session key", () => {
    expect(
      resolveSessionKey({
        strategy: "fixed",
        configuredSessionKey: "agent:meridian:paperclip",
        agentId: "meridian",
        runId: "run-123",
        issueId: null,
      }),
    ).toBe("agent:meridian:paperclip");
  });
});

describe("stripReservedOpenClawAgentParams", () => {
  it("removes Paperclip-only context fields before calling OpenClaw agent", () => {
    const result = stripReservedOpenClawAgentParams({
      message: "wake up",
      sessionKey: "agent:pieter:paperclip:issue:STO-1",
      idempotencyKey: "run-1",
      paperclip: { issueId: "STO-1" },
    });

    expect(result.strippedKeys).toEqual(["paperclip"]);
    expect(result.params).toEqual({
      message: "wake up",
      sessionKey: "agent:pieter:paperclip:issue:STO-1",
      idempotencyKey: "run-1",
    });
  });
});
