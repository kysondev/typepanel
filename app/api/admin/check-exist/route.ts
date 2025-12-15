import { adminExists } from "@auth/services/user.service";

export async function GET() {
  try {
    const adminExist = await adminExists();
    return Response.json({ adminExist });
  } catch (error) {
    return Response.json({ adminExist: false });
  }
}
