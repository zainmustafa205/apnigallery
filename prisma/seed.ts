import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // --- Categories ---
  const mugs = await prisma.category.create({
    data: {
      name: "Mugs",
      slug: "mugs",
      description: "Custom printed ceramic and magic mugs",
    },
  });

  const shirts = await prisma.category.create({
    data: {
      name: "T-Shirts",
      slug: "t-shirts",
      description: "Custom printed round neck and polo shirts",
    },
  });

  // --- Products ---
  const photoMug = await prisma.product.create({
    data: {
      name: "Photo Print Mug",
      slug: "photo-print-mug",
      categoryId: mugs.id,
      description: "Ceramic mug with your custom photo printed on it",
      basePrice: 650,
      isCustomizable: true,
      status: "ACTIVE",
    },
  });

  const roundNeckShirt = await prisma.product.create({
    data: {
      name: "Custom Round Neck T-Shirt",
      slug: "custom-round-neck-tshirt",
      categoryId: shirts.id,
      description: "100% cotton round neck shirt with custom print",
      basePrice: 1200,
      isCustomizable: true,
      status: "ACTIVE",
    },
  });

  // --- Variants ---
  await prisma.productVariant.create({
    data: {
      productId: photoMug.id,
      color: "White",
      material: "Ceramic",
      sku: "MUG-PHOTO-WHITE-11OZ",
      stock: 50,
    },
  });

  await prisma.productVariant.create({
    data: {
      productId: roundNeckShirt.id,
      size: "M",
      color: "Black",
      material: "Cotton",
      sku: "TSHIRT-RN-BLK-M",
      stock: 30,
    },
  });

  await prisma.productVariant.create({
    data: {
      productId: roundNeckShirt.id,
      size: "L",
      color: "White",
      material: "Cotton",
      sku: "TSHIRT-RN-WHT-L",
      stock: 25,
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
