import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Ensure the user exists in our DB
    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email: "user@example.com", // Fallback, could be queried from Clerk API if needed
        name: "SuperKid Shopper",
      },
    });

    // Create dummy category if they don't exist (For Testing)
    await prisma.category.upsert({
      where: { id: "test-category" },
      update: {},
      create: {
        id: "test-category",
        name: "Test Category",
        slug: "test-category",
      }
    });

    // Create dummy products if they don't exist (For Testing)
    for (const item of items) {
      await prisma.product.upsert({
        where: { id: item.id.toString() },
        update: {},
        create: {
          id: item.id.toString(),
          name: item.name,
          slug: `fake-product-${item.id}`,
          price: item.price,
          categoryId: "test-category"
        }
      });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: dbUser.id,
        total: total,
        status: "processing",
        items: {
          create: items.map((item: any) => ({
            productId: item.id.toString(),
            quantity: item.qty,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("FAKE CHECKOUT ERROR:", error);
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
  }
}
