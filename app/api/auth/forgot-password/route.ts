import { apiError, safeApi } from "@/lib/security/api";
import { forgotPasswordSchema } from "@/lib/validators/auth";

export async function POST(request: Request): Promise<Response> {
  return safeApi(async () => {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) return apiError("Invalid payload", 422);
    console.info(`TODO: send reset email for ${parsed.data.email}`);
    return Response.json({ success: true });
  });
}
