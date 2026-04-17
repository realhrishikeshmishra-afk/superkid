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
    const { items, total, shipping } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!shipping) {
      return NextResponse.json({ error: "Shipping details required" }, { status: 400 });
    }

    // Ensure the user exists in our DB
    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        phone: shipping.phone,
        name: shipping.name
      },
      create: {
        clerkId: userId,
        email: "pending@superkid.com", // Webhook will update this, or we can fetch via Clerk SDK
        name: shipping.name,
        phone: shipping.phone
      },
    });

    // Save/Update the address in the saved addresses book
    await prisma.address.upsert({
      where: { id: `addr-${dbUser.id}` }, // We use a predictable ID for the default for now
      update: {
        street: shipping.street,
        city: shipping.city,
        state: shipping.state,
        zipCode: shipping.zip,
        phoneNumber: shipping.phone,
      },
      create: {
        id: `addr-${dbUser.id}`,
        userId: dbUser.id,
        street: shipping.street,
        city: shipping.city,
        state: shipping.state,
        zipCode: shipping.zip,
        phoneNumber: shipping.phone,
        isDefault: true
      }
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
        shippingStreet: shipping.street,
        shippingCity: shipping.city,
        shippingState: shipping.state,
        shippingZip: shipping.zip,
        shippingPhone: shipping.phone,
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
  } catch (error: any) {
    console.error("FAKE CHECKOUT ERROR:", error);
    return NextResponse.json({ 
      error: "Failed to process order", 
      details: error.message || "Unknown error" 
    }, { status: 500 });
  }
}
