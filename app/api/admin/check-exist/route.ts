import { checkAdminExists } from "features/core/user/user.service";

export async function GET() {
  try {
    const adminExist = await checkAdminExists();
    return Response.json({ adminExist });
  } catch (error) {
    return Response.json({ adminExist: false });
  }
}
