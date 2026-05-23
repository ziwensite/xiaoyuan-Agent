export interface KnowledgeBaseNotificationRoute {
  swallow: boolean;
  rememberItemId?: string;
  collectAssistantDelta?: boolean;
}

export function routeKnowledgeBaseNotification(method: string, params: any, context: { threadId: string; turnId: string; itemIds: Set<string> }): KnowledgeBaseNotificationRoute {
  if (method === "item/started" && params?.item?.id && context.threadId) {
    return { swallow: true, rememberItemId: params.item.id };
  }
  if (method === "item/agentMessage/delta" && params?.itemId && context.itemIds?.has(params.itemId)) {
    return { swallow: true, collectAssistantDelta: true };
  }
  if (method === "error" && context.threadId) {
    return { swallow: true };
  }
  return { swallow: false };
}
