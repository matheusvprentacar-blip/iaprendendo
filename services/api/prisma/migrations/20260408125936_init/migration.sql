-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "birth_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL,
    "attention_level" SMALLINT NOT NULL,
    "sensory_sensitivity" SMALLINT NOT NULL,
    "executive_functions" JSONB NOT NULL,
    "hyperfocos" TEXT[],
    "aversions" TEXT[],
    "current_support_level" VARCHAR(20) NOT NULL DEFAULT 'neutro',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_cards" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "skill_id" VARCHAR(50) NOT NULL,
    "bncc_code" VARCHAR(30) NOT NULL,
    "area" VARCHAR(50),
    "grade_year" VARCHAR(20),
    "objective" TEXT NOT NULL,
    "support_matrix" JSONB NOT NULL,

    CONSTRAINT "skill_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL,
    "skill_card_id" UUID NOT NULL,
    "support_level" VARCHAR(20) NOT NULL,
    "skin_theme" VARCHAR(50),
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telemetry_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mission_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "value" DOUBLE PRECISION,
    "metadata" JSONB,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telemetry_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculum_embeddings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "skill_card_id" UUID NOT NULL,
    "content" TEXT,

    CONSTRAINT "curriculum_embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_records" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL,
    "parent_id" UUID NOT NULL,
    "scope" TEXT[],
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_student_id_key" ON "student_profiles"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "skill_cards_skill_id_key" ON "skill_cards"("skill_id");

-- CreateIndex
CREATE INDEX "skill_cards_bncc_code_idx" ON "skill_cards"("bncc_code");

-- CreateIndex
CREATE INDEX "missions_student_id_status_idx" ON "missions"("student_id", "status");

-- CreateIndex
CREATE INDEX "telemetry_events_student_id_recorded_at_idx" ON "telemetry_events"("student_id", "recorded_at" DESC);

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_skill_card_id_fkey" FOREIGN KEY ("skill_card_id") REFERENCES "skill_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telemetry_events" ADD CONSTRAINT "telemetry_events_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telemetry_events" ADD CONSTRAINT "telemetry_events_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_embeddings" ADD CONSTRAINT "curriculum_embeddings_skill_card_id_fkey" FOREIGN KEY ("skill_card_id") REFERENCES "skill_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
