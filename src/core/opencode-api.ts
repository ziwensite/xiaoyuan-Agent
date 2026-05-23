import * as http from "node:http";
import * as https from "node:https";
import type { McpServerStatus, RateLimitSnapshot, TurnOptions, UserInput, WorkspaceResourceSnapshot } from "../types/app-server";
import { formatOpenCodeError } from "./opencode-errors";

export interface OpenCodeThreadResult {
  threadId: string;
}

interface OpenCodeApiOptions {
  baseUrl: string;
  directory: string;
}

export class OpenCodeApi {
  private readonly baseUrl: string;
  private readonly directory: string;

  constructor(options: OpenCodeApiOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.directory = options.directory;
  }

  health(): Promise<{ version?: string }> {
    return this.get("/global/health");
  }

  listProviders(): Promise<{ all: any[] }> {
    return this.get("/provider");
  }

  listAgents(): Promise<any[]> {
    return this.get("/agent");
  }

  listSessions(params: { start: number; limit: number }): Promise<any[]> {
    return this.get(`/session?start=${params.start}&limit=${params.limit}`);
  }

  getSessionMessages(params: { sessionID: string; limit: number }): Promise<any[]> {
    return this.get(`/session/${params.sessionID}/message?limit=${params.limit}`);
  }

  createSession(data: { title?: string; agent?: string; model?: { id: string; providerID: string } }): Promise<{ id: string; title?: string }> {
    return this.post("/session", data);
  }

  sendPrompt(params: { sessionID: string; parts: any[]; system?: string; tools?: Record<string, boolean> | any[]; agent?: string; model?: { providerID: string; modelID: string } }): Promise<{ parts: any[] }> {
    const body: any = {
      parts: params.parts,
      ...(params.system ? { system: params.system } : {}),
      ...(params.tools ? { tools: params.tools } : {}),
      ...(params.agent ? { agent: params.agent } : {}),
      ...(params.model ? { model: params.model } : {})
    };
    return this.post(`/session/${params.sessionID}/message`, body);
  }

  sendPromptAsync(params: { sessionID: string; parts: any[]; system?: string; tools?: Record<string, boolean> | any[]; agent?: string; model?: { providerID: string; modelID: string } }): Promise<void> {
    const body: any = {
      parts: params.parts,
      ...(params.system ? { system: params.system } : {}),
      ...(params.tools ? { tools: params.tools } : {}),
      ...(params.agent ? { agent: params.agent } : {}),
      ...(params.model ? { model: params.model } : {})
    };
    return this.post(`/session/${params.sessionID}/message`, body);
  }

  abortSession(sessionID: string): Promise<void> {
    return this.post(`/session/${sessionID}/abort`);
  }

  fileStatus(): Promise<any[]> {
    return this.get("/file/status");
  }

  updateSession(sessionID: string, data: { title?: string }): Promise<void> {
    return this.patch(`/session/${sessionID}`, data);
  }

  getSessionStatus(): Promise<{ rateLimits?: RateLimitSnapshot; rateLimitsByLimitId?: Record<string, RateLimitSnapshot | undefined> }> {
    return this.get("/session/status");
  }

  listMcpServers(): Promise<McpServerStatus[]> {
    return this.get("/mcp");
  }

  startMcpOAuth(name: string): Promise<{ url?: string }> {
    return this.post(`/mcp/${name}/auth`);
  }

  startThread(turnOptions: TurnOptions): Promise<OpenCodeThreadResult> {
    const m = parseModel(turnOptions.model);
    return this.createSession({
      title: "New Thread",
      ...(m ? { model: { id: m.modelId, providerID: m.providerId } } : {})
    }).then((session) => ({ threadId: session.id }));
  }

  startTurn(sessionId: string, input: UserInput[], turnOptions: TurnOptions): Promise<string> {
    const m = parseModel(turnOptions.model);
    return this.sendPrompt({
      sessionID: sessionId,
      parts: input.map((part) => {
        if (part.type === "text") return { type: "text", text: part.text };
        if (part.type === "localImage") return { type: "file", path: part.path, mime: "image/png" };
        if (part.type === "mention") return { type: "text", text: `[${part.name}](${part.path})` };
        if (part.type === "skill") return { type: "text", text: `@${part.name}` };
        return { type: "text", text: JSON.stringify(part) };
      }),
      ...(m ? { model: { providerID: m.providerId, modelID: m.modelId } } : {})
    }).then((result) => {
      const messageId = (result as any)?.id ?? "";
      return messageId || `turn_${Date.now()}`;
    });
  }

  interruptTurn(sessionId: string, _turnId: string): Promise<void> {
    return this.abortSession(sessionId);
  }

  resumeThread(sessionId: string, turnOptions: TurnOptions): Promise<void> {
    const m = parseModel(turnOptions.model);
    if (m) {
      return this.post(`/session/${sessionId}`, {
        model: { id: m.modelId, providerID: m.providerId }
      }).then(() => undefined);
    }
    return Promise.resolve();
  }

  setThreadName(sessionId: string, name: string): Promise<void> {
    return this.updateSession(sessionId, { title: name });
  }

  refreshRateLimits(): Promise<{ rateLimits?: RateLimitSnapshot | null; rateLimitsByLimitId?: Record<string, RateLimitSnapshot | undefined> | null }> {
    return this.getSessionStatus();
  }

  refreshMcpStatus(): Promise<McpServerStatus[]> {
    return this.listMcpServers();
  }

  private async get<T>(path: string): Promise<T> {
    const url = new URL(path, this.baseUrl);
    url.searchParams.set("directory", this.directory);
    const response = await nodeFetch(url.toString(), { method: "GET" });
    return parseOpenCodeResponse<T>(response, path);
  }

  private async post<T>(path: string, body?: any): Promise<T> {
    const response = await nodeFetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-opencode-directory": encodeURIComponent(this.directory) },
      body: body ? JSON.stringify(body) : undefined
    });
    return parseOpenCodeResponse<T>(response, path);
  }

  private async patch<T>(path: string, body?: any): Promise<T> {
    const response = await nodeFetch(`${this.baseUrl}${path}`, {
      method: "PATCH",
      headers: { "content-type": "application/json", "x-opencode-directory": encodeURIComponent(this.directory) },
      body: body ? JSON.stringify(body) : undefined
    });
    return parseOpenCodeResponse<T>(response, path);
  }
}

function parseModel(model: string): { providerId: string; modelId: string } | null {
  if (!model) return null;
  const nullIdx = model.indexOf("\0");
  if (nullIdx !== -1) {
    return { providerId: model.slice(0, nullIdx), modelId: model.slice(nullIdx + 1) };
  }
  const slashIdx = model.indexOf("/");
  if (slashIdx !== -1 && !model.includes(" ")) {
    return { providerId: model.slice(0, slashIdx), modelId: model.slice(slashIdx + 1) };
  }
  return { providerId: "", modelId: model };
}

async function parseOpenCodeResponse<T>(response: Response, path: string): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`OpenCode API ${path}: ${response.status} ${response.statusText}${text ? ` - ${text}` : ""}`);
  }
  const text = await response.text();
  if (!text || text === "OK") return undefined as unknown as T;
  const parsed = JSON.parse(text);
  if (parsed && typeof parsed === "object" && "error" in parsed && parsed.error) {
    throw new Error(`OpenCode API 错误：${formatOpenCodeError(parsed.error)}`);
  }
  if (parsed && typeof parsed === "object" && "data" in parsed) {
    return parsed.data as T;
  }
  return parsed as T;
}

async function nodeFetch(url: string, init: { method: string; headers?: Record<string, string>; body?: string }): Promise<Response> {
  const parsedUrl = new URL(url);
  const transport = parsedUrl.protocol === "https:" ? https : http;
  return new Promise<Response>((resolve, reject) => {
    const request = transport.request(parsedUrl, {
      method: init.method ?? "GET",
      headers: init.headers as Record<string, string>,
      timeout: 120000
    }, (response) => {
      const chunks: Buffer[] = [];
      response.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      response.on("end", () => {
        resolve(new Response(Buffer.concat(chunks), {
          status: response.statusCode ?? 0,
          statusText: response.statusMessage ?? "",
          headers: nodeHeadersToWeb(response.headers)
        }));
      });
    });
    request.on("timeout", () => {
      request.destroy(new Error("OpenCode 请求超时"));
    });
    request.on("error", reject);
    if (init.body) request.write(init.body);
    request.end();
  });
}

function nodeHeadersToWeb(headers: http.IncomingHttpHeaders): Headers {
  const result = new Headers();
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      for (const item of value) result.append(key, item);
    } else if (typeof value === "string") {
      result.set(key, value);
    }
  }
  return result;
}
