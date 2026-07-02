import { randomUUID } from "node:crypto";

import { eq, inArray } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";

import { games, recordVersions } from "@/db/schema";
import { closeDbClient, getDb } from "@/lib/db/client";
import {
  createEntity,
  createSubmission,
  getEntityById,
  updateAdminEntity,
  updateEntityStatus,
  updateSubmissionModeration,
  upsertGame
} from "./knowledge";

/**
 * Database-backed coverage for the approval-to-record and entity-publish
 * repository paths. Runs only when DATABASE_URL is configured (the Replit
 * dev workspace); it is skipped in environments without a database. All
 * records are created under a throwaway draft game and removed afterwards.
 */
const hasDb = Boolean(process.env.DATABASE_URL);
const suffix = randomUUID().replace(/-/g, "").slice(0, 10);
const reviewerId = "integration-test";

const auditRecordIds: string[] = [];
let gameId: string | undefined;

afterAll(async () => {
  if (!hasDb) {
    return;
  }

  const db = getDb();

  if (gameId) {
    // Cascades to entities and submissions created under the game.
    await db.delete(games).where(eq(games.id, gameId));
    auditRecordIds.push(gameId);
  }

  if (auditRecordIds.length > 0) {
    await db
      .delete(recordVersions)
      .where(inArray(recordVersions.recordId, auditRecordIds));
  }

  await closeDbClient();
});

describe.skipIf(!hasDb)("knowledge repository (database-backed)", () => {
  it("creates a linked draft entity with audit rows on approval", async () => {
    const game = await upsertGame({
      title: "Integration Test Game",
      slug: `integration-test-${suffix}`,
      platforms: [],
      status: "draft"
    });
    gameId = game.id;

    const submission = await createSubmission({
      gameId: game.id,
      submissionType: "vehicle",
      title: `Integration Test Vehicle ${suffix}`,
      description: "Created by the database-backed test suite."
    });
    auditRecordIds.push(submission.id);

    const updated = await updateSubmissionModeration(
      submission.id,
      { status: "approved", moderatorNotes: "Approved by integration test." },
      { reviewerId }
    );

    expect(updated?.status).toBe("approved");
    expect(updated?.proposedEntityId).toBeTruthy();

    const entity = await getEntityById(updated!.proposedEntityId!);
    auditRecordIds.push(entity!.id);

    expect(entity).toMatchObject({
      gameId: game.id,
      type: "vehicle",
      status: "draft",
      verification: "speculative"
    });

    const db = getDb();
    const entityAudits = await db
      .select()
      .from(recordVersions)
      .where(eq(recordVersions.recordId, entity!.id));
    const moderationAudits = await db
      .select()
      .from(recordVersions)
      .where(eq(recordVersions.recordId, submission.id));

    expect(entityAudits).toHaveLength(1);
    expect(entityAudits[0].tableName).toBe("entities");
    expect(moderationAudits).toHaveLength(1);
    expect(moderationAudits[0].newData).toMatchObject({ reviewerId });
  });

  it("suffixes the slug when approval collides with an existing entity", async () => {
    const title = `Integration Collision ${suffix}`;
    const baseSlug = `integration-collision-${suffix}`;

    const existing = await createEntity({
      gameId: gameId!,
      type: "vehicle",
      name: title,
      slug: baseSlug
    });
    auditRecordIds.push(existing.id);

    const submission = await createSubmission({
      gameId: gameId!,
      submissionType: "vehicle",
      title
    });
    auditRecordIds.push(submission.id);

    const updated = await updateSubmissionModeration(
      submission.id,
      { status: "approved" },
      { reviewerId }
    );

    const entity = await getEntityById(updated!.proposedEntityId!);
    auditRecordIds.push(entity!.id);

    expect(entity!.slug).not.toBe(baseSlug);
    expect(entity!.slug.startsWith(baseSlug.slice(0, 40))).toBe(true);
  });

  it("publishes an entity with a status audit row", async () => {
    const entity = await createEntity({
      gameId: gameId!,
      type: "weapon",
      name: `Integration Publish ${suffix}`,
      slug: `integration-publish-${suffix}`
    });
    auditRecordIds.push(entity.id);

    const published = await updateEntityStatus(
      entity.id,
      { status: "published" },
      { reviewerId }
    );

    expect(published?.status).toBe("published");

    const db = getDb();
    const audits = await db
      .select()
      .from(recordVersions)
      .where(eq(recordVersions.recordId, entity.id));

    expect(audits).toHaveLength(1);
    expect(audits[0].previousData).toMatchObject({ status: "draft" });
    expect(audits[0].newData).toMatchObject({
      status: "published",
      reviewerId
    });
  });

  it("skips the audit trail on a no-op admin edit", async () => {
    const entity = await createEntity({
      gameId: gameId!,
      type: "mission",
      name: `Integration Noop ${suffix}`,
      slug: `integration-noop-${suffix}`
    });
    auditRecordIds.push(entity.id);

    const result = await updateAdminEntity(
      entity.id,
      { name: entity.name },
      { reviewerId }
    );

    expect(result?.name).toBe(entity.name);

    const db = getDb();
    const audits = await db
      .select()
      .from(recordVersions)
      .where(eq(recordVersions.recordId, entity.id));

    expect(audits).toHaveLength(0);
  });

  it("clears an optional field via a null admin edit", async () => {
    const entity = await createEntity({
      gameId: gameId!,
      type: "vehicle",
      name: `Integration Clear ${suffix}`,
      slug: `integration-clear-${suffix}`,
      summary: "A summary that will be cleared."
    });
    auditRecordIds.push(entity.id);

    const updated = await updateAdminEntity(
      entity.id,
      { summary: null },
      { reviewerId }
    );

    expect(updated?.summary).toBeNull();

    const db = getDb();
    const audits = await db
      .select()
      .from(recordVersions)
      .where(eq(recordVersions.recordId, entity.id));

    expect(audits).toHaveLength(1);
    expect(audits[0].changedFields).toEqual(["summary"]);
  });
});
