import sampleData from "../src/data/sample-data";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {

  await prisma.product.createMany({
    data: sampleData.products,
  });

  console.log("Database seeded successfully");
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
