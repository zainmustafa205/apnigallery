// prisma/seed-gallery.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding gallery items...");

  const mugs = await prisma.category.findUniqueOrThrow({ where: { slug: "mugs" } });
  const shirts = await prisma.category.findUniqueOrThrow({ where: { slug: "t-shirts" } });

  await prisma.galleryItem.create({
    data: {
      title: "Custom Couple Photo Mug",
      imageUrl: "https://picsum.photos/seed/gallery1/800/800",
      categoryId: mugs.id,
      description: "Ek customer ke liye banaya gaya couple photo mug set",
      isFeatured: true,
    },
  });

  await prisma.galleryItem.create({
    data: {
      title: "Magic Color-Changing Mug",
      imageUrl: "https://picsum.photos/seed/gallery2/800/800",
      categoryId: mugs.id,
      description: "Garam paani dalte hi design reveal hota hai",
      isFeatured: false,
    },
  });

  await prisma.galleryItem.create({
    data: {
      title: "Family Reunion T-Shirts",
      imageUrl: "https://picsum.photos/seed/gallery3/800/800",
      categoryId: shirts.id,
      description: "Bulk order — 15 matching printed shirts ek family ke liye",
      isFeatured: true,
    },
  });

  await prisma.galleryItem.create({
    data: {
      title: "Corporate Event Polo Shirts",
      imageUrl: "https://picsum.photos/seed/gallery4/800/800",
      categoryId: shirts.id,
      description: "Company logo printed polo shirts, bulk corporate order",
      isFeatured: false,
    },
  });

  await prisma.galleryItem.create({
    data: {
      title: "Birthday Special Mug Gift Set",
      imageUrl: "https://picsum.photos/seed/gallery5/800/800",
      categoryId: mugs.id,
      description: "Personalized birthday message ke sath",
      isFeatured: false,
    },
  });

  await prisma.galleryItem.create({
    data: {
      title: "Graphic Print Round Neck Shirt",
      imageUrl: "https://picsum.photos/seed/gallery6/800/800",
      categoryId: null,
      description: "Custom graphic design print, single order",
      isFeatured: false,
    },
  });

  console.log("Gallery seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
