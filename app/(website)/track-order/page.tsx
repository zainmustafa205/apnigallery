// app/(website)/track-order/page.tsx
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getCartSessionId } from "@/lib/cart-session";
import { SectionHeading } from "@/components/shared/section-heading";
import OrderSummaryCard, {
  OrderCardData,
} from "@/components/track-order/order-summary-card";
import ManualLookupForm from "@/components/track-order/manual-lookup-form";

const ORDER_INCLUDE = {
  address: { select: { phone: true } },
  items: {
    include: {
      product: { select: { name: true } },
      variant: { select: { size: true, color: true, material: true } },
    },
  },
  payments: {
    where: { type: { in: ["ADVANCE", "FULL"] as ("ADVANCE" | "FULL")[] } },
    orderBy: { submittedAt: "desc" as const },
    take: 1,
  },
};

function serializeOrder(order: any): OrderCardData {
  const latestPayment = order.payments[0];
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    trackingCode: order.trackingCode,
    phone: order.address.phone,
    status: order.status,
    paymentMethod: order.paymentMethod,
    totalAmount: Number(order.totalAmount),
    advanceAmount: Number(order.advanceAmount),
    remainingAmount: Number(order.remainingAmount),
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item: any) => ({
      productName: item.product.name,
      variantLabel: [item.variant.size, item.variant.color, item.variant.material]
        .filter(Boolean)
        .join(" / "),
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.lineTotal),
    })),
    latestPayment: latestPayment
      ? {
          status: latestPayment.status,
          type: latestPayment.type,
          amount: Number(latestPayment.amount),
          submittedAt: latestPayment.submittedAt.toISOString(),
        }
      : null,
  };
}

export default async function TrackOrderPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let orders: OrderCardData[] = [];

  if (userId) {
    const found = await prisma.order.findMany({
      where: { userId },
      include: ORDER_INCLUDE,
      orderBy: { createdAt: "desc" },
    });
    orders = found.map(serializeOrder);
  } else {
    const guestSessionId = await getCartSessionId();
    if (guestSessionId) {
      const found = await prisma.order.findMany({
        where: { address: { guestSessionId } },
        include: ORDER_INCLUDE,
        orderBy: { createdAt: "desc" },
      });
      orders = found.map(serializeOrder);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-12 px-4 py-10">
      <SectionHeading title="Track Order" subtitle="اپنے آرڈر کی صورتحال دیکھیں" />

      <section className="bg-surface-alt border-lavender rounded-xl border p-5 sm:p-6">
        <h2 className="text-text-dark mb-1 text-lg font-medium">
          Find Order by Tracking Code
        </h2>
        <p className="text-text-dark/60 mb-4 text-sm">
          Tracking Code aur order me di gayi Phone Number dono zaroori hain.
        </p>
        <ManualLookupForm />
      </section>

      {orders.length > 0 && (
        <section>
          <h2 className="text-text-dark mb-4 text-lg font-medium">Recent Orders</h2>{" "}
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderSummaryCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
