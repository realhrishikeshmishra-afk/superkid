import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { street, city, state, zipCode, phoneNumber, isDefault } = await req.json();

    if (!street || !city || !state || !zipCode || !phoneNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find the local user ID
    const dbUser = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found in DB" }, { status: 404 });
    }

    // If setting as default, unset others first
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: dbUser.id },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: dbUser.id,
        street,
        city,
        state,
        zipCode,
        phoneNumber,
        isDefault: isDefault || false
      }
    });

    return NextResponse.json({ success: true, address });
  } catch (error: any) {
    console.error("ADDRESS CREATE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const dbUser = await prisma.user.findUnique({ where: { clerkId } });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Ensure the address belongs to the user
    await prisma.address.delete({
      where: { 
        id,
        userId: dbUser.id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
