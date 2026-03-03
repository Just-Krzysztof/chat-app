-- DropIndex
DROP INDEX "Message_conversationId_idx";

-- CreateIndex
CREATE INDEX "ConversationParticipant_userId_idx" ON "ConversationParticipant"("userId");

-- CreateIndex
CREATE INDEX "Message_conversationId_createAt_idx" ON "Message"("conversationId", "createAt");
