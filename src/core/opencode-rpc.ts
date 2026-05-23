export function formatJsonRpcError(error: { code?: number; message?: string; data?: any }): { message: string } {
  return { message: `错误码：${error?.code ?? 0} · ${error?.message ?? ""}` };
}
