import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getCart } from "@/lib/actions/cart.actions";
import { getAdvancePercentage } from "@/lib/helpers/order-helpers";
import CheckoutForm from "@/components/checkout/checkout-form";
import type { CheckoutData, CheckoutItem } from "@/lib/checkout-types";
import { getCartSessionId } from "@/lib/cart-session";

function buildVariantLabel(variant: {
  size: string | null;
  color: string | null;
  material: string | null;
}) {
  return [variant.size, variant.color, variant.material].filter(Boolean).join(" / ");
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const mode = params.mode === "direct" ? "direct" : "cart";

  let checkoutData: CheckoutData;

  if (mode === "direct") {
    const productId = typeof params.productId === "string" ? params.productId : null;
    const variantId = typeof params.variantId === "string" ? params.variantId : null;
    const quantityRaw = typeof params.quantity === "string" ? params.quantity : "1";
    const designId = typeof params.designId === "string" ? params.designId : null;
    const specialInstructions =
      typeof params.specialInstructions === "string" ? params.specialInstructions : null;

    if (!productId || !variantId) {
      notFound();
    }

    const quantity = Math.max(1, Math.min(50, parseInt(quantityRaw, 10) || 1));

    const [product, variant] = await Promise.all([
      prisma.product.findUnique({ where: { id: productId } }),
      prisma.productVariant.findUnique({ where: { id: variantId } }),
    ]);

    if (!product || product.status === "ARCHIVED") notFound();
    if (!variant || variant.productId !== product.id || !variant.isActive) notFound();

    if (variant.stock < quantity) {
      redirect(`/products/${product.slug}?stockIssue=1`);
    }

    const unitPrice = Number(product.basePrice) + Number(variant.priceAdjustment);

    const item: CheckoutItem = {
      productId: product.id,
      variantId: variant.id,
      designId,
      quantity,
      specialInstructions,
      productName: product.name,
      productSlug: product.slug,
      variantLabel: buildVariantLabel(variant),
      unitPrice,
      lineTotal: unitPrice * quantity,
      hasDesign: Boolean(designId),
    };

    checkoutData = {
      mode: "direct",
      items: [item],
      subtotal: item.lineTotal,
    };
  } else {
    const cart = await getCart();

    if (!cart || cart.items.length === 0) {
      redirect("/cart");
    }

    const hasUnavailable = cart.items.some(
      (item) =>
        !item.variant.isActive ||
        item.product.status !== "ACTIVE" ||
        item.variant.stock < item.quantity
    );

    if (hasUnavailable) {
      redirect("/cart");
    }

    const items: CheckoutItem[] = cart.items.map((item) => {
      const unitPrice = item.product.basePrice + item.variant.priceAdjustment;
      return {
        productId: item.productId,
        variantId: item.variantId,
        designId: item.designId,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions,
        productName: item.product.name,
        productSlug: item.product.slug,
        variantLabel: buildVariantLabel(item.variant),
        unitPrice,
        lineTotal: unitPrice * item.quantity,
        hasDesign: Boolean(item.designId),
      };
    });

    checkoutData = {
      mode: "cart",
      items,
      subtotal: items.reduce((sum, i) => sum + i.lineTotal, 0),
    };
  }

  const advancePercentage = await getAdvancePercentage();

  // Autofill from the most recent order's address —
  // logged-in users via userId, guests via their cart_session cookie
  // (guestSessionId). If the guest's cookie has expired or they're on a
  // different device, no match is found — this is expected, same trust
  // model as guest cart/design resume.
  const session = await auth();
  let savedAddress = null;

  if (session?.user?.id) {
    const lastOrder = await prisma.order.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        address: {
          select: {
            label: true,
            addressLine: true,
            city: true,
            province: true,
            postalCode: true,
            phone: true,
          },
        },
      },
    });
    savedAddress = lastOrder?.address ?? null;
  } else {
    const guestSessionId = await getCartSessionId();
    if (guestSessionId) {
      const lastAddress = await prisma.address.findFirst({
        where: { guestSessionId },
        orderBy: { createdAt: "desc" },
        select: {
          label: true,
          addressLine: true,
          city: true,
          province: true,
          postalCode: true,
          phone: true,
        },
      });
      savedAddress = lastAddress ?? null;
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <CheckoutForm
        checkoutData={checkoutData}
        advancePercentage={advancePercentage}
        savedAddress={savedAddress}
      />
    </div>
  );
}
